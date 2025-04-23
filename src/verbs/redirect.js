/**
 * @file Redirect verb implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/redirect
 * @description Implements the Redirect verb for redirecting to another URL
 */

'use strict';

module.exports = {
  /**
   * Create a Redirect element
   * @param {string} url - The URL to redirect to
   * @param {string} method - HTTP method to use (GET/POST)
   * @returns {Object} - The Redirect element
   */
  create: (url, method = 'POST') => {
    return {
      '@_method': method,
      '#text': url
    };
  }
};