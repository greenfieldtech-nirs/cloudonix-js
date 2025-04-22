/**
 * @file Gather verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/gather
 * @description Implements the Gather verb for collecting user input
 */

'use strict';

/**
 * GatherBuilder class for building the Gather verb with its nested elements
 */
class GatherBuilder {
  constructor(cxmlBuilder, gatherElement) {
    this.cxmlBuilder = cxmlBuilder;
    this.gatherElement = gatherElement;
  }
  
  /**
   * Add a Say element to the Gather
   * @param {string} text - The text to be spoken
   * @param {Object} options - Optional parameters for the Say element
   * @param {string} options.voice - The voice to use for TTS
   * @param {string} options.language - The language of the text
   * @returns {GatherBuilder} - The builder instance for chaining
   */
  addSay(text, options = {}) {
    if (!this.gatherElement.Say) {
      this.gatherElement.Say = [];
    }
    
    if (!Array.isArray(this.gatherElement.Say)) {
      this.gatherElement.Say = [this.gatherElement.Say];
    }
    
    const sayElement = { '#text': text };
    
    if (options.voice) {
      sayElement['@_voice'] = options.voice;
    }
    
    if (options.language) {
      sayElement['@_language'] = options.language;
    }
    
    this.gatherElement.Say.push(sayElement);
    return this;
  }
  
  /**
   * Add a Play element to the Gather
   * @param {string} url - The URL of the audio file to play
   * @returns {GatherBuilder} - The builder instance for chaining
   */
  addPlay(url) {
    if (!this.gatherElement.Play) {
      this.gatherElement.Play = [];
    }
    
    if (!Array.isArray(this.gatherElement.Play)) {
      this.gatherElement.Play = [this.gatherElement.Play];
    }
    
    this.gatherElement.Play.push(url);
    return this;
  }
  
  /**
   * Add a Pause element to the Gather
   * @param {number} length - The length of the pause in seconds
   * @returns {GatherBuilder} - The builder instance for chaining
   */
  addPause(length) {
    if (!this.gatherElement.Pause) {
      this.gatherElement.Pause = [];
    }
    
    if (!Array.isArray(this.gatherElement.Pause)) {
      this.gatherElement.Pause = [this.gatherElement.Pause];
    }
    
    const pauseElement = {};
    if (length) {
      pauseElement['@_length'] = length;
    }
    
    this.gatherElement.Pause.push(pauseElement);
    return this;
  }
  
  /**
   * Add a Converse element to the Gather
   * @param {string} text - The text for the conversation
   * @param {Object} options - Optional parameters for the Converse element
   * @returns {GatherBuilder} - The builder instance for chaining
   */
  addConverse(text, options = {}) {
    if (!this.gatherElement.Converse) {
      this.gatherElement.Converse = [];
    }
    
    if (!Array.isArray(this.gatherElement.Converse)) {
      this.gatherElement.Converse = [this.gatherElement.Converse];
    }
    
    const converseElement = { '#text': text };
    
    // Add converse attributes here as they become available in the documentation
    
    this.gatherElement.Converse.push(converseElement);
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
 * Gather verb module
 */
module.exports = {
  /**
   * Create a Gather element with optional GatherBuilder
   * @param {CXMLBuilder} cxmlBuilder - The parent CXML builder
   * @param {Object} options - Configuration for the Gather element
   * @param {string} options.action - URL to send gathered input to
   * @param {string} options.method - HTTP method to use (GET/POST)
   * @param {string} options.input - Input type ('dtmf', 'speech', 'dtmf speech')
   * @param {string} options.finishOnKey - Key that ends the gathering
   * @param {number} options.numDigits - Number of digits to gather
   * @param {number} options.maxTimeout - Maximum time to wait for first input
   * @param {number} options.timeout - Timeout between DTMF inputs
   * @param {number|string} options.speechTimeout - Timeout for speech input
   * @param {string} options.speechEngine - Speech recognition engine to use ('aws'/'google')
   * @param {string} options.language - Language for speech recognition
   * @param {boolean} options.actionOnEmptyResult - Send request even with no input
   * @param {number} options.maxDuration - Maximum total duration for gathering
   * @param {string} options.speechDetection - Speech detection sensitivity
   * @param {boolean} options.interruptible - Whether input can interrupt nested playback
   * @returns {Object} - Object containing the Gather element and GatherBuilder
   */
  create: (cxmlBuilder, options = {}) => {
    const gatherElement = {};
    
    // Add all supported attributes from options
    if (options.action) gatherElement['@_action'] = options.action;
    if (options.method) gatherElement['@_method'] = options.method;
    if (options.input) gatherElement['@_input'] = options.input;
    if (options.finishOnKey !== undefined) gatherElement['@_finishOnKey'] = options.finishOnKey;
    if (options.numDigits) gatherElement['@_numDigits'] = options.numDigits;
    if (options.maxTimeout) gatherElement['@_maxTimeout'] = options.maxTimeout;
    if (options.timeout) gatherElement['@_timeout'] = options.timeout;
    if (options.speechTimeout) gatherElement['@_speechTimeout'] = options.speechTimeout;
    if (options.speechEngine) gatherElement['@_speechEngine'] = options.speechEngine;
    if (options.language) gatherElement['@_language'] = options.language;
    if (options.actionOnEmptyResult !== undefined) gatherElement['@_actionOnEmptyResult'] = options.actionOnEmptyResult;
    if (options.maxDuration) gatherElement['@_maxDuration'] = options.maxDuration;
    if (options.speechDetection) gatherElement['@_speechDetection'] = options.speechDetection;
    if (options.interruptible !== undefined) gatherElement['@_interruptible'] = options.interruptible;
    
    // Create a GatherBuilder for adding nested elements
    const builder = new GatherBuilder(cxmlBuilder, gatherElement);
    
    return { element: gatherElement, builder };
  },
  
  // Export the GatherBuilder class for direct use if needed
  GatherBuilder
};