/**
 * @file Examples demonstrating the Say verb functionality
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a basic Say element
 * @returns {CXMLBuilder} - CXML builder with a basic say
 */
function createBasicSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('Hello, welcome to our telephony system.');
}

/**
 * Creates a Say with voice and language options
 * @returns {CXMLBuilder} - CXML builder with voice options
 */
function createVoiceSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('Hello, welcome to our telephony system.', {
      voice: 'Google:en-US-Neural2-M',
      language: 'en-US'
    });
}

/**
 * Creates a Say with early media (no answer)
 * @returns {CXMLBuilder} - CXML builder with early media
 */
function createEarlyMediaSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('You have reached our after-hours voicemail. Please call back during business hours.', {
      answer: false
    });
}

/**
 * Creates a Say with looping
 * @returns {CXMLBuilder} - CXML builder with looped say
 */
function createLoopingSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('This is an important announcement. Please listen carefully.', {
      loop: 3 // Repeat 3 times
    });
}

/**
 * Creates a Say with status callback
 * @returns {CXMLBuilder} - CXML builder with status callback
 */
function createCallbackSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('Thank you for calling. Your call is very important to us.', {
      statusCallback: '/say-status',
      statusCallbackMethod: 'POST'
    });
}

/**
 * Creates a Say with premium voice
 * @returns {CXMLBuilder} - CXML builder with premium voice
 */
function createPremiumVoiceSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('This message is being read with a premium voice.', {
      voice: 'Google:en-US-Journey-F',
      language: 'en-US'
    });
}

/**
 * Creates a Say with SSML content
 * @returns {CXMLBuilder} - CXML builder with SSML content
 */
function createSSMLSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('Here is an <say-as interpret-as="characters">SSML</say-as> example. You can pause <break time="3s"/> the text or emphasize <emphasis level="strong">important words</emphasis>.');
}

/**
 * Creates a Say with multiple options
 * @returns {CXMLBuilder} - CXML builder with multiple options
 */
function createComplexSay() {
  return new CXMLBuilder()
    .createResponse()
    .addSay('This is a fully configured text-to-speech example.', {
      answer: true,
      voice: 'Google:en-US-Neural2-M',
      language: 'en-US',
      loop: 2,
      statusCallback: '/say-complete',
      statusCallbackMethod: 'POST'
    });
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML for all examples
  console.log("Example 1: Basic Say - Simple text to speech");
  console.log(createBasicSay().build());
  console.log("\n");
  
  console.log("Example 2: Say with voice and language options");
  console.log(createVoiceSay().build());
  console.log("\n");
  
  console.log("Example 3: Say with early media (no answer)");
  console.log(createEarlyMediaSay().build());
  console.log("\n");
  
  console.log("Example 4: Say with looping");
  console.log(createLoopingSay().build());
  console.log("\n");
  
  console.log("Example 5: Say with status callback");
  console.log(createCallbackSay().build());
  console.log("\n");
  
  console.log("Example 6: Say with premium voice");
  console.log(createPremiumVoiceSay().build());
  console.log("\n");
  
  console.log("Example 7: Say with SSML content");
  console.log(createSSMLSay().build());
  console.log("\n");
  
  console.log("Example 8: Say with multiple options");
  console.log(createComplexSay().build());
  console.log("\n");
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createBasicSay,
    createVoiceSay,
    createEarlyMediaSay,
    createLoopingSay,
    createCallbackSay,
    createPremiumVoiceSay,
    createSSMLSay,
    createComplexSay
  };
}

/**
 * Runs a CXML server with the Say examples
 */
