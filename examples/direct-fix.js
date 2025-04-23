/**
 * Direct replace approach for System tags
 */
const fs = require('fs');

// Read a converse-example file first to understand the current state
const exampleFile = '/Users/nirs/Documents/repos/cloudonix-js/examples/converse-example.js';
const sampleCode = fs.readFileSync(exampleFile, 'utf8');
console.log('Found example code:', sampleCode.includes('addSystem') ? 'Yes' : 'No');

// Generate a test file to verify string replacement works
const testFile = '/tmp/test.xml';
fs.writeFileSync(testFile, `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Converse>
    <s>Test message</s>
  </Converse>
</Response>`);

// Read and verify replace works
let testXml = fs.readFileSync(testFile, 'utf8');
console.log('Before replacement (s tags):', testXml.includes('<s>') ? 'Yes' : 'No');

// Replace the strings
testXml = testXml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
console.log('After replacement (System tags):', testXml.includes('<System>') ? 'Yes' : 'No');

// Write the test file back
fs.writeFileSync(testFile, testXml);

// Read and verify again
let verifyXml = fs.readFileSync(testFile, 'utf8');
console.log('Verify replacement (System tags):', verifyXml.includes('<System>') ? 'Yes' : 'No');

// Now fix the builder.js file
const builderFile = '/Users/nirs/Documents/repos/cloudonix-js/src/builder.js';
let builderCode = fs.readFileSync(builderFile, 'utf8');

// Find the build method
const buildMethodRegex = /build\(\)\s*{[\s\S]+?return xml;\s*}/;
const buildMethod = builderCode.match(buildMethodRegex)[0];

// Check if it already has the replace line
if (buildMethod.includes("xml = xml.replace(/<s>/g, '<System>')")) {
  console.log('Builder already has the System replacement');
} else {
  // Add the replacement before the return
  const newBuildMethod = buildMethod.replace(
    /return xml;/,
    "// Replace <s> with <System> tags\n    xml = xml.replace(/<s>/g, '<System>').replace(/<\\/s>/g, '</System>');\n    \n    return xml;"
  );
  
  // Update the builder.js file
  builderCode = builderCode.replace(buildMethodRegex, newBuildMethod);
  fs.writeFileSync(builderFile, builderCode);
  console.log('Updated builder.js with System tag fix');
}

// Run the actual test to confirm
console.log('\nFixing complete, run a test with:');
console.log('node examples/converse-example.js');
