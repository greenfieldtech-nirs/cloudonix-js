/**
 * @file Test for System tag fix
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Create a test with a System element
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US",
    model: "openai:gpt-4o-mini"
  }, cxml => {
    cxml.addSystem("This is a test system message that should be rendered as <System> not <s>.");
  });

// Get the XML output
const xml = builder.build();
console.log('XML output:');
console.log(xml);

// Verify the fix worked
if (xml.includes('<System>')) {
  console.log('\n✅ SUCCESS: System tag fix is working!');
} else {
  console.log('\n❌ ERROR: System tag is still rendered as <s>');
}
