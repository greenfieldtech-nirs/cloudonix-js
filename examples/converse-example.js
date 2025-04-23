/**
 * @file Example demonstrating the Converse verb functionality
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder, CXMLServer } = require('../');

/**
 * Creates a basic AI voice agent using Converse
 * @returns {CXMLBuilder} - CXML builder with the AI voice agent flow
 */
function createBasicConverseFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addConverse({
      voice: "Google:en-US-Neural2-F",
      language: "en-US",
      model: "openai:gpt-4o-mini",
      sessionTools: "hangup redirect"
    }, cxml => {
      cxml.addSystem("You are a helpful hotel receptionist, providing a customer with helpful information about the Acme Hotel.");
    });
}

/**
 * Creates an advanced voice agent with Gather, Converse and Tool
 * @returns {CXMLBuilder} - CXML builder with the advanced AI voice agent flow
 */
function createAdvancedConverseFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: "speech",
      speechEngine: "google",
      actionOnEmptyResult: true,
      speechTimeout: 1.5,
      speechDetection: "stt"
    }, gatherCxml => {
      gatherCxml.addConverse({
        voice: "Google:en-US-Neural2-F", 
        language: "en-US",
        model: "anthropic:claude-3-5-haiku-latest",
        sessionTools: "redirect dial",
        statusCallback: "/converse-status",
        statusCallbackMethod: "POST",
        statusCallbackEvent: "in-progress,tool-response,completed"
      }, converseCxml => {
        // Add a tool for contact lookup
        converseCxml.addTool("contactLookUp", "https://example.com/contactLookUp")
          .addDescription("Search/Create a contact in our contact address book")
          .addParameter("From")
          .addParameter("To")
          .addParameter("Session")
          .addParameter("Domain")
          .done();
          
        // Add system prompt
        converseCxml.addSystem(
          "You are a helpful hotel concierge. Use the contactLookUp tool to lookup the caller. " +
          "If the tool reports back a JSON object with contact information, greet the caller that " +
          "you're happy to see them again. If the tool reports an error, greet the user in a formal " +
          "manner and ask them for their name."
        );
        
        // Add speech input - must be last element in Converse
        converseCxml.addSpeech();
      });
    });
}

/**
 * Creates an example showing a full back-and-forth conversation
 * @returns {CXMLBuilder} - CXML builder for a conversation
 */
function createConversationFlow() {
  return new CXMLBuilder()
    .createResponse()
    .addGather({
      input: "speech",
      speechEngine: "google",
      actionOnEmptyResult: true,
      speechTimeout: 1.5,
      speechDetection: "stt"
    }, gatherCxml => {
      gatherCxml.addConverse({
        voice: "Google:en-US-Neural2-F", 
        language: "en-US",
        model: "openai:gpt-4o-mini",
        temperature: 0.7,
        context: "auto" // Enable chat history
      }, converseCxml => {
        // Add system prompt
        converseCxml.addSystem(
          "You are a friendly AI assistant. Keep your responses brief and conversational. " +
          "When the user asks about the weather, explain you don't have access to real-time weather data."
        );
        
        // Simulate previous conversation for example
        converseCxml.addUser("Hi there, can you help me with some information?");
        
        // Add speech input - must be last element
        converseCxml.addSpeech();
      });
    });
}

// Run as standalone script if invoked directly
if (require.main === module) {
  // If running as a script, just output the XML
  console.log('Basic Converse Example:');
  console.log(createBasicConverseFlow().build());
  
  console.log('\nAdvanced Converse Example with Tool:');
  console.log(createAdvancedConverseFlow().build());
  
  console.log('\nConversation Example:');
  console.log(createConversationFlow().build());
  
  // Run the server if the --server flag is passed
  if (process.argv.includes('--server')) {
    runServer();
  }
} else {
  // Export the functions for use in other modules
  module.exports = {
    createBasicConverseFlow,
    createAdvancedConverseFlow,
    createConversationFlow
  };
}

/**
 * Runs a CXML server with the Converse examples
 */
function runServer() {
  const PORT = process.env.PORT || 3001;
  
  // Create a new CXML server
  const server = new CXMLServer({
    port: PORT,
    verbose: true
  });
  
  // Main welcome route - entry point for the basic agent
  server.route('/basic-converse', async (context) => {
    return createBasicConverseFlow();
  });
  
  // Advanced agent route
  server.route('/advanced-converse', async (context) => {
    return createAdvancedConverseFlow();
  });
  
  // Conversation route
  server.route('/conversation', async (context) => {
    return createConversationFlow();
  });
  
  // Handle status callbacks
  server.route('/converse-status', async (context) => {
    console.log('Converse status update:');
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
          <title>Converse Verb Examples</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            a { display: block; margin: 10px 0; padding: 10px; background: #f4f4f4; text-decoration: none; color: #333; border-radius: 4px; }
            a:hover { background: #e0e0e0; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Converse Verb Examples</h1>
          <p>Click the links below to see different Converse verb examples:</p>
          
          <a href="/basic-converse">Basic Converse Example</a>
          <a href="/advanced-converse">Advanced Converse with Tool Example</a>
          <a href="/conversation">Conversation Example</a>
          
          <h2>How It Works</h2>
          <p>These examples demonstrate how to use the Converse verb in Cloudonix CXML. The Converse verb allows interactions with LLMs for creating AI voice agents.</p>
          
          <h3>Basic Example Code:</h3>
          <pre>
.addConverse({
  voice: "Google:en-US-Neural2-F",
  language: "en-US",
  model: "openai:gpt-4o-mini",
  sessionTools: "hangup redirect"
}, cxml => {
  cxml.addSystem("You are a helpful hotel receptionist, providing a customer with helpful information about the Acme Hotel.");
})
          </pre>
          
          <h3>Advanced Example Code:</h3>
          <pre>
.addGather({
  input: "speech",
  speechEngine: "google",
  actionOnEmptyResult: true,
  speechTimeout: 1.5,
  speechDetection: "stt"
}, gatherCxml => {
  gatherCxml.addConverse({
    voice: "Google:en-US-Neural2-F", 
    language: "en-US",
    model: "anthropic:claude-3-5-haiku-latest",
    sessionTools: "redirect dial"
  }, converseCxml => {
    // Add a tool
    converseCxml.addTool("contactLookUp", "https://example.com/contactLookUp")
      .addDescription("Search/Create a contact in our contact address book")
      .addParameter("From")
      .addParameter("To")
      .done();
      
    // Add system prompt
    converseCxml.addSystem("You are a helpful hotel concierge...");
    
    // Add speech input
    converseCxml.addSpeech();
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
      console.log(`Converse Example server running at http://localhost:${PORT}/`);
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