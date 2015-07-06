# in.adapter.lines

Adapter for [in.](https://github.com/nomilous/in.)

This adapter is bundled with in.

Divides inbound argument into lines.

eg.

```javascript
$$in(function(lines) { // in.as.lines read README.md
  
})
```


```javascript
$$in(function(log) { // in.as.stream.lines $ tail -F /var/log/syslog
  log.on('data', function(line) {

  });
})
```
