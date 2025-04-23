/**
 * Example demonstrating callback-based nesting for CXML elements
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Example 1: Gather with callback-based nesting
console.log("=== Example 1: Gather with callback-based nesting ===");
let response = cxml.createResponse()
  .addSay('Welcome to the demonstration of nested CXML')
  .addGather({
    input: 'dtmf',
    timeout: 5,
    numDigits: 1
  }, cxml => {
    cxml.addSay('Please press a key', { voice: 'woman' })
        .addPlay('https://example.com/beep.wav')
        .addPause(1);
  })
  .addHangup();

console.log(response.build());

// Example 2: Dial with callback-based nesting (Number and Headers)
console.log("\n=== Example 2: Dial with Number and Headers ===");
response = cxml.createResponse()
  .addSay('Connecting your call...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30,
    record: true
  }, cxml => {
    cxml.addHeader('X-First-Header', 'FirstValue')
        .addHeader('X-Second-Header', 'SecondValue')
        .addNumber('+15559876543');
  })
  .addHangup();

console.log(response.build());

// Example 3: Dial with callback-based nesting (SIP and Header)
console.log("\n=== Example 3: Dial with SIP and Header ===");
response = cxml.createResponse()
  .addSay('Connecting to SIP...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  }, cxml => {
    cxml.addHeader('X-Custom-Header', 'CustomValue')
        .addSip('sip:user@example.com', {
          username: 'sipuser',
          password: 'password123'
        });
  })
  .addHangup();

console.log(response.build());

// Example 4: String-based shorthand for number with callback for headers
console.log("\n=== Example 4: String-based shorthand with callback ===");
response = cxml.createResponse()
  .addSay('Direct number dialing...')
  .addDial('+15559876543', cxml => {
    cxml.addHeader('X-Custom-Header', 'CustomValue');
  })
  .addHangup();

console.log(response.build());