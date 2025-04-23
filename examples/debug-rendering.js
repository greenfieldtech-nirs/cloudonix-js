/**
 * @file Debug script for XML rendering
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

// Load the original modules
const CXMLBuilder = require('../src/builder');
const originalRenderElement = CXMLBuilder.prototype._renderElement;

// Monkey patch the _renderElement method to log its inputs and outputs
CXMLBuilder.prototype._renderElement = function(element, indentLevel) {
  console.log('Rendering element:');
  console.log('  Type:', element.type);
  console.log('  Content:', element.content);
  console.log('  Has cxml:', element.element && element.element.cxml ? 'yes' : 'no');
  
  if (element.element && element.element.cxml) {
    console.log('  CXML items:');
    for (const item of element.element.cxml) {
      console.log('    - Item type:', item.type);
      console.log('      Item content:', item.element['#text']);
    }
  }
  
  // Call the original method and log the result
  const result = originalRenderElement.call(this, element, indentLevel);
  
  console.log('  Result:');
  console.log(result);
  console.log('---');
  
  return result;
};

// Create a simple test with a System element
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    console.log('Adding System element with type:');
    cxml.addSystem('This is a test system message');
  });

// Get the XML output
const xml = builder.build();
console.log('Final XML output:');
console.log(xml);