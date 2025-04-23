/**
 * @file Service noun implementation for Dial verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/dialNouns/service
 * @description Implements the Service noun for connecting to service endpoints
 */

'use strict';

module.exports = {
  /**
   * Add a Service noun to the Dial element
   * @param {Object} dialElement - The Dial element to add the Service to
   * @param {string} serviceNumber - Service provider's number
   * @param {Object} options - Parameters for the Service element
   * @param {string} options.provider - Service provider name (required)
   * @param {string} options.username - Authentication username
   * @param {string} options.password - Authentication password
   * @returns {void}
   */
  add: (dialElement, serviceNumber, options = {}) => {
    if (!dialElement.Service) {
      dialElement.Service = [];
    }
    
    if (!Array.isArray(dialElement.Service)) {
      dialElement.Service = [dialElement.Service];
    }
    
    const serviceElement = { '#text': serviceNumber };
    
    if (options.provider) serviceElement['@_provider'] = options.provider;
    if (options.username) serviceElement['@_username'] = options.username;
    if (options.password) serviceElement['@_password'] = options.password;
    
    dialElement.Service.push(serviceElement);
  }
};