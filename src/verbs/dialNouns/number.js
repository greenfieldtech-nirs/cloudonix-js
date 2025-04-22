/**
 * @file Number noun implementation for Dial verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/dialNouns/number
 * @description Implements the Number noun for dialing phone numbers
 */

'use strict';

module.exports = {
  /**
   * Add a Number noun to the Dial element
   * @param {Object} dialElement - The Dial element to add the Number to
   * @param {string} number - The phone number to dial
   * @returns {void}
   */
  add: (dialElement, number) => {
    if (!dialElement.Number) {
      dialElement.Number = [];
    }
    
    if (!Array.isArray(dialElement.Number)) {
      dialElement.Number = [dialElement.Number];
    }
    
    dialElement.Number.push(number);
  }
};