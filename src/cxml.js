/**
 * @file Main exports for the cloudonix-js package
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/cxml
 * @description Exports all components of the cloudonix-js package
 */

'use strict';

const CXMLBuilder = require('./builder');
const CXMLServer = require('./server');

/**
 * @namespace cloudonix-js
 * @property {Class} CXMLBuilder - The CXML document builder
 * @property {Class} CXMLServer - The development HTTP server for serving CXML
 */
module.exports = {
  CXMLBuilder,
  CXMLServer
};