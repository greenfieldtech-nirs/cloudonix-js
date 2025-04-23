/**
 * @file DTMF Gathering Example for Cloudonix JavaScript Library
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a CXML flow that:
 * 1. Says a welcome message
 * 2. Gathers DTMF input from the user
 * 3. Sends the input to an external script
 * 4. Hangs up if no input is received
 * 
 * @returns {CXMLBuilder} - CXML builder with the configured flow
 */
function createDtmfGatheringFlow() {
  return new CXMLBuilder()
    .createResponse()
    // First, say a welcome message
    .addSay('Hello world, welcome to Cloudonix JavaScript library', {
      voice: 'woman',
      language: 'en-US'
    })
    // Then, gather DTMF input
    .addGather({
      action: 'https://example.com/gather.script',  // Send results to this URL
      method: 'POST',                               // Using POST method
      numDigits: 3,                                 // Allow up to 3 digits
      timeout: 10,                                  // Wait 10 seconds for input
      finishOnKey: '#',                             // # key ends input
      actionOnEmptyResult: true                     // Proceed if no input
    }, gatherCxml => {
      // While waiting for input, play this message
      gatherCxml.addSay(
        "Thank you for calling, we're happy you are here. " +
        "Please select a number between 1 to 100 and press it. " +
        "To finish, press the hash key.",
        {
          voice: 'woman',
          language: 'en-US'
        }
      );
    })
    // Finally, hang up if no input is received
    .addHangup();
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // Output the XML
  console.log(createDtmfGatheringFlow().build());
  
  // Run a simple test server if --server flag is provided
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the function for use in other modules
  module.exports = { createDtmfGatheringFlow };
}

/**
 * Runs a CXML server with the DTMF gathering flow
 */
function runServer() {
  const PORT = process.env.PORT || 3000;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Add our DTMF gathering flow as the main route
  server.route('/dtmf', async (context) => {
    return createDtmfGatheringFlow();
  });
  
  // Also add a handler for the gather results
  server.route('/gather.script', async (context) => {
    console.log('Received DTMF input:', context.body);
    
    // Return a simple response with the received digits
    return new CXMLBuilder()
      .createResponse()
      .addSay(`You entered: ${context.body.Digits || 'no digits'}`, {
        voice: 'woman',
        language: 'en-US'
      })
      .addHangup();
  });
  
  // Start the server
  server.start()
    .then(() => {
      console.log(`DTMF Gathering Example server running at http://localhost:${PORT}/`);
      console.log('Try making a request to: http://localhost:${PORT}/dtmf');
    })
    .catch(error => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}