/**
 * Final System tag fix test
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

// Load the CXMLBuilder module
const { CXMLBuilder } = require('../');

// Monkey patch the build method directly to apply the fix
const originalBuild = CXMLBuilder.prototype.build;
CXMLBuilder.prototype.build = function() {
  // Call the original method
  let xml = originalBuild.call(this);
  console.log('Before replacement:', xml.match(/<s>/) ? 'Found <s> tags' : 'No <s> tags found');
  
  // Replace <s> with <System>
  xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
  console.log('After replacement:', xml.includes('<System>') ? 'Found <System> tags' : 'No <System> tags found');
  
  return xml;
};

// Test with a System element
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    cxml.addSystem("This is a test System message.");
  });

// Get the XML output
const xml = builder.build();
console.log('\nFinal XML output:');
console.log(xml);

// Show which approach worked
console.log('\nFinal solution:');
console.log('1. The most reliable fix is to modify CXMLBuilder.prototype.build to add a simple string replacement');
console.log('2. This replacement converts <s> tags to <System> tags after rendering');
console.log('3. We could update the JSDoc comment in addSystem for better documentation');