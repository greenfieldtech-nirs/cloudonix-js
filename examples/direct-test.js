/**
 * Direct test for System tag fix
 */
const cxml = require('../src/cxml');
const CXMLBuilder = cxml.CXMLBuilder;

// Override the build method directly
const originalBuild = CXMLBuilder.prototype.build;
CXMLBuilder.prototype.build = function() {
  let xml = originalBuild.call(this);
  console.log('Before replacement:', xml.includes('<s>') ? 'Found <s> tag' : 'No <s> tag found');
  xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
  console.log('After replacement:', xml.includes('<System>') ? 'Found <System> tag' : 'No <System> tag found');
  return xml;
};

// Create a test with a System element
const builder = new CXMLBuilder()
  .createResponse()
  .addConverse({}, cxml => {
    cxml.addSystem("Test message");
  });

// Get the XML output
const xml = builder.build();
console.log('Final XML:');
console.log(xml);
