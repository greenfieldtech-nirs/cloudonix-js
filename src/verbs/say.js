/**
 * @file Say verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/say
 * @description Implements the Say verb for text-to-speech
 */

'use strict';

module.exports = {
  /**
   * Create a Say element
   * @param {string} text - The text to be spoken (can include SSML)
   * @param {Object} options - Optional parameters for the Say element
   * @param {boolean} options.answer - Whether to answer the call before speaking (true/false)
   * @param {number} options.loop - Number of times to repeat the text
   * @param {string} options.voice - Voice to use ('man', 'woman', or premium voice like 'Google:en-US-Journey-F')
   * @param {string} options.language - Language for speech (e.g., 'en-US')
   * @param {string} options.statusCallback - URL to call when speech is complete
   * @param {string} options.statusCallbackMethod - HTTP method for statusCallback (GET/POST)
   * @returns {Object} - The Say element
   */
  create: (text, options = {}) => {
    const sayElement = { '#text': text };
    
    // Add all supported attributes
    if (options.answer !== undefined) {
      sayElement['@_answer'] = options.answer;
    }
    
    if (options.loop !== undefined) {
      sayElement['@_loop'] = options.loop;
    }
    
    if (options.voice) {
      sayElement['@_voice'] = options.voice;
    }
    
    if (options.language) {
      sayElement['@_language'] = options.language;
    }
    
    if (options.statusCallback) {
      sayElement['@_statusCallback'] = options.statusCallback;
    }
    
    if (options.statusCallbackMethod) {
      sayElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    }
    
    return sayElement;
  }
};