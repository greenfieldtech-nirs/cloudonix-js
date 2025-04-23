/**
 * Example demonstrating nested CXML elements in Dial using the cxml attribute pattern
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Example 1: Using Dial with Number and Headers
console.log("=== Example 1: Dial with Number and Headers ===");
let response = cxml.createResponse()
  .addSay('Connecting your call...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30,
    record: true
  })
  .addNumber('+15559876543')
  .addHeader('X-Custom-Header', 'CustomValue')
  .addHeader('X-Another-Header', 'AnotherValue')
  .done()
  .addHangup();

console.log(response.build());

// Example 2: Using Dial with Sip and Headers
console.log("\n=== Example 2: Dial with SIP and Headers ===");
response = cxml.createResponse()
  .addSay('Connecting to SIP...')
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  })
  .addSip('sip:user@example.com', {
    username: 'sipuser',
    password: 'password123'
  })
  .addHeader('X-Custom-Header', 'CustomValue')
  .done()
  .addHangup();

console.log(response.build());

// Example 3: Using Dial with Conference
console.log("\n=== Example 3: Dial with Conference ===");
response = cxml.createResponse()
  .addSay('Joining conference...')
  .addDial({
    callerId: '+15551234567',
    timeout: 60
  })
  .addConference('myconference', {
    muted: false,
    beep: true
  })
  .addHeader('X-Custom-Header', 'CustomValue')
  .done()
  .addHangup();

console.log(response.build());