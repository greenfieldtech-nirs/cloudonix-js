/**
 * @file Example demonstrating the Record verb functionality
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a simple recording flow
 * @returns {CXMLBuilder} - CXML builder with the recording flow
 */
function createSimpleRecordingFlow() {
  return new CXMLBuilder()
    .createResponse()
    // Welcome message
    .addSay("Please leave a message after the beep.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    
    // Simple recording
    .addRecord({
      action: "/handle-recording",
      method: "POST",
      maxLength: 60,
      playBeep: true,
      finishOnKey: "#"
    });
}

/**
 * Creates an advanced recording flow with transcription
 * @returns {CXMLBuilder} - CXML builder with the advanced recording flow
 */
function createAdvancedRecordingFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addSay("Please leave a detailed message after the beep. Press pound when finished.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    
    // Advanced recording with transcription
    .addRecord({
      action: "/handle-transcribed-recording",
      method: "POST",
      timeout: 5,
      maxLength: 120,
      maxSilence: 3,
      playBeep: true,
      finishOnKey: "#",
      transcribe: true,
      transcribeCallback: "/handle-transcription",
      transcribeEngine: "google",
      recordingStatusCallback: "/recording-status",
      recordingStatusCallbackMethod: "POST",
      recordingStatusCallbackEvent: "in-progress completed",
      trim: "trim-silence",
      fileFormat: "mp3"
    });
}

/**
 * Creates a recording flow with nested verbs using the callback pattern
 * @returns {CXMLBuilder} - CXML builder with nested verbs in the Record
 */
function createNestedRecordingFlow() {
  return new CXMLBuilder()
    .createResponse()
    // Recording with nested verbs using callback pattern
    .addRecord({
      action: "/handle-recording",
      method: "POST",
      timeout: 5,
      maxLength: 60,
      playBeep: false,  // We'll play our own beep sound
      finishOnKey: "#"
    }, (cxml) => {
      cxml
        .addSay("Please leave a message after the tone.", {
          voice: "Google:en-US-Neural2-F",
          language: "en-US"
        })
        .addPause(1)
        .addPlay("https://example.com/sounds/beep.wav")
        .addPause(0.5);
    });
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  console.log('Simple Recording:');
  console.log(createSimpleRecordingFlow().build());
  
  console.log('\nAdvanced Recording:');
  console.log(createAdvancedRecordingFlow().build());
  
  console.log('\nNested Recording:');
  console.log(createNestedRecordingFlow().build());
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createSimpleRecordingFlow,
    createAdvancedRecordingFlow,
    createNestedRecordingFlow
  };
}

/**
 * Runs a CXML server with the Record example
 */
function runServer() {
  const PORT = process.env.PORT || 3001;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Main welcome route - entry point for the simple recording
  server.route('/simple-recording', async (context) => {
    return createSimpleRecordingFlow();
  });
  
  // Advanced recording route
  server.route('/advanced-recording', async (context) => {
    return createAdvancedRecordingFlow();
  });
  
  // Nested recording route
  server.route('/nested-recording', async (context) => {
    return createNestedRecordingFlow();
  });
  
  // Handle recording completion
  server.route('/handle-recording', async (context) => {
    console.log('Received recording data:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder()
      .createResponse()
      .addSay("Thank you for your message. Goodbye.", {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle transcribed recording completion
  server.route('/handle-transcribed-recording', async (context) => {
    console.log('Received transcribed recording data:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder()
      .createResponse()
      .addSay("Thank you for your detailed message. We will process your transcription. Goodbye.", {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle transcription callback
  server.route('/handle-transcription', async (context) => {
    console.log('Received transcription:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder()
      .createResponse()
      .addSay("Transcription received.", {
        voice: "Google:en-US-Neural2-F"
      });
  });
  
  // Handle recording status updates
  server.route('/recording-status', async (context) => {
    console.log('Recording status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  // Home page with links to all demos
  server.route('/', async (context) => {
    // Return a simple HTML page instead of CXML since this is for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Record Verb Examples</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Record Verb Examples</h1>
          <p>Click the links below to see different Record verb examples:</p>
          
          <a href="/simple-recording">Simple Recording Example</a>
          <a href="/advanced-recording">Advanced Recording with Transcription</a>
          <a href="/nested-recording">Nested Recording with Verbs</a>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Record verb in Cloudonix CXML. In a real telephony application, these would record actual audio from the caller.</p>
          
          <h3>Simple Recording Example Code:</h3>
          <pre>
.addRecord({
  action: "/handle-recording",
  method: "POST",
  maxLength: 60,
  playBeep: true,
  finishOnKey: "#"
})
          </pre>
          
          <h3>Advanced Recording Example Code:</h3>
          <pre>
.addRecord({
  action: "/handle-transcribed-recording",
  method: "POST",
  timeout: 5,
  maxLength: 120,
  maxSilence: 3,
  playBeep: true,
  finishOnKey: "#",
  transcribe: true,
  transcribeCallback: "/handle-transcription",
  transcribeEngine: "google",
  recordingStatusCallback: "/recording-status",
  recordingStatusCallbackMethod: "POST",
  recordingStatusCallbackEvent: "in-progress completed",
  trim: "trim-silence",
  fileFormat: "mp3"
})
          </pre>
          
          <h3>Nested Recording Example Code:</h3>
          <pre>
.addRecord({
  action: "/handle-recording",
  method: "POST",
  timeout: 5,
  maxLength: 60,
  playBeep: false,  // We'll play our own beep sound
  finishOnKey: "#"
}, (cxml) => {
  cxml
    .addSay("Please leave a message after the tone.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    .addPause(1)
    .addPlay("https://example.com/sounds/beep.wav")
    .addPause(0.5);
})
          </pre>
        </body>
      </html>
    `;
  });
  
  // Start the server
  async function startServer() {
    try {
      await server.start();
      console.log(`Record Example server running at http://localhost:${PORT}/`);
      console.log('Open the above URL in your browser to see available examples');
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