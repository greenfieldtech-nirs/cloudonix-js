/**
 * @file System tag hybrid fix for Converse verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 1. Revert converse.js to use type 's'
const conversePath = path.join('/Users/nirs/Documents/repos/cloudonix-js/src/verbs/converse.js');
let converseCode = fs.readFileSync(conversePath, 'utf8');

// Update the addSystem method to use type 's'
converseCode = converseCode.replace(
  /type: ['"]System['"], \/\/ Use ['"]System['"] as the element tag name/g,
  `type: 's', // Use 's' as the tag name for System elements`
);

// Write the changes
fs.writeFileSync(conversePath, converseCode);
console.log('Updated converse.js to use type "s" for System elements');

// 2. Create a direct string replacement in CXMLBuilder.build
const builderPath = path.join('/Users/nirs/Documents/repos/cloudonix-js/src/builder.js');
let builderCode = fs.readFileSync(builderPath, 'utf8');

// Find the build method
const buildMethodStart = builderCode.indexOf('build() {');
const buildMethodEnd = builderCode.indexOf('return xml;', buildMethodStart) + 'return xml;'.length;

// Get the build method content
let buildMethod = builderCode.substring(buildMethodStart, buildMethodEnd);

// Add the string replacement just before the return
if (!buildMethod.includes('<s>/g, "<System>"')) {
  const returnPos = buildMethod.lastIndexOf('return xml;');
  const newBuildMethod = buildMethod.substring(0, returnPos) + 
    '\n    // Replace <s> with <System> tags for proper rendering\n' +
    '    xml = xml.replace(/<s>/g, "<System>").replace(/<\\/s>/g, "</System>");\n\n    ' +
    buildMethod.substring(returnPos);
  
  // Replace the build method in the file
  builderCode = builderCode.substring(0, buildMethodStart) + newBuildMethod + builderCode.substring(buildMethodEnd);
  
  // Write the changes
  fs.writeFileSync(builderPath, builderCode);
  console.log('Updated builder.js to replace <s> with <System> tags in the output');
} else {
  console.log('builder.js already has the tag replacement code');
}

console.log('\nSystem tag fix has been implemented using a hybrid approach!');
console.log('Run the test script to verify:');
console.log('  node examples/converse-example.js');