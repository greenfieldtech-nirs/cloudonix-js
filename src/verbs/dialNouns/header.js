/**
 * @file Header noun implementation for Dial verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/dialNouns/header
 * @description Implements the Header noun for adding custom headers to outbound calls
 */

'use strict';

module.exports = {
  /**
   * Add a Header noun to the Dial element
   * @param {Object} dialElement - The Dial element to add the Header to
   * @param {string} name - The header name
   * @param {string} value - The header value
   * @returns {void}
   */
  add: (dialElement, name, value) => {
    if (!dialElement.Header) {
      dialElement.Header = [];
    }
    
    if (!Array.isArray(dialElement.Header)) {
      dialElement.Header = [dialElement.Header];
    }
    
    const headerElement = {
      '@_name': name,
      '@_value': value
    };
    
    dialElement.Header.push(headerElement);
  }
};