objective 'make lines', (should) ->

    trace.filter = true

    before ->

        global.$$in ||=
            adapters: {}

    beforeEach ->

        @opts = {}
        @inArgs = {}
        @arg = {}
        @results = [{
            adapters: []
            value: ''
            toString: -> 'in action'
        }]

    it 'divides action value into lines', (Module) ->

        @results[0].value = 'one\ntwo\n'

        Module @opts, @inArgs, @arg, @results

        @results[0].value.should.eql ['one', 'two']


    it 'streams lines', (Module, done) ->

        @results[0].adapters = ['stream']

        @results[0].value = on: (e, f) ->

            if e == 'data' 
                process.nextTick -> 
                    f 'one\ntwo\n'

        Module @opts, @inArgs, @arg, @results

        received = []

        @results[0].value.on 'data', (data) -> received.push data

        setTimeout (->
            received.should.eql ['one', 'two']
            done()
        ), 20




    it 'supports lines spread across emits', (Module, done) ->

        @results[0].adapters = ['stream']

        @results[0].value = on: (e, f) ->

            if e == 'data' 
                process.nextTick -> 
                    f 'one\ntw'
                    process.nextTick ->
                        f 'o\nthree\n'

        Module @opts, @inArgs, @arg, @results

        received = []

        @results[0].value.on 'data', (data) -> received.push data

        setTimeout (->
            received.should.eql ['one', 'two', 'three']
            done()
        ), 20

            