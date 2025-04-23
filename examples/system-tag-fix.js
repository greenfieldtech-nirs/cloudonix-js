/**
 * @file System tag fix example
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

// Import the CXMLBuilder
const { CXMLBuilder } = require('../');

// Monkey-patch the build method to fix the System elements
const originalBuild = CXMLBuilder.prototype.build;
CXMLBuilder.prototype.build = function() {
  // Call the original method
  let xml = originalBuild.call(this);
  
  // Replace <s> with <System>
  xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
  
  return xml;
};

// Create a test that uses System elements
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US",
    model: "openai:gpt-4o-mini"
  }, cxml => {
    cxml.addSystem("This is a system message that should be rendered as <System> not <s>.");
    cxml.addUser("This is a user message that should not be affected.");
  });

// Output the fixed XML
console.log('Fixed XML output:');
console.log(builder.build());

// Now make this fix permanent
console.log('\nTo make this fix permanent:');
console.log('1. Update src/verbs/converse.js to use type "s" in the addSystem method');
console.log('2. Update src/builder.js to replace <s> with <System> in the build method');