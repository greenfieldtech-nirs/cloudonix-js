/**
 * Example demonstrating nested syntax for CXML elements
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Example with Gather using nested syntax
console.log("=== Example 1: Gather with nested syntax ===");
let response = cxml.createResponse()
  .addSay('Welcome to the demonstration of nested CXML')
  .addGather({
    input: 'dtmf',
    timeout: 5,
    numDigits: 1
  })
  .say('Please press a key', { voice: 'woman' })
  .play('https://example.com/beep.wav')
  .pause(1)
  .done()
  .addHangup();

console.log(response.build());

// Example with Dial using nested syntax
console.log("\n=== Example 2: Dial with Number and Headers using nested syntax ===");
response = cxml.createResponse()
  .addSay('Connecting your call...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30,
    record: true
  })
  .header('X-First-Header', 'FirstValue')
  .header('X-Second-Header', 'SecondValue')
  .number('+15559876543')
  .done()
  .addHangup();

console.log(response.build());

// Example with Dial using SIP
console.log("\n=== Example 3: Dial with SIP using nested syntax ===");
response = cxml.createResponse()
  .addSay('Connecting to SIP...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  })
  .header('X-Custom-Header', 'CustomValue')
  .sip('sip:user@example.com', {
    username: 'sipuser',
    password: 'password123'
  })
  .done()
  .addHangup();

console.log(response.build());