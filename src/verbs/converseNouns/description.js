/**
 * @file Description noun implementation for Converse verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/converseNouns/description
 * @description Implements the Description noun for Converse verb
 */

'use strict';

module.exports = {
  /**
   * Create a Description element
   * @param {string} text - The description text
   * @returns {Object} - The Description element
   */
  create: (text) => {
    return { '#text': text };
  }
};