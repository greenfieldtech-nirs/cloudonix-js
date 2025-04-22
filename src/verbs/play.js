/**
 * @file Play verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/play
 * @description Implements the Play verb for audio playback
 */

'use strict';

module.exports = {
  /**
   * Create a Play element
   * @param {string} url - The URL of the audio file to play
   * @param {Object} options - Optional parameters for the Play element
   * @param {boolean} options.answer - Whether to answer the call before playing (true/false)
   * @param {string} options.digits - DTMF tones to play instead of an audio file (e.g., "1ww2ww3")
   * @param {number} options.loop - Number of times to play the audio (0 for continuous)
   * @param {string} options.statusCallback - URL to call when playback is complete
   * @param {string} options.statusCallbackMethod - HTTP method for statusCallback (GET/POST)
   * @returns {Object} - The Play element
   */
  create: (url, options = {}) => {
    // If digits option is provided, url is ignored
    const playElement = options.digits ? {} : { '#text': url };
    
    // Add all supported attributes
    if (options.answer !== undefined) {
      playElement['@_answer'] = options.answer;
    }
    
    if (options.digits) {
      playElement['@_digits'] = options.digits;
    }
    
    if (options.loop !== undefined) {
      playElement['@_loop'] = options.loop;
    }
    
    if (options.statusCallback) {
      playElement['@_statusCallback'] = options.statusCallback;
    }
    
    if (options.statusCallbackMethod) {
      playElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    }
    
    return playElement;
  }
};