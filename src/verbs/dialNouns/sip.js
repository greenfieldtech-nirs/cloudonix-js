/**
 * @file Sip noun implementation for Dial verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/dialNouns/sip
 * @description Implements the Sip noun for dialing SIP endpoints
 */

'use strict';

module.exports = {
  /**
   * Add a Sip noun to the Dial element
   * @param {Object} dialElement - The Dial element to add the Sip to
   * @param {string} sipUri - The SIP URI to dial
   * @param {Object} options - Optional parameters for the Sip element
   * @param {string} options.username - SIP authentication username
   * @param {string} options.password - SIP authentication password
   * @param {string} options.domain - From domain ('origin' or 'destination')
   * @returns {void}
   */
  add: (dialElement, sipUri, options = {}) => {
    if (!dialElement.Sip) {
      dialElement.Sip = [];
    }
    
    if (!Array.isArray(dialElement.Sip)) {
      dialElement.Sip = [dialElement.Sip];
    }
    
    const sipElement = { '#text': sipUri };
    
    if (options.username) sipElement['@_username'] = options.username;
    if (options.password) sipElement['@_password'] = options.password;
    if (options.domain) sipElement['@_domain'] = options.domain;
    
    dialElement.Sip.push(sipElement);
  },
  
  /**
   * Create a SIP element
   * @param {string} sipUri - The SIP URI to dial
   * @param {Object} options - Options for the SIP element
   * @param {string} options.username - SIP authentication username
   * @param {string} options.password - SIP authentication password
   * @param {string} options.domain - From domain ('origin' or 'destination')
   * @returns {Object} - The SIP element
   */
  create: (sipUri, options = {}) => {
    const sipElement = { '#text': sipUri };
    
    if (options.username) sipElement['@_username'] = options.username;
    if (options.password) sipElement['@_password'] = options.password;
    if (options.domain) sipElement['@_domain'] = options.domain;
    
    return sipElement;
  }
};