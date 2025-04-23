/**
 * @file System noun implementation for Converse verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/converseNouns/system
 * @description Implements the System noun for Converse verb
 */

'use strict';

module.exports = {
  /**
   * Create a System element
   * @param {string} text - The system prompt text
   * @returns {Object} - The System element
   */
  create: (text) => {
    return { '#text': text };
  }
};