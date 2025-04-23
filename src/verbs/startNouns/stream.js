/**
 * @file Stream noun implementation for Start verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/startNouns/stream
 * @description Implements the Stream noun for streaming audio
 */

'use strict';

module.exports = {
  /**
   * Add a Stream noun to the Start element
   * @param {Object} startElement - The Start element to add the Stream to
   * @param {Object} options - Options for the Stream element
   * @param {string} options.url - WebSocket URL (required)
   * @returns {void}
   */
  add: (startElement, options) => {
    if (!startElement.Stream) {
      startElement.Stream = [];
    }
    
    if (!Array.isArray(startElement.Stream)) {
      startElement.Stream = [startElement.Stream];
    }
    
    const streamElement = this.create(options);
    startElement.Stream.push(streamElement);
  },
  
  /**
   * Create a Stream element
   * @param {Object} options - Options for the Stream element
   * @param {string} options.url - WebSocket URL (required)
   * @param {string} options.name - Unique name for the stream (for stopping it later)
   * @param {string} options.track - Which track to stream ('inbound_track', 'outbound_track', 'both_tracks')
   * @param {string} options.statusCallback - URL for stream status callbacks
   * @param {string} options.statusCallbackMethod - HTTP method for status callbacks (GET/POST)
   * @returns {Object} - The Stream element
   */
  create: (options = {}) => {
    if (!options.url) {
      throw new Error('Stream requires a url parameter');
    }
    
    const streamElement = {};
    
    // Add attributes from options
    streamElement['@_url'] = options.url;
    if (options.name) streamElement['@_name'] = options.name;
    if (options.track) streamElement['@_track'] = options.track;
    if (options.statusCallback) streamElement['@_statusCallback'] = options.statusCallback;
    if (options.statusCallbackMethod) streamElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    
    return streamElement;
  }
};