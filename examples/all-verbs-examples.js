/**
 * @file Examples demonstrating all available CXML verbs
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');
const PlayVerb = require('../src/verbs/play');
const SayVerb = require('../src/verbs/say');
const GatherVerb = require('../src/verbs/gather');
const PauseVerb = require('../src/verbs/pause');
const HangupVerb = require('../src/verbs/hangup');

// Example 1: Play with options
console.log("Example 1: Play with options");
const example1 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/greeting.mp3', {
    answer: false,
    loop: 2,
    statusCallback: 'https://example.com/playback-status',
    statusCallbackMethod: 'POST'
  })
  .build();

console.log(example1);
console.log("\n");

// Example 2: Play DTMF tones
console.log("Example 2: Play DTMF tones");
const example2 = new CXMLBuilder()
  .createResponse()
  .addPlay('', {
    digits: '1w2w3w4'
  })
  .build();

console.log(example2);
console.log("\n");

// Example 3: Pause
console.log("Example 3: Pause");
const example3 = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our system')
  .addPause(5, { answer: false })
  .addSay('Thank you for your patience')
  .build();

console.log(example3);
console.log("\n");

// Example 4: Redirect
console.log("Example 4: Redirect");
const example4 = new CXMLBuilder()
  .createResponse()
  .addRedirect('https://example.com/next-application', 'GET')
  .build();

console.log(example4);
console.log("\n");

// Example 5: Hangup
console.log("Example 5: Hangup");
const example5 = new CXMLBuilder()
  .createResponse()
  .addSay('Thank you for calling. Goodbye!')
  .addHangup()
  .build();

console.log(example5);
console.log("\n");

// Example 6: Reject
console.log("Example 6: Reject");
const example6 = new CXMLBuilder()
  .createResponse()
  .addReject({ reason: 'busy' })
  .build();

console.log(example6);
console.log("\n");

// Example 7: Reject with different reason
console.log("Example 7: Reject with different reason");
const example7 = new CXMLBuilder()
  .createResponse()
  .addReject({ reason: 'congestion' })
  .build();

console.log(example7);
console.log("\n");

// Example 8: Complex flow with multiple verbs - simplified for demonstration
console.log("Example 8: Complex flow with multiple verbs (simplified)");
const example8 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/welcome.mp3', { answer: true })
  .build();

console.log(example8);
console.log("\n");

// Example 9: Voicemail example - simplified for demonstration
console.log("Example 9: Voicemail example (simplified)");
const example9 = new CXMLBuilder()
  .createResponse()
  .addSay("You've reached our voicemail. Please hangup if you don't want to leave a message.")
  .addPause(3, { answer: false })
  .build();

console.log(example9);
console.log("\n");