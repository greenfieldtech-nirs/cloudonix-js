/**
 * Apply the final fix for Converse System tags
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

// 1. Fix the converse.js file to use 's' as the type
const conversePath = path.join('/Users/nirs/Documents/repos/cloudonix-js/src/verbs/converse.js');
let converseCode = fs.readFileSync(conversePath, 'utf8');

// Update the addSystem method to use type 's'
converseCode = converseCode.replace(
  /this\.converseElement\.cxml\.push\({\n\s+type: ['"]System['"],/g,
  `this.converseElement.cxml.push({\n      type: 's', // Use 's' as the tag name for System elements,`
);

// Write the changes
fs.writeFileSync(conversePath, converseCode);
console.log('✅ Updated converse.js to use type "s" for System elements');

// 2. Create a monkey-patch file to apply at runtime for the System tag fix
const monkeyPatchPath = path.join('/Users/nirs/Documents/repos/cloudonix-js/src/system-tag-fix.js');
const monkeyPatchCode = `/**
 * @file System tag fix for Converse verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/system-tag-fix
 * @description Applies a fix to render System elements correctly
 */

'use strict';

// Only apply the patch once
let patched = false;

/**
 * Apply the System tag fix to the CXMLBuilder
 * @param {CXMLBuilder} CXMLBuilder - The CXMLBuilder class to patch
 */
function applySystemTagFix(CXMLBuilder) {
  if (patched) return;
  
  // Save the original build method
  const originalBuild = CXMLBuilder.prototype.build;
  
  // Replace it with our fixed version
  CXMLBuilder.prototype.build = function() {
    // Call the original method
    let xml = originalBuild.call(this);
    
    // Replace <s> with <System>
    xml = xml.replace(/<s>/g, '<System>').replace(/<\\/s>/g, '</System>');
    
    return xml;
  };
  
  patched = true;
}

module.exports = { applySystemTagFix };
`;

// Write the monkey patch file
fs.writeFileSync(monkeyPatchPath, monkeyPatchCode);
console.log('✅ Created system-tag-fix.js for runtime patching');

// 3. Update the index.js file to use the patch
const indexPath = path.join('/Users/nirs/Documents/repos/cloudonix-js/index.js');
let indexCode = fs.readFileSync(indexPath, 'utf8');

// Add the system tag fix import and application
if (!indexCode.includes('system-tag-fix')) {
  // Find where builder is required
  const builderLine = indexCode.lastIndexOf("const CXMLBuilder = require('./src/builder');");
  
  // Insert after that line
  if (builderLine !== -1) {
    const beforeBuilder = indexCode.substring(0, builderLine);
    const afterBuilder = indexCode.substring(builderLine);
    
    indexCode = beforeBuilder + afterBuilder.replace(
      "const CXMLBuilder = require('./src/builder');",
      "const CXMLBuilder = require('./src/builder');\nconst { applySystemTagFix } = require('./src/system-tag-fix');\n\n// Apply System tag fix\napplySystemTagFix(CXMLBuilder);"
    );
    
    // Write the changes
    fs.writeFileSync(indexPath, indexCode);
    console.log('✅ Updated index.js to apply the System tag fix');
  } else {
    console.log('❌ Could not find where CXMLBuilder is required in index.js');
  }
} else {
  console.log('⚠️ System tag fix already applied in index.js');
}

// 4. Create a test script to verify the fix
const testPath = path.join('/Users/nirs/Documents/repos/cloudonix-js/examples/test-system-fix.js');
const testCode = `/**
 * @file Test for System tag fix
 * @copyright 2025 Cloudonix, Inc.
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
  console.log('\\n✅ SUCCESS: System tag fix is working!');
} else {
  console.log('\\n❌ ERROR: System tag is still rendered as <s>');
}
`;

// Write the test script
fs.writeFileSync(testPath, testCode);
console.log('✅ Created test-system-fix.js to verify the fix');

console.log('\n🎉 System tag fix has been fully implemented!');
console.log('Run the test script to verify:');
console.log('  node examples/test-system-fix.js');