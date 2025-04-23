/**
 * @file Example demonstrating deeply nested element structures
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// Create a complex document with deeply nested elements
const cxml = new CXMLBuilder()
  .createResponse()
  // Welcome message
  .addSay("Welcome to the deeply nested example test.", {
    voice: "Google:en-US-Neural2-F",
    language: "en-US"
  })
  .addPause(1)
  
  // First level gather
  .addGather({
    input: "dtmf speech",
    timeout: 10,
    action: "https://example.com/first-level",
    method: "POST"
  })
  .addSay("This is the first level menu.", { voice: "Google:en-US-Neural2-F" })
  .addPause(0.5)
  .addSay("For the second level, press 1.", { voice: "Google:en-US-Neural2-F" })
  .done()
  
  // Dial with multiple noun elements
  .addDial({
    action: "https://example.com/handle-dial",
    timeout: 30,
    callerId: "+15551234567"
  })
  .addNumber("+18005551212")
  .addNumber("+18005552323")
  .addSip("sip:example@sip.example.com", { username: "user", password: "pass" })
  .addConference("room123", { 
    muted: false, 
    startConferenceOnEnter: true,
    endConferenceOnExit: true
  })
  .addHeader("X-Custom-Header", "custom-value")
  .addHeader("X-Priority", "high")
  .done()
  
  // Another Gather with more nested elements
  .addGather({
    input: "dtmf speech",
    timeout: 5,
    action: "https://example.com/complex-menu",
    method: "POST",
    numDigits: 2
  })
  .addSay("Please select from the following options:", { voice: "Google:en-US-Neural2-F" })
  .addPause(0.5)
  .addPlay("https://example.com/audio/menu-options.mp3")
  .addPause(0.5)
  .addSay("Press a number from 10 to 99.", { voice: "Google:en-US-Neural2-F" })
  .done()
  
  // More standalone elements
  .addPause(1)
  .addPlay("https://example.com/audio/processing.mp3", { loop: 2 })
  .addSay("Thank you for your selection.", { voice: "Google:en-US-Neural2-F" })
  .addHangup()
  .build();

console.log(cxml);