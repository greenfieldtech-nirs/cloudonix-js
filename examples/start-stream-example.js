/**
 * @file Example demonstrating the Start verb with Stream functionality
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a basic media streaming flow
 * @returns {CXMLBuilder} - CXML builder with the streaming flow
 */
function createBasicStreamingFlow() {
  return new CXMLBuilder()
    .createResponse()
    // Welcome message
    .addSay("Starting media stream.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    
    // Basic streaming with bidirectional audio
    .addStart(cxml => {
      cxml.addStream({
        url: "wss://example.com/media-stream",
        track: "both_tracks"
      });
    });
}

/**
 * Creates an advanced streaming flow with multiple options
 * @returns {CXMLBuilder} - CXML builder with the advanced streaming flow
 */
function createAdvancedStreamingFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addSay("Starting advanced media stream with status callbacks.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    
    // Advanced streaming with full options
    .addStart(cxml => {
      cxml.addStream({
        name: "call-stream",
        url: "wss://example.com/advanced-media-stream",
        track: "both_tracks",
        statusCallback: "/stream-media-status",
        statusCallbackMethod: "POST"
      });
    })
    .addPause(10)
    .addSay("The media stream is now active.");
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  console.log('Basic Media Streaming:');
  console.log(createBasicStreamingFlow().build());
  
  console.log('\nAdvanced Media Streaming:');
  console.log(createAdvancedStreamingFlow().build());
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createBasicStreamingFlow,
    createAdvancedStreamingFlow
  };
}

/**
 * Runs a CXML server with the Start/Stream examples
 */
function runServer() {
  const PORT = process.env.PORT || 3001;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Main welcome route - entry point for the basic streaming
  server.route('/basic-streaming', async (context) => {
    return createBasicStreamingFlow();
  });
  
  // Advanced streaming route
  server.route('/advanced-streaming', async (context) => {
    return createAdvancedStreamingFlow();
  });
  
  // Handle status callbacks
  server.route('/stream-media-status', async (context) => {
    console.log('Stream media status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  // Home page with links to both demos
  server.route('/', async (context) => {
    // Return a simple HTML page instead of CXML since this is for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Start/Stream Verb Examples</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Start/Stream Verb Examples</h1>
          <p>Click the links below to see different Start/Stream examples:</p>
          
          <a href="/basic-streaming">Basic Media Streaming Example</a>
          <a href="/advanced-streaming">Advanced Media Streaming Example</a>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Start verb with the Stream noun in Cloudonix CXML. In a real telephony application, these would establish media streams for audio processing.</p>
          
          <h3>Basic Example Code:</h3>
          <pre>
.addStart(cxml => {
  cxml.addStream({
    url: "wss://example.com/media-stream",
    track: "both_tracks"
  });
})
          </pre>
          
          <h3>Advanced Example Code:</h3>
          <pre>
.addStart(cxml => {
  cxml.addStream({
    name: "call-stream",
    url: "wss://example.com/advanced-media-stream",
    track: "both_tracks",
    statusCallback: "/stream-media-status",
    statusCallbackMethod: "POST"
  });
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
      console.log(`Start/Stream Example server running at http://localhost:${PORT}/`);
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