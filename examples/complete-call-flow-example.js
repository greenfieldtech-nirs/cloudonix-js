/**
 * @file Example demonstrating a complete call flow integrating all CXML verbs
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const CXMLBuilder = require('../src/builder');

// This example creates a complete call flow that demonstrates the integration of all CXML verbs
// including Record, Play, Say, Gather, Dial, Redirect, Pause, and Hangup in a practical scenario.
//
// Call flow:
// 1. Welcome message
// 2. Menu options
// 3. If option 1: Record a message
// 4. If option 2: Transfer to an agent
// 5. If option 3: Leave feedback
// 6. After each action, redirect to appropriate handler

const cxml = new CXMLBuilder()
  .createResponse()
  
  // Welcome and introduction
  .addSay("Thank you for calling our customer service line.", {
    voice: "Google:en-US-Neural2-F",
    language: "en-US"
  })
  .addPause(0.8)
  
  // Main menu with Gather
  .addGather({
    input: "dtmf speech",
    timeout: 7,
    numDigits: 1,
    action: "https://example.com/menu-handler",
    method: "POST",
    finishOnKey: "#",
    speechTimeout: "auto",
    speechEngine: "google",
    language: "en-US"
  })
  .addSay("Please select from the following options:", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.5)
  .addSay("Press 1 or say 'message' to leave a voice message.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.3)
  .addSay("Press 2 or say 'agent' to speak with a customer service representative.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.3)
  .addSay("Press 3 or say 'feedback' to leave feedback about our service.", {
    voice: "Google:en-US-Neural2-F"
  })
  .done()
  
  // If the customer chooses option 1: Record a message
  // In a real scenario, this would be handled by a separate CXML document after the Gather redirects
  .addSay("You have selected to leave a voice message.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.5)
  .addSay("Please speak after the tone. Press pound when finished.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addRecord({
    action: "https://example.com/handle-message",
    method: "POST",
    maxLength: 120,
    finishOnKey: "#",
    playBeep: true,
    transcribe: true,
    transcribeCallback: "https://example.com/transcribe-message",
    recordingStatusCallback: "https://example.com/recording-status",
    trim: "trim-silence"
  })
  
  // Confirmation after recording
  .addGather({
    input: "dtmf speech",
    timeout: 5,
    numDigits: 1,
    action: "https://example.com/confirm-message",
    method: "POST"
  })
  .addSay("Thank you for your message. Press 1 or say 'confirm' to send your message.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addSay("Press 2 or say 'retry' to record again.", {
    voice: "Google:en-US-Neural2-F"
  })
  .done()
  
  // If the customer chooses option 2: Transfer to an agent
  // In a real scenario, this would be in a separate CXML document
  .addSay("Transferring you to the next available agent. Please hold.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPlay("https://example.com/audio/hold-music.mp3", {
    loop: 3
  })
  .addDial({
    action: "https://example.com/handle-call-result",
    timeout: 60,
    callerId: "+15551234567",
    record: "record-from-answer",
    recordingStatusCallback: "https://example.com/recording-status",
    timeLimit: 1800
  })
  .addNumber("+18005551212")
  .addHeader("X-Department", "customer-service")
  .addHeader("X-Priority", "normal")
  .done()
  
  // Add a Coach to monitor the call (for supervisor access)
  .addSay("This call will be monitored for quality assurance.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addCoach("+18005559999", {
    callerId: "+15559876543",
    callerName: "Quality Supervisor",
    listen: true,    // Supervisor can listen
    speak: false,    // Supervisor cannot speak to customer
    whisper: true,   // Supervisor can whisper to agent
    barge: false,    // Supervisor cannot barge into call
    timeout: 20,
    statusCallback: "https://example.com/coach-status",
    record: true
  })
  
  // If the customer chooses option 3: Leave feedback
  // In a real scenario, this would be in a separate CXML document
  .addSay("We value your feedback. Please rate our service from 1 to 5, where 5 is excellent.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addGather({
    input: "dtmf",
    timeout: 10,
    numDigits: 1,
    action: "https://example.com/handle-feedback",
    method: "POST"
  })
  .addSay("Please press a number from 1 to 5 now.", {
    voice: "Google:en-US-Neural2-F"
  })
  .addPause(0.5)
  .addSay("Press 1 for poor, 5 for excellent.", {
    voice: "Google:en-US-Neural2-F"
  })
  .done()
  
  // Final message and redirect to a thank you page
  .addSay("Thank you for contacting us. Have a great day!", {
    voice: "Google:en-US-Neural2-F"
  })
  .addRedirect("https://example.com/thank-you-page", "POST")
  
  .build();

console.log(cxml);