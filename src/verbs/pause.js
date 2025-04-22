/**
 * @file Pause verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/pause
 * @description Implements the Pause verb for pausing execution
 */

'use strict';

module.exports = {
  /**
   * Create a Pause element
   * @param {number} length - The length of the pause in seconds
   * @param {Object} options - Optional parameters for the Pause element
   * @param {boolean} options.answer - Whether to answer the call before pausing
   * @returns {Object} - The Pause element
   */
  create: (length = 1, options = {}) => {
    const pauseElement = {};
    
    // Add length attribute
    pauseElement['@_length'] = length;
    
    // Add answer attribute if provided
    if (options.answer !== undefined) {
      pauseElement['@_answer'] = options.answer;
    }
    
    return pauseElement;
  }
};