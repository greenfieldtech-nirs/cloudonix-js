/**
 * @file Examples demonstrating the Gather verb functionality
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a simple Gather with DTMF input
 * @returns {CXMLBuilder} - CXML builder with a simple gather
 */
function createSimpleGather() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      numDigits: 1,
      timeout: 5,
      action: "/handle-gather"
    })
    .done();
}

/**
 * Creates a Gather with Say nested element
 * @returns {CXMLBuilder} - CXML builder with a gather containing say elements
 */
function createGatherWithSay() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: 'dtmf',
      timeout: 3,
      numDigits: 1,
      action: '/handle-gather',
      method: 'POST'
    })
    .addSay('Please enter a digit', { voice: 'Google:en-US-Neural2-F', language: 'en-US' })
    .done();
}

/**
 * Creates a Gather with speech recognition
 * @returns {CXMLBuilder} - CXML builder with a speech recognition gather
 */
function createSpeechGather() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: 'speech',
      speechTimeout: 5,
      speechEngine: 'google',
      language: 'en-US',
      actionOnEmptyResult: true,
      action: '/handle-speech'
    })
    .addSay('Please tell us why you are calling', { voice: 'Google:en-US-Neural2-F' })
    .done();
}

/**
 * Creates a Gather with both DTMF and speech
 * @returns {CXMLBuilder} - CXML builder with a dual-mode gather
 */
function createDualModeGather() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: 'dtmf speech',
      timeout: 3,
      speechTimeout: 5,
      language: 'en-US',
      action: '/handle-dual-input',
      maxTimeout: 10,
      maxDuration: 60
    })
    .addPlay('http://example.com/welcome-message.mp3')
    .done();
}

/**
 * Creates a Gather with multiple nested elements
 * @returns {CXMLBuilder} - CXML builder with a gather containing multiple elements
 */
function createMultiElementGather() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: 'dtmf speech',
      timeout: 5,
      speechDetection: 'normal',
      interruptible: false,
      action: '/handle-gather'
    })
    .addSay('Welcome to our phone system', { voice: 'Google:en-US-Neural2-F' })
    .addPause(1)
    .addSay('Please enter your account number or say it aloud', { voice: 'Google:en-US-Neural2-F' })
    .addPlay('http://example.com/beep.mp3')
    .done();
}

/**
 * Creates a complex Gather with all options
 * @returns {CXMLBuilder} - CXML builder with a feature-rich gather
 */
function createComplexGather() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      action: '/process-input',
      method: 'POST',
      input: 'dtmf speech',
      finishOnKey: '#',
      numDigits: 6,
      maxTimeout: 15,
      timeout: 5,
      speechTimeout: 'auto',
      speechEngine: 'google',
      language: 'en-US',
      actionOnEmptyResult: true,
      maxDuration: 120,
      speechDetection: 'high',
      interruptible: true,
      hints: 'one,two,three,four,five,six,seven,eight,nine,zero'
    })
    .addSay('Please provide your 6-digit verification code', { voice: 'Google:en-US-Neural2-F' })
    .addPause(1)
    .addSay('Press pound when finished or simply say the code', { voice: 'Google:en-US-Neural2-F' })
    .done();
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML for all examples
  console.log("Example 1: Simple Gather with DTMF");
  console.log(createSimpleGather().build());
  console.log("\n");
  
  console.log("Example 2: Gather with Say nested element");
  console.log(createGatherWithSay().build());
  console.log("\n");
  
  console.log("Example 3: Gather with speech recognition");
  console.log(createSpeechGather().build());
  console.log("\n");
  
  console.log("Example 4: Gather with both DTMF and speech");
  console.log(createDualModeGather().build());
  console.log("\n");
  
  console.log("Example 5: Gather with multiple nested elements");
  console.log(createMultiElementGather().build());
  console.log("\n");
  
  console.log("Example 6: Complex Gather with all options");
  console.log(createComplexGather().build());
  console.log("\n");
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createSimpleGather,
    createGatherWithSay,
    createSpeechGather,
    createDualModeGather,
    createMultiElementGather,
    createComplexGather
  };
}

/**
 * Runs a CXML server with the Gather examples
 */
