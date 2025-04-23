/**
 * @file Example demonstrating basic CXML builder usage
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Example 1: Basic Play element
const playExample = new CXMLBuilder()
  .createResponse()
  .addPlay('https://example.com/audio.mp3')
  .build();

console.log('Example 1: Play audio');
console.log(playExample);
console.log();

// Example 2: Say with text-to-speech
const sayExample = new CXMLBuilder()
  .createResponse()
  .addSay('Hello, welcome to Cloudonix!', {
    voice: 'woman',
    language: 'en-US'
  })
  .build();

console.log('Example 2: Say with TTS');
console.log(sayExample);
console.log();

// Example 3: Gather digits
const gatherExample = new CXMLBuilder()
  .createResponse()
  .addSay('Please enter your account number followed by the pound sign.')
  .addGather({
    numDigits: 10,
    finishOnKey: '#',
    timeout: 15,
    action: '/handle-account'
  })
  .build();

console.log('Example 3: Gather digits');
console.log(gatherExample);
console.log();

// Example 4: Redirect
const redirectExample = new CXMLBuilder()
  .createResponse()
  .addRedirect('/next-step', 'GET')
  .build();

console.log('Example 4: Redirect');
console.log(redirectExample);
console.log();

// Example 5: Hangup
const hangupExample = new CXMLBuilder()
  .createResponse()
  .addHangup()
  .build();

console.log('Example 5: Hangup');
console.log(hangupExample);
console.log();