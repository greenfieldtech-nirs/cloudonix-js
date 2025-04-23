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
    
    // Initialize cxml property if it doesn't exist
    if (!this.dialElement.cxml) {
      this.dialElement.cxml = [];
    }
  }
  
  /**
   * Add a Number noun to the Dial element
   * Note: This clears any existing SIP, Conference, or Service nouns as they are mutually exclusive
   * @param {string} number - The phone number to dial
   * @param {Object} options - Options for the Number element
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addNumber(number, options = {}) {
    // Extract Headers (we need to keep them at the beginning)
    const headers = this.dialElement.cxml.filter(item => 
      item.type === 'Header'
    );
    
    // Remove any existing SIP, Conference, or Service nouns (they're mutually exclusive)
    this.dialElement.cxml = [];
    
    // Add back headers first
    this.dialElement.cxml.push(...headers);
    
    // Use the Number noun module to create the element
    const NumberNoun = require('./dialNouns/number');
    const numberElement = NumberNoun.create(number, options);
    
    // Add the number element after headers
    this.dialElement.cxml.push({
      type: 'Number',
      element: numberElement
    });
    
    return this;
  }
  
  /**
   * Add a Sip noun to the Dial element
   * Note: This clears any existing Number, Conference, or Service nouns as they are mutually exclusive
   * @param {string} sipUri - The SIP URI to dial
   * @param {Object} options - Optional parameters for the Sip element
   * @param {string} options.username - SIP authentication username
   * @param {string} options.password - SIP authentication password
   * @param {string} options.domain - From domain ('origin' or 'destination')
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addSip(sipUri, options = {}) {
    // Extract Headers (we need to keep them at the beginning)
    const headers = this.dialElement.cxml.filter(item => 
      item.type === 'Header'
    );
    
    // Remove any existing Number, Conference, or Service nouns (they're mutually exclusive)
    this.dialElement.cxml = [];
    
    // Add back headers first
    this.dialElement.cxml.push(...headers);
    
    // Use the Sip noun module to create the element
    const SipNoun = require('./dialNouns/sip');
    const sipElement = SipNoun.create(sipUri, options);
    
    this.dialElement.cxml.push({
      type: 'Sip',
      element: sipElement
    });
    
    return this;
  }
  
  /**
   * Add a Conference noun to the Dial element
   * Note: This clears any existing Number, SIP, or Service nouns as they are mutually exclusive
   * @param {string} conferenceName - The name of the conference
   * @param {Object} options - Optional parameters for the Conference element
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addConference(conferenceName, options = {}) {
    // Extract Headers (we need to keep them at the beginning)
    const headers = this.dialElement.cxml.filter(item => 
      item.type === 'Header'
    );
    
    // Remove any existing Number, SIP, or Service nouns (they're mutually exclusive)
    this.dialElement.cxml = [];
    
    // Add back headers first
    this.dialElement.cxml.push(...headers);
    
    const conferenceElement = { '#text': conferenceName };
    
    if (options.beep !== undefined) conferenceElement['@_beep'] = options.beep;
    if (options.startConferenceOnEnter !== undefined) conferenceElement['@_startConferenceOnEnter'] = options.startConferenceOnEnter;
    if (options.endConferenceOnExit !== undefined) conferenceElement['@_endConferenceOnExit'] = options.endConferenceOnExit;
    if (options.maxParticipants) conferenceElement['@_maxParticipants'] = options.maxParticipants;
    if (options.record !== undefined) conferenceElement['@_record'] = options.record;
    if (options.trim) conferenceElement['@_trim'] = options.trim;
    if (options.waitMethod) conferenceElement['@_waitMethod'] = options.waitMethod;
    if (options.waitUrl) conferenceElement['@_waitUrl'] = options.waitUrl;
    if (options.dtmf !== undefined) conferenceElement['@_dtmf'] = options.dtmf;
    if (options.holdMusic) conferenceElement['@_holdMusic'] = options.holdMusic;
    if (options.muted !== undefined) conferenceElement['@_muted'] = options.muted;
    if (options.prompts !== undefined) conferenceElement['@_prompts'] = options.prompts;
    if (options.statusCallback) conferenceElement['@_statusCallback'] = options.statusCallback;
    if (options.statusCallbackMethod) conferenceElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    if (options.statusCallbackEvent) conferenceElement['@_statusCallbackEvent'] = options.statusCallbackEvent;
    if (options.recordingStatusCallback) conferenceElement['@_recordingStatusCallback'] = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) conferenceElement['@_recordingStatusCallbackMethod'] = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) conferenceElement['@_recordingStatusCallbackEvent'] = options.recordingStatusCallbackEvent;
    if (options.talkDetection !== undefined) conferenceElement['@_talkDetection'] = options.talkDetection;
    
    this.dialElement.cxml.push({
      type: 'Conference',
      element: conferenceElement
    });
    
    return this;
  }
  
  /**
   * Add a Service noun to the Dial element
   * Note: This clears any existing Number, SIP, or Conference nouns as they are mutually exclusive
   * @param {string} serviceNumber - Service provider's number
   * @param {Object} options - Parameters for the Service element
   * @param {string} options.provider - Service provider name (required)
   * @param {string} options.username - Authentication username
   * @param {string} options.password - Authentication password
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addService(serviceNumber, options = {}) {
    // Extract Headers (we need to keep them at the beginning)
    const headers = this.dialElement.cxml.filter(item => 
      item.type === 'Header'
    );
    
    // Remove any existing Number, SIP, or Conference nouns (they're mutually exclusive)
    this.dialElement.cxml = [];
    
    // Add back headers first
    this.dialElement.cxml.push(...headers);
    
    const serviceElement = { '#text': serviceNumber };
    
    if (options.provider) serviceElement['@_provider'] = options.provider;
    if (options.username) serviceElement['@_username'] = options.username;
    if (options.password) serviceElement['@_password'] = options.password;
    
    this.dialElement.cxml.push({
      type: 'Service',
      element: serviceElement
    });
    
    return this;
  }
  
  /**
   * Add a Header noun to the Dial element
   * Note: Headers should always appear before other nouns
   * @param {string} name - The header name
   * @param {string} value - The header value
   * @returns {DialBuilder} - The builder instance for chaining
   */
  addHeader(name, value) {
    // Get existing headers
    const headers = this.dialElement.cxml.filter(item => 
      item.type === 'Header'
    );
    
    // Get other existing nouns
    const otherNouns = this.dialElement.cxml.filter(item => 
      item.type !== 'Header'
    );
    
    // Use the Header noun module to create the element
    const HeaderNoun = require('./dialNouns/header');
    const headerElement = HeaderNoun.create(name, value);
    
    // Insert the new header after existing headers but before other nouns
    this.dialElement.cxml = [
      ...headers,
      {
        type: 'Header',
        element: headerElement
      },
      ...otherNouns
    ];
    
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
    let dialElement = { cxml: [] };
    
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