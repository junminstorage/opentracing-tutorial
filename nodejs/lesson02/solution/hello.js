'use strict';

const assert = require('assert');
const initTracer = require('../../lib/tracing').initTracer;

function sayHello(helloTo) {
    var span = tracer.startSpan('say-hello');
    span.setTag('hello-to', helloTo);

    var helloStr = format_string(helloTo, span);
    
    print_string(helloStr, span);
    
    span.finish();

    return helloStr;
}  

function format_string(helloTo, root_span) {
    var span = tracer.startSpan('format_string', {childOf: root_span.context()});
    var formattedStr = `Hello, ${helloTo}!`;

    span.log({
        'event': 'format-string',
        'value': helloTo
    });

    span.finish();    
    return formattedStr;
}

function print_string(helloStr, root_span) {
    var span = tracer.startSpan('print_string', {childOf: root_span.context()});

    console.log(helloStr);

    span.log({
        'event': 'print-string',
        'value': helloStr
    });
    span.finish();
}
  
assert.ok(process.argv.length == 3, 'expecting one argument');

const helloTo = process.argv[2];

const tracer = initTracer('hello-world');

sayHello(helloTo);

setTimeout( e => {tracer.close();}, 12000);