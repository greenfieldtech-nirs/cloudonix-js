/**
 * Example demonstrating improved nesting options for CXML elements
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Example 1: Nesting via options object for Gather
console.log("=== Example 1: Gather with nested elements via options ===");
let response = cxml.createResponse()
  .addSay('Welcome to the demonstration of nested CXML')
  .addGather({
    input: 'dtmf',
    timeout: 5,
    numDigits: 1,
    say: [
      { text: 'Please press a key', voice: 'woman' },
      { text: 'This is another say element' }
    ],
    play: [
      { url: 'https://example.com/beep.wav' }
    ],
    pause: [
      { length: 1 }
    ]
  })
  .done()
  .addHangup();

console.log(response.build());

// Example 2: Nesting via options object for Dial
console.log("\n=== Example 2: Dial with nested elements via options ===");
response = cxml.createResponse()
  .addSay('Connecting your call...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30,
    record: true,
    headers: [
      { name: 'X-First-Header', value: 'FirstValue' },
      { name: 'X-Second-Header', value: 'SecondValue' }
    ],
    number: '+15559876543'
  })
  .done()
  .addHangup();

console.log(response.build());

// Example 3: Nesting via options for SIP
console.log("\n=== Example 3: Dial with SIP via options ===");
response = cxml.createResponse()
  .addSay('Connecting to SIP...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30,
    headers: [
      { name: 'X-Custom-Header', value: 'CustomValue' }
    ],
    sip: {
      uri: 'sip:user@example.com',
      username: 'sipuser',
      password: 'password123'
    }
  })
  .done()
  .addHangup();

console.log(response.build());

// Example 4: Mixed approach - initial elements via options, additional via method chaining
console.log("\n=== Example 4: Mixed approach with options and method chaining ===");
response = cxml.createResponse()
  .addSay('Welcome to the mixed example')
  .addGather({
    input: 'dtmf',
    numDigits: 3,
    say: [
      { text: 'Initial say element', voice: 'woman' }
    ]
  })
  .play('https://example.com/additional.wav')
  .pause(2)
  .say('Additional say element')
  .done()
  .addHangup();

console.log(response.build());