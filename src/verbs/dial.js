/**
 * @file Dial verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/dial
 * @description Implements the Dial verb for making outbound calls
 */

'use strict';

const NumberNoun = require('./dialNouns/number');
const SipNoun = require('./dialNouns/sip');
const ConferenceNoun = require('./dialNouns/conference');
const ServiceNoun = require('./dialNouns/service');
const HeaderNoun = require('./dialNouns/header');

/**
 * DialBuilder class for building the Dial verb with its nouns
 */
class DialBuilder {
  constructor(cxmlBuilder, dialElement) {
    this.cxmlBuilder = cxmlBuilder;
    this.dialElement = dialElement;
  }
  
  /**
   * Add a Number noun to the Dial element
   * @param {string} number - The phone number to dial
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addNumber(number) {
    NumberNoun.add(this.dialElement, number);
    return this;
  }
  
  /**
   * Add a Sip noun to the Dial element
   * @param {string} sipUri - The SIP URI to dial
   * @param {Object} options - Optional parameters for the Sip element
   * @param {string} options.username - SIP authentication username
   * @param {string} options.password - SIP authentication password
   * @param {string} options.domain - From domain ('origin' or 'destination')
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addSip(sipUri, options = {}) {
    SipNoun.add(this.dialElement, sipUri, options);
    return this;
  }
  
  /**
   * Add a Conference noun to the Dial element
   * @param {string} conferenceName - The name of the conference
   * @param {Object} options - Optional parameters for the Conference element
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addConference(conferenceName, options = {}) {
    ConferenceNoun.add(this.dialElement, conferenceName, options);
    return this;
  }
  
  /**
   * Add a Service noun to the Dial element
   * @param {string} serviceNumber - Service provider's number
   * @param {Object} options - Parameters for the Service element
   * @param {string} options.provider - Service provider name (required)
   * @param {string} options.username - Authentication username
   * @param {string} options.password - Authentication password
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addService(serviceNumber, options = {}) {
    ServiceNoun.add(this.dialElement, serviceNumber, options);
    return this;
  }
  
  /**
   * Add a Header noun to the Dial element
   * @param {string} name - The header name
   * @param {string} value - The header value
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addHeader(name, value) {
    HeaderNoun.add(this.dialElement, name, value);
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
 * Dial verb module
 */
module.exports = {
  /**
   * Create a Dial element with optional DialBuilder
   * @param {CXMLBuilder} cxmlBuilder - The parent CXML builder
   * @param {string|Object} numberOrOptions - Phone number to dial or options object
   * @param {Object} options - Optional parameters for the Dial element
   * @returns {Object} - Object containing the Dial element and DialBuilder
   */
  create: (cxmlBuilder, numberOrOptions = {}, options = {}) => {
    let dialElement = {};
    
    // Handle the case where first argument is a string (phone number)
    if (typeof numberOrOptions === 'string') {
      dialElement['#text'] = numberOrOptions;
      options = options || {};
    } else {
      // First argument is options object
      options = numberOrOptions || {};
    }
    
    // Add attributes from options
    if (options.action) dialElement['@_action'] = options.action;
    if (options.callerId) dialElement['@_callerId'] = options.callerId;
    if (options.callerName) dialElement['@_callerName'] = options.callerName;
    if (options.forwardHeaders !== undefined) dialElement['@_forwardHeaders'] = options.forwardHeaders;
    if (options.headers) dialElement['@_headers'] = options.headers;
    if (options.hangupOnStar !== undefined) dialElement['@_hangupOnStar'] = options.hangupOnStar;
    if (options.hangupOn) dialElement['@_hangupOn'] = options.hangupOn;
    if (options.method) dialElement['@_method'] = options.method;
    if (options.record) dialElement['@_record'] = options.record;
    if (options.recordingStatusCallback) dialElement['@_recordingStatusCallback'] = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) dialElement['@_recordingStatusCallbackMethod'] = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) dialElement['@_recordingStatusCallbackEvent'] = options.recordingStatusCallbackEvent;
    if (options.timeLimit) dialElement['@_timeLimit'] = options.timeLimit;
    if (options.timeout) dialElement['@_timeout'] = options.timeout;
    if (options.trim) dialElement['@_trim'] = options.trim;
    if (options.trunks) dialElement['@_trunks'] = options.trunks;
    
    // Create a DialBuilder for adding nested elements
    const builder = new DialBuilder(cxmlBuilder, dialElement);
    
    return { element: dialElement, builder };
  },
  
  // Export the DialBuilder class for direct use if needed
  DialBuilder
};