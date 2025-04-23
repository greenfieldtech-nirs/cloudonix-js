/**
 * @file Tool noun implementation for Converse verb
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/converseNouns/tool
 * @description Implements the Tool noun for Converse verb
 */

'use strict';

module.exports = {
  /**
   * Create a Tool element
   * @param {string} name - The name of the tool (required)
   * @param {string} url - The URL of the tool (required)
   * @param {Object} options - Additional options for the tool
   * @returns {Object} - The Tool element
   */
  create: (name, url, options = {}) => {
    if (!name) {
      throw new Error('Tool requires a name parameter');
    }
    
    if (!url) {
      throw new Error('Tool requires a url parameter');
    }
    
    const toolElement = {};
    
    // Add required attributes
    toolElement['@_name'] = name;
    toolElement['@_url'] = url;
    
    return toolElement;
  },
  
  /**
   * Create a Parameter element for a Tool
   * @param {string} name - The name of the parameter (required)
   * @param {Object} options - Configuration for the Parameter
   * @param {string} options.description - Description of the parameter
   * @param {string} options.type - Type of the parameter ('string', 'integer', 'number', 'boolean', 'enum')
   * @param {boolean} options.required - Whether the parameter is required
   * @param {string} options.values - Comma-separated list of values for enum type
   * @returns {Object} - The Parameter element
   */
  createParameter: (name, options = {}) => {
    if (!name) {
      throw new Error('Parameter requires a name attribute');
    }
    
    const paramElement = { '@_name': name };
    
    // Add optional attributes
    if (options.description) paramElement['@_description'] = options.description;
    if (options.type) paramElement['@_type'] = options.type;
    if (options.required !== undefined) paramElement['@_required'] = options.required;
    if (options.values) paramElement['@_values'] = options.values;
    
    return paramElement;
  }
};