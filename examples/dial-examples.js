/**
 * @file Examples demonstrating the Dial verb and its noun elements
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a simple Dial with a direct number
 * @returns {CXMLBuilder} - CXML builder with a simple dial
 */
function createSimpleDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial('1-805-101010')
    .done();
}

/**
 * Creates a Dial with trunk selection
 * @returns {CXMLBuilder} - CXML builder with a dial using trunk selection
 */
function createTrunkDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial('1-805-101010', { trunks: 'outbound-trunk' })
    .done();
}

/**
 * Creates a Dial with multiple Number nouns
 * @returns {CXMLBuilder} - CXML builder with a dial to multiple numbers
 */
function createMultiNumberDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial({ callerId: '1234567890', timeout: 30 })
    .addNumber('1-805-101010')
    .addNumber('1-805-202020')
    .done();
}

/**
 * Creates a Dial to a SIP endpoint
 * @returns {CXMLBuilder} - CXML builder with a SIP dial
 */
function createSipDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial()
    .addSip('sip:61000@example.com', { 
      username: 'user', 
      password: 'pass', 
      domain: 'destination' 
    })
    .done();
}

/**
 * Creates a Dial to a conference room
 * @returns {CXMLBuilder} - CXML builder with a conference dial
 */
function createConferenceDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial()
    .addConference('Room 5000', { 
      beep: 'onEnter', 
      muted: false, 
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
      maxParticipants: 10
    })
    .done();
}

/**
 * Creates a Dial with a service provider
 * @returns {CXMLBuilder} - CXML builder with a service provider dial
 */
function createServiceDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial()
    .addService('Service_Provider_Phone_Number', {
      provider: 'vapi',
      username: 'my_username',
      password: 'my_password'
    })
    .done();
}

/**
 * Creates a Dial with custom headers
 * @returns {CXMLBuilder} - CXML builder with a dial using custom headers
 */
function createHeadersDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial({ headers: 'FullName=John+Smith&Location=office' })
    .addSip('sip:1234@example.com')
    .addHeader('X-AuthToken', 'abcdef')
    .addHeader('X-SignedCaller', '9012345678')
    .done();
}

/**
 * Creates a Dial with recording
 * @returns {CXMLBuilder} - CXML builder with a recording dial
 */
function createRecordingDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial({
      record: 'record-from-answer',
      recordingStatusCallback: '/recording-callback',
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent: 'completed',
      trim: 'trim-silence'
    })
    .addNumber('1-805-101010')
    .done();
}

/**
 * Creates a Dial with action URL
 * @returns {CXMLBuilder} - CXML builder with a dial having action URL
 */
function createActionDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial({
      action: '/dial-complete',
      method: 'POST',
      hangupOnStar: true,
      timeLimit: 300
    })
    .addNumber('1-805-101010')
    .done();
}

/**
 * Creates a complex Dial with multiple features
 * @returns {CXMLBuilder} - CXML builder with a feature-rich dial
 */
function createComplexDial() {
  return new CXMLBuilder()
    .createResponse()
    .addDial({
      callerId: '1234567890',
      callerName: 'John Smith',
      action: '/dial-complete',
      method: 'POST',
      timeout: 60,
      hangupOn: '#',
      record: 'record-from-ringing',
      recordingStatusCallback: '/recording-status',
      trunks: 'trunk1,trunk2'
    })
    .addNumber('1-805-101010')
    .addHeader('X-Custom-Data', 'some-value')
    .done();
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML for all examples
  console.log("Example 1: Simple Dial with a number");
  console.log(createSimpleDial().build());
  console.log("\n");
  
  console.log("Example 2: Dial with trunk selection");
  console.log(createTrunkDial().build());
  console.log("\n");
  
  console.log("Example 3: Dial with multiple Number nouns");
  console.log(createMultiNumberDial().build());
  console.log("\n");
  
  console.log("Example 4: Dial with SIP");
  console.log(createSipDial().build());
  console.log("\n");
  
  console.log("Example 5: Dial with Conference");
  console.log(createConferenceDial().build());
  console.log("\n");
  
  console.log("Example 6: Dial with Service Provider");
  console.log(createServiceDial().build());
  console.log("\n");
  
  console.log("Example 7: Dial with custom Headers");
  console.log(createHeadersDial().build());
  console.log("\n");
  
  console.log("Example 8: Dial with recording");
  console.log(createRecordingDial().build());
  console.log("\n");
  
  console.log("Example 9: Dial with action URL");
  console.log(createActionDial().build());
  console.log("\n");
  
  console.log("Example 10: Complex Dial with multiple features");
  console.log(createComplexDial().build());
  console.log("\n");
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createSimpleDial,
    createTrunkDial,
    createMultiNumberDial,
    createSipDial,
    createConferenceDial,
    createServiceDial,
    createHeadersDial,
    createRecordingDial,
    createActionDial,
    createComplexDial
  };
}

