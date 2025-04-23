/**
 * Example demonstrating the consistency of addSay inside and outside of Gather
 */
'use strict';

const { CXMLBuilder } = require('../src/cxml');

// Create a new CXML builder
const cxml = new CXMLBuilder();

// Create a response with Say both at the top level and inside Gather
const response = cxml.createResponse()
  // Top-level Say with voice and language options
  .addSay('This is a top-level Say element', { 
    voice: 'woman', 
    language: 'en-US' 
  })
  // Gather with a nested Say that has the same options
  .addGather({
    input: 'dtmf',
    timeout: 5
  }, cxml => {
    cxml.addSay('This is a nested Say element', { 
      voice: 'woman',
      language: 'en-US'
    });
  })
  .addHangup();

// Build and print the XML
console.log(response.build());