function runServer() {
  const PORT = process.env.PORT || 3004;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Example routes
  server.route('/simple-gather', async (context) => {
    return createSimpleGather();
  });
  
  server.route('/gather-with-say', async (context) => {
    return createGatherWithSay();
  });
  
  server.route('/speech-gather', async (context) => {
    return createSpeechGather();
  });
  
  server.route('/dual-mode-gather', async (context) => {
    return createDualModeGather();
  });
  
  server.route('/multi-element-gather', async (context) => {
    return createMultiElementGather();
  });
  
  server.route('/complex-gather', async (context) => {
    return createComplexGather();
  });
  
  // Handle gather inputs
  server.route('/handle-gather', async (context) => {
    console.log('Gather input received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
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
    
    // Respond based on the gathered input
    return new CXMLBuilder()
      .createResponse()
      .addSay(`You entered ${digits || 'no digits'}. Thank you for your input.`, {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle speech inputs
  server.route('/handle-speech', async (context) => {
    console.log('Speech input received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    let speechResult = 'no speech detected';
    
    // Extract speech from the request body
    if (typeof context.body === 'object') {
      if (context.body.SpeechResult) {
        speechResult = context.body.SpeechResult;
      } else if (context.body.speech_result) {
        speechResult = context.body.speech_result;
      }
    }
    
    // Respond with the recognized speech
    return new CXMLBuilder()
      .createResponse()
      .addSay(`You said: ${speechResult}. Thank you for your input.`, {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle dual mode inputs
  server.route('/handle-dual-input', async (context) => {
    console.log('Dual mode input received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    let inputType = 'unknown';
    let inputValue = 'nothing';
    
    // Determine the type of input and extract the value
    if (typeof context.body === 'object') {
      if (context.body.Digits) {
        inputType = 'DTMF';
        inputValue = context.body.Digits;
      } else if (context.body.SpeechResult || context.body.speech_result) {
        inputType = 'speech';
        inputValue = context.body.SpeechResult || context.body.speech_result;
      }
    }
    
    // Respond based on the input type
    return new CXMLBuilder()
      .createResponse()
      .addSay(`You provided input via ${inputType}. The value was: ${inputValue}.`, {
        voice: "Google:en-US-Neural2-F"
      })
      .addHangup();
  });
  
  // Handle complex gather processing
  server.route('/process-input', async (context) => {
    console.log('Complex gather input received:');
    if (context.body && typeof context.body === 'object') {
      console.log(JSON.stringify(context.body, null, 2));
    } else {
      console.log(context.body);
    }
    
    let verificationCode = '';
    
    // Extract the verification code
    if (typeof context.body === 'object') {
      if (context.body.Digits) {
        verificationCode = context.body.Digits;
      } else if (context.body.SpeechResult || context.body.speech_result) {
        // For speech, try to normalize the result to digits
        const speech = context.body.SpeechResult || context.body.speech_result || '';
        verificationCode = speech.replace(/[^0-9]/g, '');
      }
    }
    
    // Check if we got a 6-digit code
    const isValidCode = /^\d{6}$/.test(verificationCode);
    
    if (isValidCode) {
      return new CXMLBuilder()
        .createResponse()
        .addSay(`Verification code ${verificationCode} accepted. Your account is verified.`, {
          voice: "Google:en-US-Neural2-F"
        })
        .addHangup();
    } else {
      return new CXMLBuilder()
        .createResponse()
        .addSay("Invalid verification code. Please try again.", {
          voice: "Google:en-US-Neural2-F"
        })
        .addRedirect('/complex-gather');
    }
  });
  
  // Home page with links to all examples
  server.route('/', async (context) => {
    // Return a simple HTML page for browser navigation
    context.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gather Verb Examples</title>
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
          <h1>Gather Verb Examples</h1>
          <p>Click the links below to see different Gather verb examples:</p>
          
          <div class="section">
            <div class="description">Basic Gather waiting for DTMF input</div>
            <a href="/simple-gather">Simple Gather with DTMF</a>
          </div>
          
          <div class="section">
            <div class="description">Gather with voice prompt</div>
            <a href="/gather-with-say">Gather with Say nested element</a>
          </div>
          
          <div class="section">
            <div class="description">Gather using speech recognition</div>
            <a href="/speech-gather">Gather with speech recognition</a>
          </div>
          
          <div class="section">
            <div class="description">Gather accepting both DTMF and speech input</div>
            <a href="/dual-mode-gather">Gather with both DTMF and speech</a>
          </div>
          
          <div class="section">
            <div class="description">Gather with multiple nested voice elements</div>
            <a href="/multi-element-gather">Gather with multiple nested elements</a>
          </div>
          
          <div class="section">
            <div class="description">Complex Gather with all available options</div>
            <a href="/complex-gather">Complex Gather with all options</a>
          </div>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Gather verb in Cloudonix CXML. In a real telephony application, these would collect user input via keypresses or speech.</p>
          
          <h3>Example Code:</h3>
          <pre>
.addGather({
  action: '/process-input',
  method: 'POST',
  input: 'dtmf speech',
  finishOnKey: '#',
  numDigits: 6,
  timeout: 5,
  speechTimeout: 'auto',
  speechEngine: 'google',
  language: 'en-US'
})
.addSay('Please provide your verification code')
.addSay('Press pound when finished or say the code')
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
      console.log(`Gather Examples server running at http://localhost:${PORT}/`);
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