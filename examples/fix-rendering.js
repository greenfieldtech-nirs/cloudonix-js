/**
 * @file Fix the System rendering issue
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

// Load the builder module directly to modify the prototype
const CXMLBuilder = require('../src/builder');

// Fix the issue by creating a special version of the _renderElement method
const originalRenderElement = CXMLBuilder.prototype._renderElement;

CXMLBuilder.prototype._renderElement = function(element, indentLevel) {
  // Special case for System elements - Fix the type before rendering
  if (element.type === 'System') {
    // Make a copy of the element to avoid modifying the original
    const tempElement = { ...element };
    const result = originalRenderElement.call(this, tempElement, indentLevel);
    
    // Replace <s> with <System> in the output
    return result.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
  }
  
  // For all other elements, use the original method
  return originalRenderElement.call(this, element, indentLevel);
};

// Test the fix
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    cxml.addSystem('This is a test system message');
  });

// Get the XML output
const xml = builder.build();
console.log('Fixed XML output:');
console.log(xml);