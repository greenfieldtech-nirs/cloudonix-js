/**
 * Example demonstrating the consistency of all verb implementations
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Create a response with verbs both at the top level and inside Dial/Gather
const response = cxml.createResponse()
  // Top-level verbs
  .addSay('This is a top-level Say element', { 
    voice: 'woman', 
    language: 'en-US' 
  })
  .addPlay('https://example.com/top-level-audio.wav', {
    loop: 2
  })
  .addPause(3, {
    answer: true
  })
  
  // Gather with nested verbs
  .addGather({
    input: 'dtmf',
    timeout: 5
  }, cxml => {
    cxml.addSay('This is a nested Say element', { 
      voice: 'woman',
      language: 'en-US'
    })
    .addPlay('https://example.com/nested-audio.wav', {
      loop: 2
    })
    .addPause(3);
  })
  
  // Dial with nested nouns
  .addDial({
    callerId: '+15551234567',
    timeout: 30
  }, cxml => {
    cxml.addHeader('X-Custom-Header', 'CustomValue')
        .addNumber('+15559876543');
  })
  
  .addHangup();

// Build and print the XML
console.log(response.build());