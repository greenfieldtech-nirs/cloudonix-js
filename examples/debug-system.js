/**
 * @file Debug script for the System element
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Debug System element
const SystemNoun = require('../src/verbs/converseNouns/system');
console.log('SystemNoun:', SystemNoun);

// Create a simple test
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    console.log('Adding System element with type:');
    cxml.addSystem('This is a test system message');
  });

// Get the XML output
const xml = builder.build();
console.log('XML output:');
console.log(xml);

// Debug what's happening in the rendering
const converseElement = builder.elements[0];
console.log('Converse element:');
console.log(JSON.stringify(converseElement, null, 2));

// Look at the cxml property directly
if (converseElement.element && converseElement.element.cxml) {
  console.log('CXML nested elements:');
  console.log(JSON.stringify(converseElement.element.cxml, null, 2));
}