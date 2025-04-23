/**
 * Example demonstrating nested CXML elements using the cxml attribute pattern
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Create a response with a Gather element that contains nested elements
const response = cxml.createResponse()
  .addSay('Welcome to the demonstration of nested CXML')
  .addGather({
    input: 'dtmf',
    timeout: 5,
    numDigits: 1
  })
  .addSay('Please press a key', { voice: 'woman' })
  .addPlay('https://example.com/beep.wav')
  .addPause(1)
  .done()
  .addHangup();

// Build and print the XML
console.log(response.build());