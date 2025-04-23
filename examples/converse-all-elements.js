/**
 * @file Example showing all possible Converse elements
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const { CXMLBuilder } = require('../');

// Create an example with all possible Converse elements
const allElements = new CXMLBuilder()
  .createResponse()
  .addConverse({
    voice: "Google:en-US-Neural2-F",
    language: "en-US",
    model: "openai:gpt-4o-mini",
    temperature: 0.7,
    context: "auto",
    sessionTools: "redirect dial hangup",
    statusCallback: "/converse-status",
    statusCallbackMethod: "POST",
    statusCallbackEvent: "in-progress,tool-response,completed"
  }, cxml => {
    // Add a tool with all possible parameter types
    cxml.addTool("exampleTool", "https://api.example.com/tool")
      .addDescription("Example tool with all parameter types")
      .addParameter("stringParam", { 
        description: "String parameter example",
        type: "string", 
        required: true 
      })
      .addParameter("integerParam", { 
        description: "Integer parameter example",
        type: "integer", 
        required: true 
      })
      .addParameter("numberParam", { 
        description: "Number parameter example",
        type: "number", 
        required: false 
      })
      .addParameter("booleanParam", { 
        description: "Boolean parameter example",
        type: "boolean", 
        required: false 
      })
      .addParameter("enumParam", { 
        description: "Enum parameter example",
        type: "enum", 
        values: "option1,option2,option3",
        required: false 
      })
      .done();
    
    // Add a second tool
    cxml.addTool("simpleTool", "https://api.example.com/simple")
      .addDescription("A simpler tool example")
      .addParameter("param1", { 
        description: "First parameter" 
      })
      .addParameter("param2", { 
        description: "Second parameter" 
      })
      .done();
    
    // Add system prompt (<s>)
    cxml.addSystem("You are a helpful assistant designed to test all CXML elements.");
    
    // Add user message (<User>)
    cxml.addUser("Hello, this is a user message to test the User element.");
    
    // Add speech element (<Speech/>)
    cxml.addSpeech();
  })
  .build();

console.log(allElements);