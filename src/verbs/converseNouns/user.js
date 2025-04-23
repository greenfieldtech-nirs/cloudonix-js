/**
 * @file User noun implementation for Converse verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/converseNouns/user
 * @description Implements the User noun for Converse verb
 */

'use strict';

module.exports = {
  /**
   * Create a User element
   * @param {string} text - The user prompt text
   * @returns {Object} - The User element
   */
  create: (text) => {
    return { '#text': text };
  }
};