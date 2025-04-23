/**
 * @file Solution to System tag rendering issue
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

/**
 * Create a System tag fixed version of CXMLBuilder
 * @returns {CXMLBuilder} - A CXMLBuilder with System tag fix applied
 */
function createFixedBuilder() {
  // Create a new CXMLBuilder
  const builder = new CXMLBuilder();
  
  // Save the original build method
  const originalBuild = builder.build;
  
  // Override the build method with a fixed version
  builder.build = function() {
    // Call the original method
    let xml = originalBuild.call(this);
    
    // Fix System tags - replace <s> with <System>
    xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
    
    return xml;
  };
  
  return builder;
}

// Use the fixed builder to create an example
const builder = createFixedBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US",
    model: "openai:gpt-4o-mini" 
  }, cxml => {
    cxml.addSystem("This is a System message that should be rendered as <System>.");
    cxml.addUser("This is a user message.");
  });

// Get the XML output
const xml = builder.build();
console.log('XML output with System tag fix:');
console.log(xml);

/**
 * Recommended solution:
 * 
 * 1. Source Code Fix: Update the CXML rendering logic in builder.js to properly
 *    handle System tags. The addSystem method in converse.js uses 's' as the element type,
 *    but we want to render it as <System>. This can be fixed in _renderElement or build.
 * 
 * 2. Runtime Workaround: Use the approach shown in this file - extend CXMLBuilder
 *    with a custom build method that performs string replacement.
 * 
 * 3. Documentation: Add a note to the JSDoc for addSystem mentioning that 's' is 
 *    used internally but renders as <System> in the output.
 */