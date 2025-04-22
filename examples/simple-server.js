/**
 * @file Example demonstrating CXMLServer usage
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * This example demonstrates how to use the CXMLServer to create
 * a simple voice application that:
 * 1. Greets the caller
 * 2. Collects a digit
 * 3. Responds based on the digit pressed
 */

// Create a new CXML server
const server = new CXMLServer({
  port: process.env.PORT || 3000
});

// Handle the initial call
server.route('/welcome', async (context) => {
  const builder = new CXMLBuilder();
  
  return builder
    .createResponse()
    .addSay('Welcome to the Cloudonix Voice Application example!', {
      voice: 'woman',
      language: 'en-US'
    })
    .addSay('Please press 1 for a greeting, or 2 to hear about Cloudonix.')
    .addGather({
      numDigits: 1,
      action: '/handle-choice',
      timeout: 10
    });
});

// Handle the digit input
server.route('/handle-choice', async (context) => {
  let body = context.body;
  let digits = '';
  
  // Try to extract digits from the request body
  if (typeof body === 'string') {
    try {
      const parsedBody = JSON.parse(body);
      digits = parsedBody.Digits || '';
    } catch (e) {
      // If it's not valid JSON, check if it has a Digits parameter
      const match = body.match(/Digits=(\d+)/);
      if (match) {
        digits = match[1];
      }
    }
  } else if (body && body.Digits) {
    digits = body.Digits;
  }
  
  console.log(`Received digits: ${digits}`);
  
  const builder = new CXMLBuilder();
  
  switch (digits) {
    case '1':
      return builder
        .createResponse()
        .addSay('Hello there! Thank you for trying our example.')
        .addSay('Goodbye!')
        .addHangup();
        
    case '2':
      return builder
        .createResponse()
        .addSay('Cloudonix provides APIs for voice applications.')
        .addSay('This example demonstrates how to use the Cloudonix CXML library.')
        .addSay('Goodbye!')
        .addHangup();
        
    default:
      return builder
        .createResponse()
        .addSay('Sorry, I did not understand your choice.')
        .addRedirect('/welcome');
  }
});

// Start the server
async function main() {
  try {
    await server.start();
    console.log(`CXML server started on port ${server.port}`);
    console.log('Try accessing http://localhost:' + server.port + '/welcome in your browser or API client.');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();