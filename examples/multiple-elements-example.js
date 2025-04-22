/**
 * @file Example demonstrating the use of multiple elements in sequence
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// Example 1: Multiple Say elements
console.log("Example 1: Multiple Say elements");
const example1 = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our system.')
  .addSay('Please listen carefully as our menu options have changed.')
  .addSay('For sales, press 1. For support, press 2.')
  .build();

console.log(example1);
console.log("\n");

// Example 2: Multiple Play elements
console.log("Example 2: Multiple Play elements");
const example2 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/welcome.mp3')
  .addPlay('https://example.com/audio/instructions.mp3')
  .addPlay('https://example.com/audio/options.mp3')
  .build();

console.log(example2);
console.log("\n");

// Example 3: Multiple Pause elements
console.log("Example 3: Multiple Pause elements");
const example3 = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our system.')
  .addPause(1)
  .addSay('Please listen carefully.')
  .addPause(2)
  .addSay('For sales, press 1. For support, press 2.')
  .build();

console.log(example3);
console.log("\n");

// Example 4: Mixed element types in sequence
console.log("Example 4: Mixed element types in sequence");
const example4 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/welcome.mp3')
  .addPause(1)
  .addSay('Please listen to the following options.')
  .addPause(1)
  .addPlay('https://example.com/audio/menu.mp3')
  .addPause(2)
  .addSay('Thank you for calling.')
  .addHangup()
  .build();

console.log(example4);
console.log("\n");

// Example 5: Multiple elements with different configurations
console.log("Example 5: Multiple elements with different configurations");
const example5 = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our premium service.', { voice: 'man', language: 'en-US' })
  .addSay('Please wait while we connect you.', { voice: 'woman', language: 'en-US' })
  .addPlay('https://example.com/audio/hold-music.mp3', { loop: 0 }) // Play continuously
  .build();

console.log(example5);
console.log("\n");

// Example 6: Combining with Gather
console.log("Example 6: Combining with Gather");
const example6 = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our automated system.')
  .addPause(1)
  .addGather({
    input: 'dtmf',
    numDigits: 1,
    timeout: 5,
    action: 'https://example.com/process-input'
  })
  .addSay('Please press a number.')
  .done()
  .addSay('We did not receive your input.')
  .addRedirect('https://example.com/retry')
  .build();

console.log(example6);
console.log("\n");

// Example 7: Voicemail scenario
console.log("Example 7: Voicemail scenario");
const example7 = new CXMLBuilder()
  .createResponse()
  .addSay("You've reached our voicemail.", { answer: false })
  .addPause(1, { answer: false })
  .addSay("Please leave a message after the beep.", { answer: false })
  .addPlay('https://example.com/audio/beep.mp3')
  // Record would go here if implemented
  .addPause(1)
  .addSay("Thank you for your message.")
  .addHangup()
  .build();

console.log(example7);
console.log("\n");

// Example 8: IVR menu with multiple options
console.log("Example 8: IVR menu with multiple options");
const example8 = new CXMLBuilder()
  .createResponse()
  .addSay("Welcome to our company phone system.")
  .addPause(1)
  .addSay("For sales, press 1.")
  .addPause(0.5)
  .addSay("For support, press 2.")
  .addPause(0.5)
  .addSay("For billing, press 3.")
  .addPause(0.5)
  .addSay("Or stay on the line to speak with an operator.")
  .addGather({
    input: 'dtmf',
    numDigits: 1,
    timeout: 10,
    action: 'https://example.com/process-menu'
  })
  .done()
  .addSay("Connecting you to an operator.")
  .build();

console.log(example8);
console.log("\n");