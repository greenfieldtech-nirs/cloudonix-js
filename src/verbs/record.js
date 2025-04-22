/**
 * @file Record verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/record
 * @description Implements the Record verb for recording audio from callers
 */

'use strict';

module.exports = {
  /**
   * Create a Record element
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
   * @returns {Object} - The Record element
   */
  create: (options = {}) => {
    const recordElement = {};
    
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
    
    return recordElement;
  }
};