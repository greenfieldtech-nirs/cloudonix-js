/**
 * @file Example demonstrating a complex call center coaching scenario
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// This example demonstrates a complete call center scenario with coaching
// A supervisor calls in to monitor and potentially assist agents handling customer calls
const cxml = new CXMLBuilder()
  .createResponse()
  
  // Welcome the supervisor
  .addSay("Welcome to the call center coaching system.", {
    voice: "Google:en-US-Neural2-F",
    language: "en-US"
  })
  .addPause(0.5)
  
  // Main menu for coach to select what they want to do
  .addGather({
    input: "dtmf speech",
    timeout: 5,
    numDigits: 1,
    action: "https://example.com/coach-action",
    method: "POST",
    speechTimeout: "auto",
    language: "en-US"
  })
  .addSay("Press 1 or say 'listen' to monitor calls in listen-only mode.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.5)
  .addSay("Press 2 or say 'whisper' to monitor and whisper to the agent.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.5)
  .addSay("Press 3 or say 'barge' for full participation in the call.", {
    voice: "Google:en-US-Neural2-F"
  })
  .done()
  
  // Simulate the system finding an active call to monitor
  .addSay("Thank you. Searching for active calls to monitor...", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPlay("https://example.com/audio/hold-music.mp3", {
    loop: 1
  })
  
  // Listen-only mode coaching
  .addSay("Connecting you to Agent Sarah in listen-only mode. The agent and customer will not hear you.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addCoach("+18005551234", {
    callerId: "+15551234567",
    callerName: "Supervisor",
    listen: true,
    speak: false,
    whisper: false,
    barge: false,
    timeout: 30,
    statusCallback: "https://example.com/coach-status",
    statusCallbackMethod: "POST",
    statusCallbackEvent: "initiated ringing answered completed",
    record: true,
    recordingStatusCallback: "https://example.com/recording-status"
  })
  
  // Gather to get feedback after coaching session ends
  .addGather({
    input: "dtmf speech",
    timeout: 10,
    action: "https://example.com/coach-feedback",
    method: "POST"
  })
  .addSay("The coaching session has ended. Would you like to leave feedback for this agent?", {
    voice: "Google:en-US-Neural2-F"
  })
  .addSay("Press 1 or say 'yes' to leave feedback.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addSay("Press 2 or say 'no' to end the session.", {
    voice: "Google:en-US-Neural2-F"
  })
  .done()
  
  // Record feedback for the agent
  .addSay("Please leave your feedback for the agent after the tone. Press pound when finished.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addRecord({
    action: "https://example.com/save-feedback",
    method: "POST",
    maxLength: 120,
    playBeep: true,
    finishOnKey: "#",
    transcribe: true,
    transcribeCallback: "https://example.com/transcribe-feedback"
  })
  
  // Thank you message
  .addSay("Thank you for your feedback. Your recording has been saved and will be shared with the agent.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addSay("Goodbye.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addHangup()
  .build();

console.log(cxml);