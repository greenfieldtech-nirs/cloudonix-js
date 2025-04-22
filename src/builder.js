/**
 * @file CXML Builder implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/builder
 * @description Provides a fluent API for building CXML documents
 */

'use strict';

const PlayVerb = require('./verbs/play');
const SayVerb = require('./verbs/say');
const GatherVerb = require('./verbs/gather');
const RedirectVerb = require('./verbs/redirect');
const HangupVerb = require('./verbs/hangup');
const DialVerb = require('./verbs/dial');
const PauseVerb = require('./verbs/pause');
const RejectVerb = require('./verbs/reject');
const RecordVerb = require('./verbs/record');
const CoachVerb = require('./verbs/coach');

class CXMLBuilder {
  constructor() {
    this.elements = [];
    this.nestedElements = new Map(); // Map to store nested elements for Gather, Dial, etc.
  }

  /**
   * Create a Response element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  createResponse() {
    this.elements = [];
    this.nestedElements = new Map();
    return this;
  }

  /**
   * Add a Play element to the Response
   * @param {string} url - The URL of the audio file to play
   * @param {Object} options - Optional parameters for the Play element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addPlay(url, options = {}) {
    const attributes = {};
    
    if (options.answer !== undefined) attributes.answer = options.answer;
    if (options.digits) attributes.digits = options.digits;
    if (options.loop !== undefined) attributes.loop = options.loop;
    if (options.statusCallback) attributes.statusCallback = options.statusCallback;
    if (options.statusCallbackMethod) attributes.statusCallbackMethod = options.statusCallbackMethod;
    
    this.elements.push({
      type: 'Play',
      attributes,
      content: options.digits ? undefined : url
    });
    
    return this;
  }

  /**
   * Add a Say element to the Response
   * @param {string} text - The text to be spoken
   * @param {Object} options - Optional parameters for the Say element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addSay(text, options = {}) {
    const attributes = {};
    
    if (options.answer !== undefined) attributes.answer = options.answer;
    if (options.loop !== undefined) attributes.loop = options.loop;
    if (options.voice) attributes.voice = options.voice;
    if (options.language) attributes.language = options.language;
    if (options.statusCallback) attributes.statusCallback = options.statusCallback;
    if (options.statusCallbackMethod) attributes.statusCallbackMethod = options.statusCallbackMethod;
    
    this.elements.push({
      type: 'Say',
      attributes,
      content: text
    });
    
    return this;
  }

  /**
   * Add a Gather element to the Response
   * @param {Object} options - Configuration for the Gather element
   * @returns {Object} - A builder for nested elements
   */
  addGather(options = {}) {
    const gatherId = `gather_${this.elements.length}`;
    const attributes = {};
    
    if (options.action) attributes.action = options.action;
    if (options.method) attributes.method = options.method;
    if (options.input) attributes.input = options.input;
    if (options.finishOnKey !== undefined) attributes.finishOnKey = options.finishOnKey;
    if (options.numDigits) attributes.numDigits = options.numDigits;
    if (options.maxTimeout) attributes.maxTimeout = options.maxTimeout;
    if (options.timeout) attributes.timeout = options.timeout;
    if (options.speechTimeout) attributes.speechTimeout = options.speechTimeout;
    if (options.speechEngine) attributes.speechEngine = options.speechEngine;
    if (options.language) attributes.language = options.language;
    if (options.actionOnEmptyResult !== undefined) attributes.actionOnEmptyResult = options.actionOnEmptyResult;
    if (options.maxDuration) attributes.maxDuration = options.maxDuration;
    if (options.speechDetection) attributes.speechDetection = options.speechDetection;
    if (options.interruptible !== undefined) attributes.interruptible = options.interruptible;
    
    this.elements.push({
      type: 'Gather',
      attributes,
      id: gatherId
    });
    
    // Create a new list for nested elements
    this.nestedElements.set(gatherId, []);
    
    // Create the gather builder
    const gatherBuilder = {
      addSay: (text, sayOptions = {}) => {
        const sayAttributes = {};
        if (sayOptions.voice) sayAttributes.voice = sayOptions.voice;
        if (sayOptions.language) sayAttributes.language = sayOptions.language;
        
        this.nestedElements.get(gatherId).push({
          type: 'Say',
          attributes: sayAttributes,
          content: text
        });
        
        return gatherBuilder;
      },
      
      addPlay: (url, playOptions = {}) => {
        const playAttributes = {};
        if (playOptions.loop) playAttributes.loop = playOptions.loop;
        
        this.nestedElements.get(gatherId).push({
          type: 'Play',
          attributes: playAttributes,
          content: url
        });
        
        return gatherBuilder;
      },
      
      addPause: (length = 1) => {
        this.nestedElements.get(gatherId).push({
          type: 'Pause',
          attributes: { length },
          content: undefined
        });
        
        return gatherBuilder;
      },
      
      done: () => this
    };
    
    return gatherBuilder;
  }

