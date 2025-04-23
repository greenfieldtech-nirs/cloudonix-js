/**
 * @file Example demonstrating a complex flow with nested Record, Play, and Gather verbs
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a record-and-confirm flow with nested verbs
 * @returns {CXMLBuilder} - CXML builder with the recording flow
 */
function createRecordAndConfirmFlow() {
  return new CXMLBuilder()
    .createResponse()
    
    // Introduction
    .addSay("Welcome to our voice message system.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    .addPause(1)
    
    // Instruction before recording
    .addSay("Please record your message after the beep. Press pound when finished.", {
      voice: "Google:en-US-Neural2-F"
    })
    
    // Record the message
    .addRecord({
      action: "/recording-handler",
      method: "POST",
      maxLength: 60,
      finishOnKey: "#",
      playBeep: true,
      timeout: 5,
      transcribe: true,
      transcribeCallback: "/transcription-handler",
      recordingStatusCallback: "/recording-status",
      recordingStatusCallbackMethod: "POST",
      trim: "trim-silence"
    });
}

/**
 * Creates a playback and confirmation flow
 * @param {string} recordingUrl - URL of the recording to play
 * @returns {CXMLBuilder} - CXML builder with the playback flow
 */
function createPlaybackAndConfirmFlow(recordingUrl = "http://example.com/recordings/sample.mp3") {
  return new CXMLBuilder()
    .createResponse()
    // Transition message
    .addSay("Thank you. Here's a playback of your recording:", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(1)
    
    // Play back the recording
    .addPlay(recordingUrl, {
      loop: 1
    })
    
    // Gather confirmation
    .addGather({
      input: "dtmf speech",
      timeout: 5,
      numDigits: 1,
      action: "/confirmation-handler",
      method: "POST",
      speechTimeout: "auto",
      speechEngine: "google",
      language: "en-US",
      hints: "yes,no,correct,incorrect,save,discard"
    })
    .addSay("Is this recording correct?", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    .addSay("Press 1 or say 'yes' to save the recording.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.3)
    .addSay("Press 2 or say 'no' to discard and try again.", {
      voice: "Google:en-US-Neural2-F"
    })
    .done()
    
    // Default action if no input is received
    .addRedirect("/save-recording");
}

/**
 * Creates a message saved confirmation
 * @returns {CXMLBuilder} - CXML builder with the save confirmation
 */
function createSaveConfirmation() {
  return new CXMLBuilder()
    .createResponse()
    .addSay("Your message has been saved successfully.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    .addSay("Thank you for using our service. Goodbye!", {
      voice: "Google:en-US-Neural2-F"
    })
    .addHangup();
}

/**
 * Creates a discard and retry flow
 * @returns {CXMLBuilder} - CXML builder with the retry flow
 */
function createRetryFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addSay("Your message has been discarded.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    .addSay("Let's try again.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addRedirect("/record-message");
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  const fullFlow = new CXMLBuilder()
    .createResponse()
    
    // Introduction
    .addSay("Welcome to our voice message system.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    .addPause(1)
    
    // Instruction before recording
    .addSay("Please record your message after the beep. Press pound when finished.", {
      voice: "Google:en-US-Neural2-F"
    })
    
    // Record the message
    .addRecord({
      action: "/recording-handler",
      method: "POST",
      maxLength: 60,
      finishOnKey: "#",
      playBeep: true,
      timeout: 5,
      transcribe: true,
      transcribeCallback: "/transcription-handler",
      recordingStatusCallback: "/recording-status",
      recordingStatusCallbackMethod: "POST",
      trim: "trim-silence"
    })
    
    // Transition message
    .addSay("Thank you. Here's a playback of your recording:", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(1)
    
    // Play back the recording
    .addPlay("http://example.com/recordings/sample.mp3", {
      loop: 1
    })
    
    // Gather confirmation
    .addGather({
      input: "dtmf speech",
      timeout: 5,
      numDigits: 1,
      action: "/confirmation-handler",
      method: "POST",
      speechTimeout: "auto",
      speechEngine: "google",
      language: "en-US",
      hints: "yes,no,correct,incorrect,save,discard"
    })
    .addSay("Is this recording correct?", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    .addSay("Press 1 or say 'yes' to save the recording.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.3)
    .addSay("Press 2 or say 'no' to discard and try again.", {
      voice: "Google:en-US-Neural2-F"
    })
    .done()
    
    // Default action if no input is received
    .addRedirect("/save-recording")
    
    .build();
  
  console.log(fullFlow);
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createRecordAndConfirmFlow,
    createPlaybackAndConfirmFlow,
    createSaveConfirmation,
    createRetryFlow
  };
}

/**
 * Runs a CXML server with the nested Record, Play, Gather example
 */
function runServer() {
  const PORT = process.env.PORT || 3006;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Mock recording URL - in a real app, this would be dynamic
  let recordingUrl = "http://example.com/recordings/sample.mp3";
  
  // Start the flow
  server.route('/record-message', async (context) => {
    return createRecordAndConfirmFlow();
  });
  
  // Handle recording completion
  server.route('/recording-handler', async (context) => {
    console.log('Recording completed:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
      
      // In a real app, we would get the recording URL from the request
      if (context.body.RecordingUrl) {
        recordingUrl = context.body.RecordingUrl;
      }
    } else {
      console.log(context.body);
    }
    
    // Continue to playback and confirmation
    return createPlaybackAndConfirmFlow(recordingUrl);
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
  
  // Handle transcription callback
  server.route('/transcription-handler', async (context) => {
    console.log('Transcription received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  // Handle confirmation input
  server.route('/confirmation-handler', async (context) => {
    console.log('Confirmation input received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    let choice = '';
    
    // Extract input from the request body
    if (typeof context.body === 'object') {
      if (context.body.Digits) {
        choice = context.body.Digits;
      } else if (context.body.SpeechResult || context.body.speech_result) {
        // For speech, extract yes/no
        const speech = (context.body.SpeechResult || context.body.speech_result || '').toLowerCase();
        if (speech.includes('yes') || speech.includes('correct') || speech.includes('save')) {
          choice = '1';
        } else if (speech.includes('no') || speech.includes('incorrect') || speech.includes('discard')) {
          choice = '2';
        }
      }
    } else if (typeof context.body === 'string') {
      // Try to parse form data or JSON
      if (context.body.includes('Digits=')) {
        const match = context.body.match(/Digits=(\d+)/);
        if (match) choice = match[1];
      }
    }
    
    // Route based on the confirmation choice
    if (choice === '1') {
      return new CXMLBuilder()
        .createResponse()
        .addRedirect('/save-recording');
    } else if (choice === '2') {
      return new CXMLBuilder()
        .createResponse()
        .addRedirect('/discard-recording');
    } else {
      return new CXMLBuilder()
        .createResponse()
        .addSay("I didn't understand your choice. Let's try again.", {
          voice: "Google:en-US-Neural2-F"
        })
        .addRedirect('/recording-handler');
    }
  });
  
  // Handle save recording
  server.route('/save-recording', async (context) => {
    return createSaveConfirmation();
  });
  
  // Handle discard and retry
  server.route('/discard-recording', async (context) => {
    return createRetryFlow();
  });
  
  // Home page with explanation
  server.route('/', async (context) => {
    // Return a simple HTML page for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nested Record, Play, Gather Example</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
            .section { margin-bottom: 30px; }
            .flow { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
            .step { margin: 10px 0 10px 20px; }
          </style>
        </head>
        <body>
          <h1>Nested Record, Play, Gather Example</h1>
          <p>This example demonstrates a complex voice application flow that:</p>
          
          <div class="flow">
            <div class="step">1. Records a message from the caller</div>
            <div class="step">2. Plays back the recording</div>
            <div class="step">3. Gathers confirmation from the user</div>
            <div class="step">4. Redirects to different handlers based on input</div>
          </div>
          
          <p>Click the link below to try the flow:</p>
          <a href="/record-message">Start Recording Flow</a>
          
          <h2>Flow Details</h2>
          <p>This example shows how to chain multiple CXML verbs together to create a complete voice application flow.</p>
          
          <h3>Code Example:</h3>
          <pre>
.addRecord({
  action: "/recording-handler",
  method: "POST",
  maxLength: 60,
  finishOnKey: "#",
  playBeep: true,
  timeout: 5,
  transcribe: true
})

// Later, after receiving the recording...
.addPlay(recordingUrl)

// Then get confirmation
.addGather({
  input: "dtmf speech",
  numDigits: 1,
  action: "/confirmation-handler"
})
.addSay("Is this recording correct?")
.done()
          </pre>
          
          <p>In a real telephony application, this flow would allow callers to record messages, review them, and confirm or re-record as needed.</p>
        </body>
      </html>
    `;
  });
  
  // Start the server
  async function startServer() {
    try {
      await server.start();
      console.log(`Nested Record Example server running at http://localhost:${PORT}/`);
      console.log('Open the above URL in your browser to see the flow');
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