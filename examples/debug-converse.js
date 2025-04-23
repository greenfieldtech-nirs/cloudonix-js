/**
 * @file Debug the Converse verb implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Create a simple Converse example
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US"
  }, cxml => {
    cxml.addSystem("You are a helpful assistant.");
    cxml.addUser("Hello, how are you?");
  });

// Access the internal elements array to inspect the structure
console.log("ELEMENTS STRUCTURE:");
console.log(JSON.stringify(builder.elements, null, 2));

// Build the XML output
console.log("\nXML OUTPUT:");
console.log(builder.build());