/**
 * Runs a CXML server with the Dial examples
 */
function runServer() {
  const PORT = process.env.PORT || 3003;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Example routes
  server.route('/simple-dial', async (context) => {
    return createSimpleDial();
  });
  
  server.route('/trunk-dial', async (context) => {
    return createTrunkDial();
  });
  
  server.route('/multi-number-dial', async (context) => {
    return createMultiNumberDial();
  });
  
  server.route('/sip-dial', async (context) => {
    return createSipDial();
  });
  
  server.route('/conference-dial', async (context) => {
    return createConferenceDial();
  });
  
  server.route('/service-dial', async (context) => {
    return createServiceDial();
  });
  
  server.route('/headers-dial', async (context) => {
    return createHeadersDial();
  });
  
  server.route('/recording-dial', async (context) => {
    return createRecordingDial();
  });
  
  server.route('/action-dial', async (context) => {
    return createActionDial();
  });
  
  server.route('/complex-dial', async (context) => {
    return createComplexDial();
  });
  
  // Handle callbacks from dial actions
  server.route('/dial-complete', async (context) => {
    console.log('Dial completed:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder()
      .createResponse()
      .addSay("The dial has completed.", {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle recording callbacks
  server.route('/recording-callback', async (context) => {
    console.log('Recording status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  server.route('/recording-status', async (context) => {
    console.log('Recording status update:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    return new CXMLBuilder().createResponse();
  });
  
  // Home page with links to all examples
  server.route('/', async (context) => {
    // Return a simple HTML page for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dial Verb Examples</title>
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
          <h1>Dial Verb Examples</h1>
          <p>Click the links below to see different Dial verb examples:</p>
          
          <div class="section">
            <div class="description">Basic Dial to a phone number</div>
            <a href="/simple-dial">Simple Dial with a number</a>
          </div>
          
          <div class="section">
            <div class="description">Dial with specific trunk selection</div>
            <a href="/trunk-dial">Dial with trunk selection</a>
          </div>
          
          <div class="section">
            <div class="description">Dial to multiple phone numbers in sequence</div>
            <a href="/multi-number-dial">Dial with multiple Number nouns</a>
          </div>
          
          <div class="section">
            <div class="description">Dial to a SIP endpoint</div>
            <a href="/sip-dial">Dial with SIP</a>
          </div>
          
          <div class="section">
            <div class="description">Dial to a conference room</div>
            <a href="/conference-dial">Dial with Conference</a>
          </div>
          
          <div class="section">
            <div class="description">Dial using a service provider</div>
            <a href="/service-dial">Dial with Service Provider</a>
          </div>
          
          <div class="section">
            <div class="description">Dial with custom SIP headers</div>
            <a href="/headers-dial">Dial with custom Headers</a>
          </div>
          
          <div class="section">
            <div class="description">Dial with call recording</div>
            <a href="/recording-dial">Dial with recording</a>
          </div>
          
          <div class="section">
            <div class="description">Dial with callback URL when complete</div>
            <a href="/action-dial">Dial with action URL</a>
          </div>
          
          <div class="section">
            <div class="description">Complex Dial with multiple features</div>
            <a href="/complex-dial">Complex Dial example</a>
          </div>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Dial verb in Cloudonix CXML. In a real telephony application, these would connect calls to various endpoints.</p>
          
          <h3>Example Code:</h3>
          <pre>
.addDial({
  callerId: '1234567890',
  callerName: 'John Smith',
  action: '/dial-complete',
  method: 'POST',
  timeout: 60,
  hangupOn: '#',
  record: 'record-from-ringing'
})
.addNumber('1-805-101010')
.addHeader('X-Custom-Data', 'some-value')
.done()
          </pre>
        </body>
      </html>
    `;
  });
  
  // Start the server
  async function startServer() {
    try {
      await server.start();
      console.log(`Dial Examples server running at http://localhost:${PORT}/`);
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