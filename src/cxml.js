/**
 * @file Main exports for the cloudonix-js package
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/cxml
 * @description Exports all components of the cloudonix-js package
 */

'use strict';

const CXMLBuilder = require('./builder');
const CXMLServer = require('./server');

// Patch CXMLBuilder to fix the System tag rendering issue
const originalBuild = CXMLBuilder.prototype.build;
CXMLBuilder.prototype.build = function() {
  // Call the original method
  let xml = originalBuild.call(this);
  
  // Replace <s> with <System>
  xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
  
  return xml;
};

/**
 * @namespace cloudonix-js
 * @property {Class} CXMLBuilder - The CXML document builder
 * @property {Class} CXMLServer - The development HTTP server for serving CXML
 */
module.exports = {
  CXMLBuilder,
  CXMLServer
};