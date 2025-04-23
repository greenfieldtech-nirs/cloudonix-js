/**
 * @file Examples demonstrating the Play verb functionality
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// Example 1: Basic Play - Playing an audio file
console.log("Example 1: Basic Play - Playing an audio file");
const example1 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/greeting.mp3')
  .build();

console.log(example1);
console.log("\n");

// Example 2: Play with early media (no answer)
console.log("Example 2: Play with early media (no answer)");
const example2 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/ringback.mp3', {
    answer: false
  })
  .build();

console.log(example2);
console.log("\n");

// Example 3: Play DTMF tones
console.log("Example 3: Play DTMF tones");
const example3 = new CXMLBuilder()
  .createResponse()
  .addPlay('', {
    digits: '1w2w3' // Play 1, wait 0.5s, play 2, wait 0.5s, play 3
  })
  .build();

console.log(example3);
console.log("\n");

// Example 4: Play with looping
console.log("Example 4: Play with looping");
const example4 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/hold-music.mp3', {
    loop: 5 // Play the file 5 times
  })
  .build();

console.log(example4);
console.log("\n");

// Example 5: Play with continuous looping
console.log("Example 5: Play with continuous looping");
const example5 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/hold-music.mp3', {
    loop: 0 // Play continuously until the call ends
  })
  .build();

console.log(example5);
console.log("\n");

// Example 6: Play with status callback
console.log("Example 6: Play with status callback");
const example6 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/announcement.mp3', {
    statusCallback: 'https://example.com/play-status',
    statusCallbackMethod: 'POST'
  })
  .build();

console.log(example6);
console.log("\n");

// Example 7: Play with multiple options
console.log("Example 7: Play with multiple options");
const example7 = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio/welcome.mp3', {
    answer: true,
    loop: 2,
    statusCallback: 'https://example.com/play-complete',
    statusCallbackMethod: 'GET'
  })
  .build();

console.log(example7);
console.log("\n");

// Example 8: Play in a sequence
console.log("Example 8: Play in a sequence");
const builder8 = new CXMLBuilder();
builder8.createResponse();

// Add first element
builder8.document.Response.Say = { '#text': 'Welcome to our system' };

// Add Play element
builder8.document.Response.Play = {
  '@_answer': true,
  '#text': 'https://example.com/audio/instructions.mp3'
};

// Add Hangup element
builder8.document.Response.Hangup = {};

console.log(builder8.build());
console.log("\n");