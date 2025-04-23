/**
 * @file Record verb implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/record
 * @description Implements the Record verb for recording audio from callers
 */

'use strict';

const SayVerb = require('./say');
const PlayVerb = require('./play');
const PauseVerb = require('./pause');

/**
 * RecordBuilder class for building the Record verb with its nested elements
 * Note: Record can contain Say, Play, and Pause verbs as nested elements
 */
class RecordBuilder {
  constructor(cxmlBuilder, recordElement) {
    this.cxmlBuilder = cxmlBuilder;
    this.recordElement = recordElement;
    
    // Initialize cxml property if it doesn't exist
    if (!this.recordElement.cxml) {
      this.recordElement.cxml = [];
    }
  }
  
  /**
   * Add a Say element to the Record
   * @param {string} text - The text to be spoken
   * @param {Object} options - Optional parameters for the Say element
   * @param {string} options.voice - The voice to use for TTS
   * @param {string} options.language - The language of the text
   * @returns {RecordBuilder} - The builder instance for chaining
   */
  addSay(text, options = {}) {
    const sayElement = SayVerb.create(text, options);
    this.recordElement.cxml.push({
      type: 'Say',
      element: sayElement
    });
    return this;
  }
  
  /**
   * Add a Play element to the Record
   * @param {string} url - The URL of the audio file to play
   * @param {Object} options - Optional parameters for the Play element
   * @returns {RecordBuilder} - The builder instance for chaining
   */
  addPlay(url, options = {}) {
    const playElement = PlayVerb.create(url, options);
    this.recordElement.cxml.push({
      type: 'Play',
      element: playElement
    });
    return this;
  }
  
  /**
   * Add a Pause element to the Record
   * @param {number} length - The length of the pause in seconds
   * @param {Object} options - Optional parameters for the Pause element
   * @returns {RecordBuilder} - The builder instance for chaining
   */
  addPause(length, options = {}) {
    const pauseElement = PauseVerb.create(length, options);
    this.recordElement.cxml.push({
      type: 'Pause',
      element: pauseElement
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
 * Record verb module
 */
module.exports = {
  /**
   * Create a Record element with optional RecordBuilder
   * @param {CXMLBuilder} cxmlBuilder - The parent CXML builder
   * @param {Object} options - Configuration for the Record element
   * @param {boolean} options.answer - Whether to answer the call before recording (true/false)
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
   * @returns {Object} - Object containing the Record element and RecordBuilder
   */
  create: (cxmlBuilder, options = {}) => {
    const recordElement = { cxml: [] };
    
    // Add all supported attributes
    if (options.answer !== undefined) {
      recordElement['@_answer'] = options.answer;
    }
    
    if (options.action) {
      recordElement['@_action'] = options.action;
    }
    
    if (options.method) {
      recordElement['@_method'] = options.method;
    }
    
    if (options.timeout) {
      recordElement['@_timeout'] = options.timeout;
    }
    
    if (options.maxLength) {
      recordElement['@_maxLength'] = options.maxLength;
    }
    
    if (options.maxSilence) {
      recordElement['@_maxSilence'] = options.maxSilence;
    }
    
    if (options.finishOnKey) {
      recordElement['@_finishOnKey'] = options.finishOnKey;
    }
    
    if (options.playBeep !== undefined) {
      recordElement['@_playBeep'] = options.playBeep;
    }
    
    if (options.transcribe !== undefined) {
      recordElement['@_transcribe'] = options.transcribe;
    }
    
    if (options.transcribeCallback) {
      recordElement['@_transcribeCallback'] = options.transcribeCallback;
    }
    
    if (options.transcribeEngine) {
      recordElement['@_transcribeEngine'] = options.transcribeEngine;
    }
    
    if (options.recordingStatusCallback) {
      recordElement['@_recordingStatusCallback'] = options.recordingStatusCallback;
    }
    
    if (options.recordingStatusCallbackMethod) {
      recordElement['@_recordingStatusCallbackMethod'] = options.recordingStatusCallbackMethod;
    }
    
    if (options.recordingStatusCallbackEvent) {
      recordElement['@_recordingStatusCallbackEvent'] = options.recordingStatusCallbackEvent;
    }
    
    if (options.trim) {
      recordElement['@_trim'] = options.trim;
    }
    
    if (options.fileFormat) {
      recordElement['@_fileFormat'] = options.fileFormat;
    }
    
    // Create a RecordBuilder for adding nested elements
    const builder = new RecordBuilder(cxmlBuilder, recordElement);
    
    return { element: recordElement, builder };
  },
  
  // Export the RecordBuilder class for direct use if needed
  RecordBuilder
};