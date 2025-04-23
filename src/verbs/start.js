/**
 * @file Start verb implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/start
 * @description Implements the Start verb for initiating stream processing
 */

'use strict';

const StreamNoun = require('./startNouns/stream');

/**
 * StartBuilder class for building the Start verb with its nested elements
 * Note: Start can contain Stream as a nested element
 */
class StartBuilder {
  constructor(cxmlBuilder, startElement) {
    this.cxmlBuilder = cxmlBuilder;
    this.startElement = startElement;
    
    // Initialize cxml property if it doesn't exist
    if (!this.startElement.cxml) {
      this.startElement.cxml = [];
    }
  }
  
  /**
   * Add a Stream element to the Start
   * @param {Object} options - Configuration options for the Stream
   * @param {string} options.url - WebSocket URL (required)
   * @param {string} options.name - Unique name for the stream (for stopping it later)
   * @param {string} options.track - Which track to stream ('inbound_track', 'outbound_track', 'both_tracks')
   * @param {string} options.statusCallback - URL for stream status callbacks
   * @param {string} options.statusCallbackMethod - HTTP method for status callbacks (GET/POST)
   * @returns {StartBuilder} - The builder instance for chaining
   */
  addStream(options = {}) {
    if (!options.url) {
      throw new Error('Stream requires a url parameter');
    }
    
    // Use the Stream noun module to create the element
    const StreamNoun = require('./startNouns/stream');
    const streamElement = StreamNoun.create(options);
    
    this.startElement.cxml.push({
      type: 'Stream',
      element: streamElement
    });
    
    return this;
  }
  
  /**
   * Return to the parent CXML builder
   * @returns {CXMLBuilder} - The parent CXML builder
   */
  done() {
    return this.cxmlBuilder;
  }
}

/**
 * Start verb module
 */
module.exports = {
  /**
   * Create a Start element with optional StartBuilder
   * @param {CXMLBuilder} cxmlBuilder - The parent CXML builder
   * @returns {Object} - Object containing the Start element and StartBuilder
   */
  create: (cxmlBuilder) => {
    const startElement = { cxml: [] };
    
    // Create a StartBuilder for adding nested elements
    const builder = new StartBuilder(cxmlBuilder, startElement);
    
    return { element: startElement, builder };
  },
  
  // Export the StartBuilder class for direct use if needed
  StartBuilder
};