function runServer() {
  const PORT = process.env.PORT || 3005;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Example routes
  server.route('/basic-say', async (context) => {
    return createBasicSay();
  });
  
  server.route('/voice-say', async (context) => {
    return createVoiceSay();
  });
  
  server.route('/early-media-say', async (context) => {
    return createEarlyMediaSay();
  });
  
  server.route('/looping-say', async (context) => {
    return createLoopingSay();
  });
  
  server.route('/callback-say', async (context) => {
    return createCallbackSay();
  });
  
  server.route('/premium-voice-say', async (context) => {
    return createPremiumVoiceSay();
  });
  
  server.route('/ssml-say', async (context) => {
    return createSSMLSay();
  });
  
  server.route('/complex-say', async (context) => {
    return createComplexSay();
  });
  
  // Handle say callbacks
  server.route('/say-status', async (context) => {
    console.log('Say status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  server.route('/say-complete', async (context) => {
    console.log('Say completion notification:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  // Sequential Say examples - multiple Say verbs in one response
  server.route('/sequential-say', async (context) => {
    return new CXMLBuilder()
      .createResponse()
      .addSay("This is the first sentence.", { voice: "Google:en-US-Neural2-F" })
      .addPause(1)
      .addSay("This is the second sentence with a different voice.", { voice: "Google:en-US-Neural2-M" })
      .addPause(1)
      .addSay("And here is the conclusion.", { voice: "Google:en-US-Neural2-F" });
  });
  
  // Conversation examples
  server.route('/conversation', async (context) => {
    return new CXMLBuilder()
      .createResponse()
      .addSay("Hello! I'm the first speaker.", { voice: "Google:en-US-Neural2-F" })
      .addPause(1)
      .addSay("And I'm the second speaker, responding to the first.", { voice: "Google:en-US-Neural2-M" })
      .addPause(1)
      .addSay("It's nice to meet you!", { voice: "Google:en-US-Neural2-F" })
      .addPause(1)
      .addSay("Likewise! This demonstrates a conversation flow.", { voice: "Google:en-US-Neural2-M" });
  });
  
  // Home page with links to all examples
  server.route('/', async (context) => {
    // Return a simple HTML page for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Say Verb Examples</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
            .section { margin-bottom: 30px; }
            .description { color: #666; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>Say Verb Examples</h1>
          <p>Click the links below to see different Say verb examples:</p>
          
          <div class="section">
            <div class="description">Basic text-to-speech with default settings</div>
            <a href="/basic-say">Basic Say</a>
          </div>
          
          <div class="section">
            <div class="description">Say with specific voice and language</div>
            <a href="/voice-say">Say with voice options</a>
          </div>
          
          <div class="section">
            <div class="description">Say that plays without answering the call (early media)</div>
            <a href="/early-media-say">Say with early media</a>
          </div>
          
          <div class="section">
            <div class="description">Say that repeats the message multiple times</div>
            <a href="/looping-say">Say with looping</a>
          </div>
          
          <div class="section">
            <div class="description">Say that sends status updates</div>
            <a href="/callback-say">Say with status callback</a>
          </div>
          
          <div class="section">
            <div class="description">Say using a premium AI voice</div>
            <a href="/premium-voice-say">Say with premium voice</a>
          </div>
          
          <div class="section">
            <div class="description">Say with Speech Synthesis Markup Language for advanced control</div>
            <a href="/ssml-say">Say with SSML content</a>
          </div>
          
          <div class="section">
            <div class="description">Say with multiple options combined</div>
            <a href="/complex-say">Say with multiple options</a>
          </div>
          
          <div class="section">
            <div class="description">Multiple Say verbs in sequence</div>
            <a href="/sequential-say">Sequential Say Example</a>
          </div>
          
          <div class="section">
            <div class="description">Conversation with alternating voices</div>
            <a href="/conversation">Conversation Example</a>
          </div>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Say verb in Cloudonix CXML. In a real telephony application, these would output spoken text using text-to-speech.</p>
          
          <h3>Example Code:</h3>
          <pre>
.addSay('This is a fully configured text-to-speech example.', {
  answer: true,
  voice: 'Google:en-US-Neural2-M',
  language: 'en-US',
  loop: 2,
  statusCallback: '/say-complete',
  statusCallbackMethod: 'POST'
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
      console.log(`Say Examples server running at http://localhost:${PORT}/`);
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