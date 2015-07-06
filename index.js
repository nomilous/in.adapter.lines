var EventEmitter = require('events').EventEmitter;

$$in.adapters.lines = function(opts, inArgs, arg, results) {

  // all expansion results will have same adapters
  // only need check the first

  var isStream = results[0].adapters.indexOf('stream') >= 0;
  var isBuffer = results[0].adapters.indexOf('buffer') >= 0;

  if (isBuffer) return;
  
  results.forEach(function(action) {
    if (typeof action.value === 'undefined') return;
    if (isStream) return handleStream(action);

    if (action.value.match(/\r\n/)) {
      action.value = action.value.split(/\r\n/);
      return;
    }

    action.value = action.value.split(/\n/);
    return
  });
}

function handleStream(action) {

  var inmitter = action.value;
  var outmitter = new EventEmitter();
  var buf = '', delim;

  action.value = outmitter;

  inmitter.on('error', function(e) {
    if (outmitter.listeners('error').length > 0) outmitter.emit('error', e)
    else console.error(e.toString());
  });

  inmitter.on('end', function() {
    if (buf.length > 0) outmitter.emit('data', buf);
    outmitter.emit('end');
  });

  inmitter.on('data', function(data) {
    var lines;

    if (!delim) {
      if (data.match(/\r\n/)) delim = '\r\n'  // regex may be faster.. ?
      else if (data.match(/\n/)) delim = '\n'
      else {
        buf += data;
        return;
      }
    }

    buf += data;
    lines = buf.split(delim);
    if (lines[lines.length - 1] !== '') {
      // last line did not end in eol, 
      // assume it's part of pending next line
      buf = lines.pop();
    } else {
      buf = '';
    }

    lines.forEach(function(line) {
      outmitter.emit('data', line);
    })

  });
}