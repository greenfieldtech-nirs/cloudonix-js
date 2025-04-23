/**
 * Example demonstrating the Header order in Dial
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Headers added before Number
console.log("=== Example 1: Headers added before Number ===");
let response = cxml.createResponse()
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  })
  .addHeader('X-First-Header', 'FirstValue')
  .addHeader('X-Second-Header', 'SecondValue')
  .addNumber('+15559876543')
  .done()
  .addHangup();

console.log(response.build());

// Header added after Number
console.log("\n=== Example 2: Header added after Number ===");
response = cxml.createResponse()
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  })
  .addNumber('+15559876543')
  .addHeader('X-Custom-Header', 'CustomValue')
  .done()
  .addHangup();

console.log(response.build());