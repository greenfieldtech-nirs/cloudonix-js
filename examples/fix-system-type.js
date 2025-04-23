/**
 * @file Fix the System/s tag issue with a direct replacement approach
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Create a builder that would normally use <s> tags
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    cxml.addSystem('This is a test system message');
  });

// Build the XML but replace <s> with <System> directly
let xml = builder.build();
xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');

console.log('Fixed XML output:');
console.log(xml);

// Now, let's try to modify the internal implementation of Converse verb
const ConverseVerb = require('../src/verbs/converse');
const originalAddSystem = ConverseVerb.ConverseBuilder.prototype.addSystem;

// Override the addSystem method to use a type of 's' instead of 'System'
ConverseVerb.ConverseBuilder.prototype.addSystem = function(text) {
  const systemElement = require('../src/verbs/converseNouns/system').create(text);
  
  this.converseElement.cxml.push({
    // Use 's' as the type instead of 'System'
    type: 's',
    element: systemElement
  });
  
  return this;
};

// Test the implementation with the updated method
const builder2 = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    cxml.addSystem('This is a test system message with fixed implementation');
  });

console.log('\nImplementation-fixed XML output:');
console.log(builder2.build());