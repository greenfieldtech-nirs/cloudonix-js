/**
 * @file Examples demonstrating XML formatting edge cases
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// Create a document that tests various edge cases for XML formatting
const cxml = new CXMLBuilder()
  .createResponse()
  // Test element with content but no attributes
  .addSay("Simple text content")
  
  // Test element with attributes but no content
  .addPause(2)
  
  // Test element with both attributes and content
  .addSay("Text with attributes", { voice: "Google:en-US-Neural2-F", language: "en-US" })
  
  // Test Dial with both direct content and nested elements 
  .addDial("+18005551212", {
    callerId: "+15551234567",
    timeout: 30
  })
  .addHeader("X-Forwarded-For", "127.0.0.1")
  .addHeader("X-Custom-Header", "test-value")
  .done()
  
  // Test self-closing elements
  .addHangup()
  .addReject({ reason: "busy" })
  
  // Test Gather with multiple nested elements of different types
  .addGather({
    input: "dtmf speech",
    timeout: 5
  })
  .addSay("First nested Say element")
  .addPause(1)
  .addPlay("https://example.com/audio/beep.mp3")
  .addSay("Second nested Say element")
  .done()
  
  .build();

console.log(cxml);