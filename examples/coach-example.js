/**
 * @file Example demonstrating the Coach verb functionality
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a basic coaching scenario with listen-only mode
 * @returns {CXMLBuilder} - CXML builder with the basic coaching flow
 */
function createBasicCoachingFlow() {
  return new CXMLBuilder()
    .createResponse()
    // Initial greeting for the supervisor
    .addSay("Welcome to the coaching session. You will be connected to the ongoing call shortly.", {
      voice: "Google:en-US-Neural2-F",
      language: "en-US"
    })
    .addPause(1)
    
    // Basic Coach connection
    .addCoach("+18005551234", {
      callerId: "+15551234567",
      callerName: "Support Supervisor",
      // Default mode: listen only, can't speak or barge
      listen: true,
      speak: false,
      whisper: false,
      barge: false,
      timeout: 30,
      statusCallback: "/coach-status",
      statusCallbackMethod: "POST",
      statusCallbackEvent: "initiated ringing answered completed"
    });
}

/**
 * Creates an advanced coaching scenario with full capabilities
 * @returns {CXMLBuilder} - CXML builder with the advanced coaching flow
 */
function createAdvancedCoachingFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addSay("Connecting you with full coaching capabilities.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    
    // Advanced Coach with all capabilities
    .addCoach("+18005552345", {
      callerId: "+15551234567",
      callerName: "Senior Supervisor",
      // Advanced mode: can listen, speak to agent, and barge into call
      listen: true,
      speak: true, 
      whisper: true,
      barge: true,
      timeout: 20,
      // Recording options
      record: true,
      recordingStatusCallback: "/recording-status",
      recordingStatusCallbackMethod: "POST",
      recordingStatusCallbackEvent: "in-progress completed"
    });
}

/**
 * Creates a coaching failed scenario
 * @returns {CXMLBuilder} - CXML builder with the coaching failure flow
 */
function createCoachFailureFlow() {
  return new CXMLBuilder()
    .createResponse()
    // Fallback in case coaching fails to connect
    .addSay("We were unable to connect you as a coach to the ongoing call.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addPause(0.5)
    .addSay("Please try again later or contact the call center manager.", {
      voice: "Google:en-US-Neural2-F"
    })
    .addHangup();
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  // Combine all coaching examples in sequence to show all options
  const cxml = new CXMLBuilder()
    .createResponse()
    // Basic coaching
    .addSay("Example 1: Basic Coaching (Listen Only)", {
      voice: "Google:en-US-Neural2-F"
    })
    .addCoach("+18005551234", {
      callerId: "+15551234567",
      callerName: "Support Supervisor",
      listen: true,
      speak: false,
      whisper: false,
      barge: false,
      timeout: 30
    })
    
    // Advanced coaching
    .addSay("Example 2: Advanced Coaching (Full Capabilities)", {
      voice: "Google:en-US-Neural2-F"
    })
    .addCoach("+18005552345", {
      callerId: "+15551234567",
      callerName: "Senior Supervisor",
      listen: true,
      speak: true,
      whisper: true,
      barge: true,
      record: true,
      timeout: 20
    })
    
    .addHangup()
    .build();
    
  console.log(cxml);
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createBasicCoachingFlow,
    createAdvancedCoachingFlow,
    createCoachFailureFlow
  };
}

/**
 * Runs a CXML server with the Coach example
 */
function runServer() {
  const PORT = process.env.PORT || 3002;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Basic coaching route
  server.route('/basic-coaching', async (context) => {
    return createBasicCoachingFlow();
  });
  
  // Advanced coaching route
  server.route('/advanced-coaching', async (context) => {
    return createAdvancedCoachingFlow();
  });
  
  // Coach failure route
  server.route('/coaching-failed', async (context) => {
    return createCoachFailureFlow();
  });
  
  // Handle coach status updates
  server.route('/coach-status', async (context) => {
    console.log('Coach status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    // Simulate a coaching failure sometimes
    if (Math.random() > 0.7) {
      return new CXMLBuilder()
        .createResponse()
        .addRedirect('/coaching-failed');
    }
    
    return new CXMLBuilder().createResponse();
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
  
  // Home page with links to both demos
  server.route('/', async (context) => {
    // Return a simple HTML page instead of CXML since this is for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Coach Verb Examples</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Coach Verb Examples</h1>
          <p>Click the links below to see different Coach verb examples:</p>
          
          <a href="/basic-coaching">Basic Coaching (Listen Only)</a>
          <a href="/advanced-coaching">Advanced Coaching (Full Capabilities)</a>
          <a href="/coaching-failed">Coaching Failed Scenario</a>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Coach verb in Cloudonix CXML. In a real telephony application, these would connect a supervisor to an ongoing call.</p>
          
          <h3>Basic Coaching Example Code:</h3>
          <pre>
.addCoach("+18005551234", {
  callerId: "+15551234567",
  callerName: "Support Supervisor",
  listen: true,
  speak: false,
  whisper: false,
  barge: false,
  timeout: 30
})
          </pre>
          
          <h3>Advanced Coaching Example Code:</h3>
          <pre>
.addCoach("+18005552345", {
  callerId: "+15551234567",
  callerName: "Senior Supervisor",
  listen: true,
  speak: true,
  whisper: true,
  barge: true,
  timeout: 20,
  record: true,
  recordingStatusCallback: "/recording-status",
  recordingStatusCallbackMethod: "POST",
  recordingStatusCallbackEvent: "in-progress completed"
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
      console.log(`Coach Example server running at http://localhost:${PORT}/`);
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