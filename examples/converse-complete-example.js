/**
 * @file Complete example demonstrating the Converse verb with nested elements
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

/**
 * Create a standalone converse example first
 */
const standaloneConverse = new CXMLBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US",
    model: "openai:gpt-4o-mini",
    temperature: 0.7,
    context: "auto",
    sessionTools: "hangup"
  }, cxml => {
    // Add a tool
    cxml.addTool("weatherTool", "https://api.example.com/weather")
      .addDescription("Get current weather information for a location")
      .addParameter("location", {
        description: "City or location to get weather for",
        type: "string",
        required: true
      })
      .addParameter("units", {
        description: "Temperature units",
        type: "enum",
        values: "celsius,fahrenheit",
        required: false
      })
      .done();

    // Add system prompt
    cxml.addSystem("You are a helpful weather assistant. Use the weatherTool to provide weather information.");
    
    // Add user message
    cxml.addUser("What's the weather like in Paris today?");
  })
  .build();

/**
 * Create a converse within gather for an AI voice agent
 */
const gatherWithConverse = new CXMLBuilder()
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
        .addParameter("From", {
          description: "Caller's phone number",
          type: "string",
          required: true
        })
        .addParameter("To", {
          description: "Called phone number",
          type: "string",
          required: true
        })
        .addParameter("Session", {
          description: "Unique session identifier",
          type: "string",
          required: false
        })
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
  })
  .build();

console.log("Standalone Converse Example:");
console.log("===========================\n");
console.log(standaloneConverse);

console.log("\n\nGather with Converse Example:");
console.log("===========================\n");
console.log(gatherWithConverse);