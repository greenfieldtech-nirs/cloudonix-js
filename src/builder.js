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
const StartVerb = require('./verbs/start');
const ConverseVerb = require('./verbs/converse');

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
    // Use the Play verb to create the element
    const PlayVerb = require('./verbs/play');
    const playElement = PlayVerb.create(url, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Play',
      attributes: {},
      element: playElement,
      content: options.digits ? undefined : url
    });
    
    // Map attribute properties to our internal format
    for (const key in playElement) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = playElement[key];
      }
    }
    
    return this;
  }

  /**
   * Add a Say element to the Response
   * @param {string} text - The text to be spoken
   * @param {Object} options - Optional parameters for the Say element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addSay(text, options = {}) {
    // Use the Say verb to create the element
    const SayVerb = require('./verbs/say');
    const sayElement = SayVerb.create(text, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Say',
      attributes: {},
      element: sayElement,
      content: text
    });
    
    // Map attribute properties to our internal format
    for (const key in sayElement) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = sayElement[key];
      }
    }
    
    return this;
  }

  /**
   * Add a Gather element to the Response
   * @param {Object} options - Configuration for the Gather element
   * @param {Function} [cxml] - Callback function for defining nested elements
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addGather(options = {}, cxml) {
    // Use the Gather verb to create the element and builder
    const GatherVerb = require('./verbs/gather');
    
    // Create the element and builder
    const { element, builder } = GatherVerb.create(this, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Gather',
      attributes: {},
      element: element
    });
    
    // Map attribute properties to our internal format
    for (const key in element) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = element[key];
      }
    }
    
    // If a cxml callback is provided, create a temporary object with the available
    // nested verbs and pass it to the callback
    if (typeof cxml === 'function') {
      const gatherCxml = {
        addSay: (text, sayOptions = {}) => {
          builder.addSay(text, sayOptions);
          return gatherCxml;
        },
        
        addPlay: (url, playOptions = {}) => {
          builder.addPlay(url, playOptions);
          return gatherCxml;
        },
        
        addPause: (length = 1, pauseOptions = {}) => {
          builder.addPause(length, pauseOptions);
          return gatherCxml;
        },
        
        addConverse: (converseOptions = {}, converseCxml) => {
          builder.addConverse(converseOptions, converseCxml);
          return gatherCxml;
        }
      };
      
      // Execute the callback with the cxml object
      cxml(gatherCxml);
    }
    
    return this;
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
   * @param {Object|string} options - Options for the Dial element or phone number to dial
   * @param {Function} [cxml] - Callback function for defining nested elements
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addDial(options = {}, cxml) {
    // Use the Dial verb to create the element and builder
    const DialVerb = require('./verbs/dial');
    
    // Handle case where first argument is a phone number
    let dialOptions = {};
    if (typeof options === 'string') {
      // Don't create a number option, instead we'll add it directly after creating the element
      dialOptions = {};
    } else {
      dialOptions = options;
    }
    
    // Create the element and builder
    const { element, builder } = DialVerb.create(this, dialOptions);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Dial',
      attributes: {},
      element: element,
      content: element['#text']
    });
    
    // Map attribute properties to our internal format
    for (const key in element) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = element[key];
      }
    }
    
    // Handle string shorthand for phone number
    if (typeof options === 'string') {
      builder.addNumber(options);
    }
    
    // If a cxml callback is provided, create a temporary object with the available
    // nested nouns and pass it to the callback
    if (typeof cxml === 'function') {
      const dialCxml = {
        // Header noun should always be added first
        addHeader: (name, value) => {
          builder.addHeader(name, value);
          return dialCxml;
        },
        
        // Number noun - mutually exclusive with sip, conference, service
        addNumber: (number, options = {}) => {
          builder.addNumber(number, options);
          return dialCxml;
        },
        
        // Sip noun - mutually exclusive with number, conference, service
        addSip: (sipUri, sipOptions = {}) => {
          builder.addSip(sipUri, sipOptions);
          return dialCxml;
        },
        
        // Conference noun - mutually exclusive with number, sip, service
        addConference: (conferenceName, confOptions = {}) => {
          builder.addConference(conferenceName, confOptions);
          return dialCxml;
        },
        
        // Service noun - mutually exclusive with number, sip, conference
        addService: (serviceNumber, svcOptions = {}) => {
          builder.addService(serviceNumber, svcOptions);
          return dialCxml;
        }
      };
      
      // Execute the callback with the cxml object
      cxml(dialCxml);
    }
    
    return this;
  }

  /**
   * Add a Pause element to the Response
   * @param {number} length - The length of the pause in seconds
   * @param {Object} options - Optional parameters for the Pause element
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addPause(length = 1, options = {}) {
    // Use the Pause verb to create the element
    const PauseVerb = require('./verbs/pause');
    const pauseElement = PauseVerb.create(length, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Pause',
      attributes: {},
      element: pauseElement,
      content: undefined
    });
    
    // Map attribute properties to our internal format
    for (const key in pauseElement) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = pauseElement[key];
      }
    }
    
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
   * @param {Function} [cxml] - Callback function for defining nested elements
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addRecord(options = {}, cxml) {
    // Use the Record verb to create the element and builder
    const RecordVerb = require('./verbs/record');
    
    // Create the element and builder
    const { element, builder } = RecordVerb.create(this, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Record',
      attributes: {},
      element: element
    });
    
    // Map attribute properties to our internal format
    for (const key in element) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = element[key];
      }
    }
    
    // If a cxml callback is provided, create a temporary object with the available
    // nested verbs and pass it to the callback
    if (typeof cxml === 'function') {
      const recordCxml = {
        addSay: (text, sayOptions = {}) => {
          builder.addSay(text, sayOptions);
          return recordCxml;
        },
        
        addPlay: (url, playOptions = {}) => {
          builder.addPlay(url, playOptions);
          return recordCxml;
        },
        
        addPause: (length = 1, pauseOptions = {}) => {
          builder.addPause(length, pauseOptions);
          return recordCxml;
        }
      };
      
      // Execute the callback with the cxml object
      cxml(recordCxml);
    }
    
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
   * Add a Start element to the Response
   * @param {Function} [cxml] - Callback function for defining nested elements
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addStart(cxml) {
    // Use the Start verb to create the element and builder
    const StartVerb = require('./verbs/start');
    
    // Create the element and builder
    const { element, builder } = StartVerb.create(this);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Start',
      attributes: {},
      element: element
    });
    
    // If a cxml callback is provided, create a temporary object with the available
    // nested verbs and pass it to the callback
    if (typeof cxml === 'function') {
      const startCxml = {
        addStream: (options = {}) => {
          builder.addStream(options);
          return startCxml;
        }
      };
      
      // Execute the callback with the cxml object
      cxml(startCxml);
    }
    
    return this;
  }
  
  /**
   * Add a Converse element to the Response
   * @param {Object} options - Configuration for the Converse element
   * @param {string} options.voice - TTS voice to use
   * @param {string} options.language - Language code
   * @param {string} options.statusCallback - URL for status updates
   * @param {string} options.statusCallbackMethod - HTTP method for callbacks
   * @param {string} options.statusCallbackEvent - Events to trigger callbacks
   * @param {string} options.sessionTools - Built-in tools to enable ('hangup', 'redirect', 'dial')
   * @param {string} options.model - LLM model to use
   * @param {string} options.context - Context handling ('auto', 'none', 'no')
   * @param {number} options.temperature - Sampling temperature for LLM
   * @param {Function} [cxml] - Callback function for defining nested elements
   * @returns {CXMLBuilder} - The builder instance for chaining
   */
  addConverse(options = {}, cxml) {
    // Use the Converse verb to create the element and builder
    const ConverseVerb = require('./verbs/converse');
    
    // Create the element and builder
    const { element, builder } = ConverseVerb.create(this, options);
    
    // Add the element to our elements list
    this.elements.push({
      type: 'Converse',
      attributes: {},
      element: element
    });
    
    // Map attribute properties to our internal format
    for (const key in element) {
      if (key.startsWith('@_')) {
        this.elements[this.elements.length - 1].attributes[key.substring(2)] = element[key];
      }
    }
    
    // If a cxml callback is provided, create a temporary object with the available
    // nested nouns and pass it to the callback
    if (typeof cxml === 'function') {
      const converseCxml = {
        // Tool noun
        addTool: (name, url, toolOptions = {}) => {
          const toolBuilder = builder.addTool(name, url, toolOptions);
          
          // Return a tool object with parameter and description methods
          const toolObj = {
            addParameter: (paramName, paramOptions = {}) => {
              toolBuilder.addParameter(paramName, paramOptions);
              return toolObj;
            },
            addDescription: (description) => {
              toolBuilder.addDescription(description);
              return toolObj;
            },
            done: () => converseCxml
          };
          
          return toolObj;
        },
        
        // System noun
        addSystem: (text) => {
          builder.addSystem(text);
          return converseCxml;
        },
        
        // User noun
        addUser: (text) => {
          builder.addUser(text);
          return converseCxml;
        },
        
        // Speech noun
        addSpeech: () => {
          builder.addSpeech();
          return converseCxml;
        }
      };
      
      // Execute the callback with the cxml object
      cxml(converseCxml);
    }
    
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
    
    // Replace <s> with <System> to ensure System elements are rendered correctly
    xml = xml.replace(/<s>/g, '<System>').replace(/<\/s>/g, '</System>');
    
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
    
    // Special case for System elements
    let elementType = element.type;
    if (elementType === 'System') {
      elementType = 'System'; // Keep it as System
    } else if (elementType === 's' && element.content && typeof element.content === 'string') {
      // If it's an <s> tag with content, it's actually a System tag
      elementType = 'System';
    }
    
    let result = `${indent}<${elementType}`;
    
    // Add attributes
    for (const [name, value] of Object.entries(element.attributes)) {
      result += ` ${name}="${this._escapeXml(String(value))}"`;
    }
    
    // Check for different types of nested elements
    const hasLegacyNestedElements = element.id && this.nestedElements.has(element.id) && 
                                  this.nestedElements.get(element.id).length > 0;
    const hasCxmlNestedElements = element.element && element.element.cxml && 
                                element.element.cxml.length > 0;
    const hasToolNestedElements = element.type === 'Tool' && 
                                (element.element.Description || 
                                 (element.element.Parameter && element.element.Parameter.length > 0));
    
    // Handle self-closing tags, content, and nested elements
    if (!element.content && !hasLegacyNestedElements && !hasCxmlNestedElements && !hasToolNestedElements) {
      // Self-closing element with no content
      result += '/>\n';
    } else if (element.content && !hasLegacyNestedElements && !hasCxmlNestedElements && !hasToolNestedElements) {
      // Element with text content but no nested elements
      // Use the same element type for closing tag
      result += `>${this._escapeXml(element.content)}</${elementType}>\n`;
    } else {
      // Element with nested elements (and possibly content)
      if (element.content) {
        result += '>' + this._escapeXml(element.content) + '\n';
      } else {
        result += '>\n';
      }
      
      // Add legacy nested elements if they exist
      if (hasLegacyNestedElements) {
        for (const nestedElement of this.nestedElements.get(element.id)) {
          result += this._renderElement(nestedElement, indentLevel + 1);
        }
      }
      
      // Add cxml nested elements if they exist
      if (hasCxmlNestedElements) {
        for (const nestedItem of element.element.cxml) {
          // Create a temporary element structure that matches our rendering expectations
          const tempElement = {
            type: nestedItem.type,
            attributes: {},
            element: nestedItem.element,
            content: nestedItem.element['#text']
          };
          
          // Extract attributes from the element
          for (const key in nestedItem.element) {
            if (key.startsWith('@_')) {
              tempElement.attributes[key.substring(2)] = nestedItem.element[key];
            }
          }
          
          result += this._renderElement(tempElement, indentLevel + 1);
        }
      }
      
      // Add Tool's nested elements if they exist
      if (hasToolNestedElements) {
        // Add Description if it exists
        if (element.element.Description) {
          const descIndent = '  '.repeat(indentLevel + 1);
          result += `${descIndent}<Description>${this._escapeXml(element.element.Description['#text'])}</Description>\n`;
        }
        
        // Add Parameters if they exist
        if (element.element.Parameter && element.element.Parameter.length > 0) {
          const paramIndent = '  '.repeat(indentLevel + 1);
          for (const param of element.element.Parameter) {
            let paramStr = `${paramIndent}<Parameter`;
            
            // Add Parameter attributes
            for (const key in param) {
              if (key.startsWith('@_')) {
                paramStr += ` ${key.substring(2)}="${this._escapeXml(String(param[key]))}"`;
              }
            }
            
            paramStr += '/>\n';
            result += paramStr;
          }
        }
      }
      
      // Use the same element type for closing tag
      result += `${indent}</${elementType}>\n`;
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