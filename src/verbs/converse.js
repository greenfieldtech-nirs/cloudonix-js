/**
 * @file Converse verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/converse
 * @description Implements the Converse verb for AI voice agent interactions
 */

'use strict';

const ToolNoun = require('./converseNouns/tool');
const DescriptionNoun = require('./converseNouns/description');
const SystemNoun = require('./converseNouns/system');
const UserNoun = require('./converseNouns/user');
const SpeechNoun = require('./converseNouns/speech');

/**
 * ConverseBuilder class for building the Converse verb with its nested elements
 */
class ConverseBuilder {
  constructor(cxmlBuilder, converseElement) {
    this.cxmlBuilder = cxmlBuilder;
    this.converseElement = converseElement;
    
    // Initialize cxml property if it doesn't exist
    if (!this.converseElement.cxml) {
      this.converseElement.cxml = [];
    }
  }
  
  /**
   * Add a Tool noun to the Converse element
   * @param {string} name - The name of the tool
   * @param {string} url - The URL of the tool
   * @param {Object} options - Additional options for the tool
   * @returns {Object} - The tool builder for adding parameters and descriptions
   */
  addTool(name, url, options = {}) {
    // Use the Tool noun module to create the element
    const toolElement = ToolNoun.create(name, url, options);
    
    // Initialize Parameter and Description arrays
    toolElement.Parameter = [];
    
    // Add the tool element to cxml
    const toolIndex = this.converseElement.cxml.push({
      type: 'Tool',
      element: toolElement
    }) - 1;
    
    // Return a builder for adding parameters and descriptions to this tool
    return {
      addParameter: (paramName, paramOptions = {}) => {
        const paramElement = ToolNoun.createParameter(paramName, paramOptions);
        
        // Add the Parameter to the Tool element
        this.converseElement.cxml[toolIndex].element.Parameter.push(paramElement);
        return this;
      },
      
      addDescription: (description) => {
        const descElement = DescriptionNoun.create(description);
        
        // Add the Description to the Tool element
        this.converseElement.cxml[toolIndex].element.Description = descElement;
        return this;
      },
      
      // Return to the main builder
      done: () => this
    };
  }
  
  /**
   * Add a System noun to the Converse element
   * @param {string} text - The system prompt text
   * @returns {ConverseBuilder} - The builder instance for chaining
   */
  addSystem(text) {
    const systemElement = SystemNoun.create(text);
    
    this.converseElement.cxml.push({
      type: 's', // Use 's' as the tag name for System elements
      element: systemElement
    });
    
    return this;
  }
  
  /**
   * Add a User noun to the Converse element
   * @param {string} text - The user prompt text
   * @returns {ConverseBuilder} - The builder instance for chaining
   */
  addUser(text) {
    const userElement = UserNoun.create(text);
    
    this.converseElement.cxml.push({
      type: 'User',
      element: userElement
    });
    
    return this;
  }
  
  /**
   * Add a Speech noun to the Converse element
   * @returns {ConverseBuilder} - The builder instance for chaining
   */
  addSpeech() {
    const speechElement = SpeechNoun.create();
    
    this.converseElement.cxml.push({
      type: 'Speech',
      element: speechElement
    });
    
    return this;
  }
  
  /**
   * Return to the parent CXML builder
   * @returns {CXMLBuilder} - The parent CXML builder
   */
  done() {
    return this.cxmlBuilder;
  }
}

/**
 * Converse verb module
 */
module.exports = {
  /**
   * Create a Converse element with optional ConverseBuilder
   * @param {CXMLBuilder} cxmlBuilder - The parent CXML builder
   * @param {Object} options - Configuration for the Converse element
   * @returns {Object} - Object containing the Converse element and ConverseBuilder
   */
  create: (cxmlBuilder, options = {}) => {
    const converseElement = { cxml: [] };
    
    // Add attributes from options
    if (options.voice) converseElement['@_voice'] = options.voice;
    if (options.language) converseElement['@_language'] = options.language;
    if (options.statusCallback) converseElement['@_statusCallback'] = options.statusCallback;
    if (options.statusCallbackMethod) converseElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    if (options.statusCallbackEvent) converseElement['@_statusCallbackEvent'] = options.statusCallbackEvent;
    if (options.sessionTools) converseElement['@_sessionTools'] = options.sessionTools;
    if (options.model) converseElement['@_model'] = options.model;
    if (options.context) converseElement['@_context'] = options.context;
    if (options.temperature) converseElement['@_temperature'] = options.temperature;
    
    // Create a ConverseBuilder for adding nested elements
    const builder = new ConverseBuilder(cxmlBuilder, converseElement);
    
    return { element: converseElement, builder };
  },
  
  // Export the ConverseBuilder class for direct use if needed
  ConverseBuilder
};