  /**
   * Add a Redirect element to the Response
   * @param {string} url - The URL to redirect to
   * @param {string} method - HTTP method to use (GET/POST)
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addRedirect(url, method = 'POST') {
    this.elements.push({
      type: 'Redirect',
      attributes: { method },
      content: url
    });
    
    return this;
  }

  /**
   * Add a Hangup element to the Response
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addHangup() {
    this.elements.push({
      type: 'Hangup',
      attributes: {},
      content: undefined
    });
    
    return this;
  }

  /**
   * Add a Dial element to the Response
   * @param {string|Object} numberOrOptions - Phone number to dial or options object
   * @param {Object} options - Optional parameters for the Dial element
   * @returns {Object} - A builder for nested elements
   */
  addDial(numberOrOptions = {}, options = {}) {
    const dialId = `dial_${this.elements.length}`;
    const attributes = {};
    let content = undefined;
    
    // Handle the case where first argument is a string (phone number)
    if (typeof numberOrOptions === 'string') {
      content = numberOrOptions;
      options = options || {};
    } else {
      // First argument is options object
      options = numberOrOptions || {};
    }
    
    // Add attributes from options
    if (options.action) attributes.action = options.action;
    if (options.callerId) attributes.callerId = options.callerId;
    if (options.callerName) attributes.callerName = options.callerName;
    if (options.forwardHeaders !== undefined) attributes.forwardHeaders = options.forwardHeaders;
    if (options.headers) attributes.headers = options.headers;
    if (options.hangupOnStar !== undefined) attributes.hangupOnStar = options.hangupOnStar;
    if (options.hangupOn) attributes.hangupOn = options.hangupOn;
    if (options.method) attributes.method = options.method;
    if (options.record) attributes.record = options.record;
    if (options.recordingStatusCallback) attributes.recordingStatusCallback = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) attributes.recordingStatusCallbackMethod = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) attributes.recordingStatusCallbackEvent = options.recordingStatusCallbackEvent;
    if (options.timeLimit) attributes.timeLimit = options.timeLimit;
    if (options.timeout) attributes.timeout = options.timeout;
    if (options.trim) attributes.trim = options.trim;
    if (options.trunks) attributes.trunks = options.trunks;
    
    this.elements.push({
      type: 'Dial',
      attributes,
      content,
      id: dialId
    });
    
    // Create a new list for nested elements
    this.nestedElements.set(dialId, []);
    
    // Create the dial builder
    const dialBuilder = {
      addNumber: (number) => {
        this.nestedElements.get(dialId).push({
          type: 'Number',
          attributes: {},
          content: number
        });
        
        return dialBuilder;
      },
      
      addSip: (sipUri, sipOptions = {}) => {
        const sipAttributes = {};
        if (sipOptions.username) sipAttributes.username = sipOptions.username;
        if (sipOptions.password) sipAttributes.password = sipOptions.password;
        if (sipOptions.domain) sipAttributes.domain = sipOptions.domain;
        
        this.nestedElements.get(dialId).push({
          type: 'Sip',
          attributes: sipAttributes,
          content: sipUri
        });
        
        return dialBuilder;
      },
      
      addConference: (conferenceName, confOptions = {}) => {
        const confAttributes = {};
        
        // Add conference attributes
        if (confOptions.beep !== undefined) confAttributes.beep = confOptions.beep;
        if (confOptions.dtmf) confAttributes.dtmf = confOptions.dtmf;
        if (confOptions.holdMusic !== undefined) confAttributes.holdMusic = confOptions.holdMusic;
        if (confOptions.muted !== undefined) confAttributes.muted = confOptions.muted;
        if (confOptions.prompts !== undefined) confAttributes.prompts = confOptions.prompts;
        if (confOptions.startConferenceOnEnter !== undefined) confAttributes.startConferenceOnEnter = confOptions.startConferenceOnEnter;
        if (confOptions.endConferenceOnExit !== undefined) confAttributes.endConferenceOnExit = confOptions.endConferenceOnExit;
        if (confOptions.maxParticipants) confAttributes.maxParticipants = confOptions.maxParticipants;
        if (confOptions.record) confAttributes.record = confOptions.record;
        if (confOptions.recordingStatusCallback) confAttributes.recordingStatusCallback = confOptions.recordingStatusCallback;
        if (confOptions.recordingStatusCallbackMethod) confAttributes.recordingStatusCallbackMethod = confOptions.recordingStatusCallbackMethod;
        if (confOptions.recordingStatusCallbackEvent) confAttributes.recordingStatusCallbackEvent = confOptions.recordingStatusCallbackEvent;
        if (confOptions.statusCallbackEvent) confAttributes.statusCallbackEvent = confOptions.statusCallbackEvent;
        if (confOptions.statusCallback) confAttributes.statusCallback = confOptions.statusCallback;
        if (confOptions.statusCallbackMethod) confAttributes.statusCallbackMethod = confOptions.statusCallbackMethod;
        if (confOptions.talkDetection) confAttributes.talkDetection = confOptions.talkDetection;
        if (confOptions.trim) confAttributes.trim = confOptions.trim;
        
        this.nestedElements.get(dialId).push({
          type: 'Conference',
          attributes: confAttributes,
          content: conferenceName
        });
        
        return dialBuilder;
      },
      
      addService: (serviceNumber, svcOptions = {}) => {
        const svcAttributes = {};
        if (svcOptions.provider) svcAttributes.provider = svcOptions.provider;
        if (svcOptions.username) svcAttributes.username = svcOptions.username;
        if (svcOptions.password) svcAttributes.password = svcOptions.password;
        
        this.nestedElements.get(dialId).push({
          type: 'Service',
          attributes: svcAttributes,
          content: serviceNumber
        });
        
        return dialBuilder;
      },
      
      addHeader: (name, value) => {
        this.nestedElements.get(dialId).push({
          type: 'Header',
          attributes: { name, value },
          content: undefined
        });
        
        return dialBuilder;
      },
      
      done: () => this
    };
    
    return dialBuilder;
  }

  /**
   * Add a Pause element to the Response
   * @param {number} length - The length of the pause in seconds
   * @param {Object} options - Optional parameters for the Pause element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addPause(length = 1, options = {}) {
    const attributes = { length };
    
    if (options.answer !== undefined) attributes.answer = options.answer;
    
    this.elements.push({
      type: 'Pause',
      attributes,
      content: undefined
    });
    
    return this;
  }

  /**
   * Add a Reject element to the Response
   * @param {Object} options - Optional parameters for the Reject element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addReject(options = {}) {
    const attributes = {};
    
    if (options.reason) attributes.reason = options.reason;
    
    this.elements.push({
      type: 'Reject',
      attributes,
      content: undefined
    });
    
    return this;
  }
  
  /**
   * Add a Record element to the Response
   * @param {Object} options - Configuration for the Record element
   * @param {boolean} options.answer - Whether to answer the call before recording
   * @param {string} options.action - URL to which the recording information will be sent
   * @param {string} options.method - HTTP method to use (GET/POST)
   * @param {number} options.timeout - Maximum length of silence in seconds before ending
   * @param {number} options.maxLength - Maximum length of the recording in seconds
   * @param {number} options.maxSilence - Maximum silence length in seconds
   * @param {string} options.finishOnKey - Key that ends recording
   * @param {boolean} options.playBeep - Whether to play a beep before recording starts
   * @param {boolean} options.transcribe - Whether to transcribe the recording
   * @param {string} options.transcribeCallback - URL to which the transcription will be sent
   * @param {string} options.transcribeEngine - Transcription engine to use
   * @param {string} options.recordingStatusCallback - URL for recording status events
   * @param {string} options.recordingStatusCallbackMethod - HTTP method for status callback
   * @param {string} options.recordingStatusCallbackEvent - Events to trigger callbacks
   * @param {string} options.trim - How to trim silence (trim, trim-silence, do-not-trim)
   * @param {string} options.fileFormat - Format of the recording (mp3, wav)
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addRecord(options = {}) {
    const attributes = {};
    
    if (options.answer !== undefined) attributes.answer = options.answer;
    if (options.action) attributes.action = options.action;
    if (options.method) attributes.method = options.method;
    if (options.timeout) attributes.timeout = options.timeout;
    if (options.maxLength) attributes.maxLength = options.maxLength;
    if (options.maxSilence) attributes.maxSilence = options.maxSilence;
    if (options.finishOnKey) attributes.finishOnKey = options.finishOnKey;
    if (options.playBeep !== undefined) attributes.playBeep = options.playBeep;
    if (options.transcribe !== undefined) attributes.transcribe = options.transcribe;
    if (options.transcribeCallback) attributes.transcribeCallback = options.transcribeCallback;
    if (options.transcribeEngine) attributes.transcribeEngine = options.transcribeEngine;
    if (options.recordingStatusCallback) attributes.recordingStatusCallback = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) attributes.recordingStatusCallbackMethod = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) attributes.recordingStatusCallbackEvent = options.recordingStatusCallbackEvent;
    if (options.trim) attributes.trim = options.trim;
    if (options.fileFormat) attributes.fileFormat = options.fileFormat;
    
    this.elements.push({
      type: 'Record',
      attributes,
      content: undefined
    });
    
    return this;
  }
  
  /**
   * Add a Coach element to the Response
   * @param {string} phoneNumber - Phone number to connect for coaching
   * @param {Object} options - Configuration for the Coach element
   * @param {string} options.callerId - Caller ID to use when dialing out
   * @param {string} options.callerName - Name to use for caller ID
   * @param {boolean} options.listen - Whether the coach can listen to the call
   * @param {boolean} options.speak - Whether the coach can speak to the agent
   * @param {boolean} options.whisper - Whether the coach can whisper to the agent
   * @param {boolean} options.barge - Whether the coach can barge into the call
   * @param {number} options.timeout - Timeout in seconds for the coach to answer
   * @param {string} options.statusCallback - URL for status callbacks
   * @param {string} options.statusCallbackMethod - HTTP method for status callback
   * @param {string} options.statusCallbackEvent - Events to trigger callbacks
   * @param {boolean} options.record - Whether to record the coaching session
   * @param {string} options.recordingStatusCallback - URL for recording status callbacks
   * @param {string} options.recordingStatusCallbackMethod - HTTP method for recording status callback
   * @param {string} options.recordingStatusCallbackEvent - Events to trigger recording callbacks
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addCoach(phoneNumber, options = {}) {
    const attributes = {};
    
    if (options.callerId) attributes.callerId = options.callerId;
    if (options.callerName) attributes.callerName = options.callerName;
    if (options.listen !== undefined) attributes.listen = options.listen;
    if (options.speak !== undefined) attributes.speak = options.speak;
    if (options.whisper !== undefined) attributes.whisper = options.whisper;
    if (options.barge !== undefined) attributes.barge = options.barge;
    if (options.timeout) attributes.timeout = options.timeout;
    if (options.statusCallback) attributes.statusCallback = options.statusCallback;
    if (options.statusCallbackMethod) attributes.statusCallbackMethod = options.statusCallbackMethod;
    if (options.statusCallbackEvent) attributes.statusCallbackEvent = options.statusCallbackEvent;
    if (options.record !== undefined) attributes.record = options.record;
    if (options.recordingStatusCallback) attributes.recordingStatusCallback = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) attributes.recordingStatusCallbackMethod = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) attributes.recordingStatusCallbackEvent = options.recordingStatusCallbackEvent;
    
    this.elements.push({
      type: 'Coach',
      attributes,
      content: phoneNumber
    });
    
    return this;
  }

  /**
   * Build the CXML document and return it as a string
   * @returns {string} - The XML document as a string
   */
  build() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';
    
    // Add each element in order
    for (const element of this.elements) {
      xml += this._renderElement(element, 1);
    }
    
    xml += '</Response>';
    
    return xml;
  }
  
  /**
   * Render an element as XML
   * @private
   * @param {Object} element - The element to render
   * @param {number} indentLevel - The current indent level
   * @returns {string} - The XML string
   */
  _renderElement(element, indentLevel) {
    const indent = '  '.repeat(indentLevel);
    let result = `${indent}<${element.type}`;
    
    // Add attributes
    for (const [name, value] of Object.entries(element.attributes)) {
      result += ` ${name}="${this._escapeXml(String(value))}"`;
    }
    
    // Check if the element has nested elements
    const hasNestedElements = element.id && this.nestedElements.has(element.id) && 
                              this.nestedElements.get(element.id).length > 0;
    
    // Handle self-closing tags, content, and nested elements
    if (!element.content && !hasNestedElements) {
      // Self-closing element with no content
      result += '/>\n';
    } else if (element.content && !hasNestedElements) {
      // Element with text content but no nested elements
      result += `>${this._escapeXml(element.content)}</${element.type}>\n`;
    } else if (!element.content && hasNestedElements) {
      // Element with nested elements but no text content
      result += '>\n';
      
      // Add all nested elements
      for (const nestedElement of this.nestedElements.get(element.id)) {
        result += this._renderElement(nestedElement, indentLevel + 1);
      }
      
      result += `${indent}</${element.type}>\n`;
    } else {
      // Element with both text content and nested elements
      // For standard XML, keep the text content on the same line as the opening tag
      result += '>' + this._escapeXml(element.content) + '\n';
      
      // Add all nested elements
      for (const nestedElement of this.nestedElements.get(element.id)) {
        result += this._renderElement(nestedElement, indentLevel + 1);
      }
      
      result += `${indent}</${element.type}>\n`;
    }
    
    return result;
  }
  
  /**
   * Escape special characters in XML
   * @private
   * @param {string} str - The string to escape
   * @returns {string} - The escaped string
   */
  _escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

module.exports = CXMLBuilder;