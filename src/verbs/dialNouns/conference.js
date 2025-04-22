/**
 * @file Conference noun implementation for Dial verb
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/dialNouns/conference
 * @description Implements the Conference noun for connecting to conference rooms
 */

'use strict';

module.exports = {
  /**
   * Add a Conference noun to the Dial element
   * @param {Object} dialElement - The Dial element to add the Conference to
   * @param {string} conferenceName - The name of the conference
   * @param {Object} options - Optional parameters for the Conference element
   * @returns {void}
   */
  add: (dialElement, conferenceName, options = {}) => {
    if (!dialElement.Conference) {
      dialElement.Conference = [];
    }
    
    if (!Array.isArray(dialElement.Conference)) {
      dialElement.Conference = [dialElement.Conference];
    }
    
    const conferenceElement = { '#text': conferenceName };
    
    // Add all allowed conference attributes
    if (options.beep !== undefined) conferenceElement['@_beep'] = options.beep;
    if (options.dtmf) conferenceElement['@_dtmf'] = options.dtmf;
    if (options.holdMusic !== undefined) conferenceElement['@_holdMusic'] = options.holdMusic;
    if (options.muted !== undefined) conferenceElement['@_muted'] = options.muted;
    if (options.prompts !== undefined) conferenceElement['@_prompts'] = options.prompts;
    if (options.startConferenceOnEnter !== undefined) conferenceElement['@_startConferenceOnEnter'] = options.startConferenceOnEnter;
    if (options.endConferenceOnExit !== undefined) conferenceElement['@_endConferenceOnExit'] = options.endConferenceOnExit;
    if (options.maxParticipants) conferenceElement['@_maxParticipants'] = options.maxParticipants;
    if (options.record) conferenceElement['@_record'] = options.record;
    if (options.recordingStatusCallback) conferenceElement['@_recordingStatusCallback'] = options.recordingStatusCallback;
    if (options.recordingStatusCallbackMethod) conferenceElement['@_recordingStatusCallbackMethod'] = options.recordingStatusCallbackMethod;
    if (options.recordingStatusCallbackEvent) conferenceElement['@_recordingStatusCallbackEvent'] = options.recordingStatusCallbackEvent;
    if (options.statusCallbackEvent) conferenceElement['@_statusCallbackEvent'] = options.statusCallbackEvent;
    if (options.statusCallback) conferenceElement['@_statusCallback'] = options.statusCallback;
    if (options.statusCallbackMethod) conferenceElement['@_statusCallbackMethod'] = options.statusCallbackMethod;
    if (options.talkDetection) conferenceElement['@_talkDetection'] = options.talkDetection;
    if (options.trim) conferenceElement['@_trim'] = options.trim;
    
    dialElement.Conference.push(conferenceElement);
  }
};