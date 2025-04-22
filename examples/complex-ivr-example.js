/**
 * @file Example demonstrating a complex IVR system with multiple verbs and nesting
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a complex IVR flow with multiple nested elements and branching
 * @returns {CXMLBuilder} - CXML builder with the IVR flow
 */
function createMainIvrFlow() {
  const builder = new CXMLBuilder();
  
  return builder
    .createResponse()
    // Welcome message
    .addSay("Welcome to Acme Corporation's customer service line.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    .addPause(1)
    
    // First menu with instructions using multiple Say elements for better pacing
    .addSay("Please listen carefully to the following options.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.8)
    .addSay("For sales, press 1.", { voice: "Google:en-US-Neural2-F" })
    .addPause(0.5)
    .addSay("For technical support, press 2.", { voice: "Google:en-US-Neural2-F" })
    .addPause(0.5)
    .addSay("For billing inquiries, press 3.", { voice: "Google:en-US-Neural2-F" })
    .addPause(0.5)
    .addSay("To speak with an operator, press 0 or stay on the line.", { 
      voice: "Google:en-US-Neural2-F"
    })
    
    // Play hold music while waiting for input - this demonstrates different audio files
    .addPlay("https://example.com/audio/soft-tone.mp3")
    .addPause(0.5)
    
    // Gather user input with nested Say elements and proper timeouts
    .addGather({
      input: "dtmf", 
      numDigits: 1,
      timeout: 8,
      action: "/handle-main-menu", // Local path for server to handle
      method: "POST"
    })
    .addSay("Please make your selection now.", { voice: "Google:en-US-Neural2-F" })
    .done();
}

/**
 * Creates an operator transfer flow
 * @returns {CXMLBuilder} - CXML builder with the operator transfer flow
 */
function createOperatorTransferFlow() {
  const builder = new CXMLBuilder();
  
  return builder
    .createResponse()
    .addSay("Transferring you to the next available operator.", { 
      voice: "Google:en-US-Neural2-F"
    })
    .addPlay("https://example.com/audio/transferring.mp3")
    
    // Dial to an operator queue - shows nested dial nouns
    .addDial({
      action: "/handle-call-complete",
      timeout: 120,
      timeLimit: 3600,
      record: "record-from-answer"
    })
    .addNumber("1-800-555-ACME")
    .addHeader("X-Department", "customer-service")
    .addHeader("X-Priority", "standard")
    .done();
}

/**
 * Creates a voicemail flow
 * @returns {CXMLBuilder} - CXML builder with the voicemail flow
 */
function createVoicemailFlow() {
  const builder = new CXMLBuilder();
  
  return builder
    .createResponse()
    .addSay("We're sorry, but all operators are busy at this time.", { 
      voice: "Google:en-US-Neural2-F" 
    })
    .addPause(0.5)
    
    // Offer to leave a message
    .addSay("Please leave a message after the tone. Press pound when finished.", { 
      voice: "Google:en-US-Neural2-F" 
    })
    .addPause(0.5)
    
    // Record a message
    .addRecord({
      action: "/handle-voicemail",
      method: "POST",
      maxLength: 120,
      maxSilence: 5,
      playBeep: true,
      finishOnKey: "#",
      transcribe: true
    })
    
    .addSay("Thank you for your message. We'll get back to you soon.", { 
      voice: "Google:en-US-Neural2-F" 
    })
    .addPause(0.5)
    .addPlay("https://example.com/audio/goodbye.mp3")
    .addHangup();
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  const cxml = createMainIvrFlow().build();
  console.log(cxml);
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createMainIvrFlow,
    createOperatorTransferFlow,
    createVoicemailFlow
  };
}

/**
 * Runs a CXML server with the Complex IVR example
 */
function runServer() {
  const PORT = process.env.PORT || 3000;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Main welcome route - entry point for the IVR
  server.route('/welcome', async (context) => {
    return createMainIvrFlow();
  });
  
  // Handle main menu choices
  server.route('/handle-main-menu', async (context) => {
    let digits = '';
    
    // Extract digits from the request body
    if (typeof context.body === 'object' && context.body.Digits) {
      digits = context.body.Digits;
    } else if (typeof context.body === 'string') {
      // Try to parse form data or JSON
      if (context.body.includes('Digits=')) {
        const match = context.body.match(/Digits=(\d+)/);
        if (match) digits = match[1];
      } else {
        try {
          const data = JSON.parse(context.body);
          if (data.Digits) digits = data.Digits;
        } catch (e) {
          // Not JSON, ignore
        }
      }
    }
    
    console.log(`Menu selection: ${digits}`);
    
    // Route based on the selection
    switch (digits) {
      case '0': // Operator
        return createOperatorTransferFlow();
      case '1': // Sales
        return new CXMLBuilder()
          .createResponse()
          .addSay("Connecting you to our sales department.", { voice: "Google:en-US-Neural2-F" })
          .addRedirect('/transfer-to-operator');
      case '2': // Support
        return new CXMLBuilder()
          .createResponse()
          .addSay("Connecting you to technical support.", { voice: "Google:en-US-Neural2-F" })
          .addRedirect('/transfer-to-operator');
      case '3': // Billing
        return new CXMLBuilder()
          .createResponse()
          .addSay("Connecting you to billing inquiries.", { voice: "Google:en-US-Neural2-F" })
          .addRedirect('/transfer-to-operator');
      default:
        return new CXMLBuilder()
          .createResponse()
          .addSay("We didn't recognize your selection.", { voice: "Google:en-US-Neural2-F" })
          .addRedirect('/voicemail');
    }
  });
  
  // Transfer to operator route
  server.route('/transfer-to-operator', async (context) => {
    return createOperatorTransferFlow();
  });
  
  // Handle call completion (after dial)
  server.route('/handle-call-complete', async (context) => {
    // The call with the operator has ended, offer voicemail
    return new CXMLBuilder()
      .createResponse()
      .addRedirect('/voicemail');
  });
  
  // Voicemail route
  server.route('/voicemail', async (context) => {
    return createVoicemailFlow();
  });
  
  // Handle voicemail recording
  server.route('/handle-voicemail', async (context) => {
    // In a real app, you would save the recording URL from the request
    console.log('Received voicemail recording');
    if (context.body && context.body.RecordingUrl) {
      console.log(`Recording URL: ${context.body.RecordingUrl}`);
    }
    
    // Thank the caller and hang up
    return new CXMLBuilder()
      .createResponse()
      .addSay("Thank you for your message. Goodbye!", { voice: "Google:en-US-Neural2-F" })
      .addHangup();
  });
  
  // Start the server
  async function startServer() {
    try {
      await server.start();
      console.log(`Complex IVR Example server running at http://localhost:${PORT}/welcome`);
      console.log('Try accessing the above URL in your browser to see the CXML output');
      console.log('In a real telephony system, this would trigger an interactive voice response flow');
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
  
  startServer();
}

// For running with --server flag from command line
if (process.argv.includes('--server')) {
  runServer();
}