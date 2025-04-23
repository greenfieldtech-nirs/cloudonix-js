/**
 * @file Coach verb implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/verbs/coach
 * @description Implements the Coach verb for call monitoring and coaching
 */

'use strict';

module.exports = {
  /**
   * Create a Coach element
   * @param {string} phoneNumber - Phone number to connect for coaching
   * @param {Object} options - Configuration for the Coach element
   * @param {string} options.callerId - Caller ID to use when dialing out
   * @param {string} options.callerName - Name to use for caller ID
   * @param {boolean} options.listen - Whether the coach can listen to the call (true/false)
   * @param {boolean} options.speak - Whether the coach can speak to the agent (true/false)
   * @param {boolean} options.whisper - Whether the coach can whisper to the agent (true/false)
   * @param {boolean} options.barge - Whether the coach can barge into the call (true/false)
   * @param {number} options.timeout - Timeout in seconds for the coach to answer
   * @param {string} options.statusCallback - URL for status callbacks
   * @param {string} options.statusCallbackMethod - HTTP method for status callback (GET/POST)
   * @param {string} options.statusCallbackEvent - Events to trigger callbacks
   * @param {boolean} options.record - Whether to record the coaching session
   * @param {string} options.recordingStatusCallback - URL for recording status callbacks
   * @param {string} options.recordingStatusCallbackMethod - HTTP method for recording status callback
   * @param {string} options.recordingStatusCallbackEvent - Events to trigger recording callbacks
   * @returns {Object} - The Coach element
   */
  create: (phoneNumber, options = {}) => {
    const coachElement = { '#text': phoneNumber };
    
    // Add all supported attributes
    if (options.callerId) {
      coachElement['@_callerId'] = options.callerId;
    }
    
    if (options.callerName) {
      coachElement['@_callerName'] = options.callerName;
    }
    
    if (options.listen !== undefined) {
      coachElement['@_listen'] = options.listen;
    }
    
    if (options.speak !== undefined) {
      coachElement['@_speak'] = options.speak;
    }
    
    if (options.whisper !== undefined) {
      coachElement['@_whisper'] = options.whisper;
    }
    
    if (options.barge !== undefined) {
      coachElement['@_barge'] = options.barge;
    }
    
    if (options.timeout) {
      coachElement['@_timeout'] = options.timeout;
    }
    
    if (options.statusCallback) {
      coachElement['@_statusCallback'] = options.statusCallback;
    }
    
    if (options.statusCallbackMethod) {
      coachElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    }
    
    if (options.statusCallbackEvent) {
      coachElement['@_statusCallbackEvent'] = options.statusCallbackEvent;
    }
    
    if (options.record !== undefined) {
      coachElement['@_record'] = options.record;
    }
    
    if (options.recordingStatusCallback) {
      coachElement['@_recordingStatusCallback'] = options.recordingStatusCallback;
    }
    
    if (options.recordingStatusCallbackMethod) {
      coachElement['@_recordingStatusCallbackMethod'] = options.recordingStatusCallbackMethod;
    }
    
    if (options.recordingStatusCallbackEvent) {
      coachElement['@_recordingStatusCallbackEvent'] = options.recordingStatusCallbackEvent;
    }
    
    return coachElement;
  }
};