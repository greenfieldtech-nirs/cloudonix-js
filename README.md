# cloudonix-js
A JavaScript library for building and serving Cloudonix Voice Application XML (CXML) documents.

```
## Vibe-Code Disclaimer ##

This library was creatd using claude-code and the documentation available 
at https://developers.cloudonix.com

While the library is tested to produce working results, it is up to you 
to make sure that it works for you, as I may no guarentees as to the quality
of this source code - I didn't write it! 
```

## Installation

```bash
npm install cloudonix-js
```

## Features

- Build CXML documents using a fluent API with proper indentation
- Serve CXML documents via HTTP
- Support for all CXML verbs (Response, Play, Say, Gather, Redirect, Hangup, Dial, Pause, Reject, Record, Coach, Start, Converse)
- Support for Dial nouns (Number, Sip, Conference, Service, Header)
- Support for Start noun (Stream)
- Support for Converse nouns (Tool, System, User, Speech, Description)
- Nested elements with proper ordering and inheritance
- Well-formatted XML output with correct indentation
- Consistent handling of nested elements with the `cxml` attribute

## Usage

### Building CXML Documents

```javascript
const { CXMLBuilder } = require('cloudonix-js');

// Create a new CXML builder
const builder = new CXMLBuilder();

// Build a document that plays an audio file
const playXml = builder
  .createResponse()
  .addPlay('https://example.com/audio.mp3')
  .build();

console.log(playXml);
// Output: 
// <?xml version="1.0" encoding="UTF-8"?>
// <Response>
//   <Play>https://example.com/audio.mp3</Play>
// </Response>

// Build a document that says text using text-to-speech
const sayXml = new CXMLBuilder()
  .createResponse()
  .addSay('Hello, welcome to Cloudonix!', {
    voice: 'Google:en-US-Neural2-F',
    language: 'en-US'
  })
  .build();

console.log(sayXml);

// Build a document with nested elements using callback pattern
const complexXml = new CXMLBuilder()
  .createResponse()
  .addSay('Welcome to our service')
  // Use the callback pattern for nesting
  .addGather({
    input: 'dtmf speech',
    timeout: 5,
    numDigits: 1
  }, cxml => {
    cxml.addSay('Please press 1 for sales')
        .addSay('Please press 2 for support')
        .addPlay('https://example.com/beep.wav');
  })
  .addDial({
    timeout: 30,
    callerId: '+15551234567'
  }, cxml => {
    // Headers are always added first
    cxml.addHeader('X-Department', 'sales')
        .addNumber('+18005551212');
  })
  .addHangup()
  .build();

console.log(complexXml);
```

### Recording and Coaching Example

```javascript
const { CXMLBuilder } = require('cloudonix-js');

// Create a document with Record and Coach verbs
const advancedXml = new CXMLBuilder()
  .createResponse()
  .addSay('Please leave a message after the tone.', {
    voice: 'Google:en-US-Neural2-F'
  })
  // Record a message
  .addRecord({
    action: 'https://example.com/handle-recording',
    method: 'POST',
    maxLength: 60,
    playBeep: true,
    finishOnKey: '#',
    transcribe: true,
    transcribeCallback: 'https://example.com/transcription'
  })
  .addSay('Thank you for your message.')
  // Add a coaching session
  .addCoach('+18005551234', {
    callerId: '+15551234567',
    callerName: 'Supervisor',
    listen: true,  // Can listen to the call
    speak: false,  // Cannot speak to the customer
    whisper: true, // Can whisper to the agent
    timeout: 30
  })
  .build();

console.log(advancedXml);
```

### Serving CXML Documents

> **⚠️ IMPORTANT:** The CXMLServer is provided for development and testing purposes only. 
> It is NOT recommended for production use. For production environments, please use a 
> robust server framework like Express.js with proper security, logging, and error handling.

```javascript
const { CXMLBuilder, CXMLServer } = require('cloudonix-js');

// Create a new CXML server
const server = new CXMLServer({
  port: 3000,
  verbose: true  // Enable logging
});

// Add a route to handle incoming calls
server.route('/incoming-call', async (context) => {
  const builder = new CXMLBuilder();
  return builder
    .createResponse()
    .addSay('Hello, welcome to our voice application!')
    .addGather({
      numDigits: 1,
      action: '/handle-input',
      timeout: 5
    })
    .addSay('Please press a number from 1 to 9.')
    .done();
});

// Add a route to handle user input
server.route('/handle-input', async (context) => {
  const digits = context.body.Digits || '';
  const builder = new CXMLBuilder();
  
  if (digits === '1') {
    return builder
      .createResponse()
      .addSay('You pressed one. We will connect you to an agent.')
      .addDial('+18005551212', {
        timeout: 30,
        callerId: '+15551234567'
      });
  } else if (digits === '2') {
    return builder
      .createResponse()
      .addSay('You pressed two. Please leave a message after the tone.')
      .addRecord({
        action: '/handle-recording',
        maxLength: 60,
        playBeep: true
      });
  } else {
    return builder
      .createResponse()
      .addSay('Invalid input. Please try again.')
      .addRedirect('/incoming-call');
  }
});

// Start the server
async function main() {
  try {
    await server.start();
    console.log('Server started successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();
```

## API Reference

### CXMLBuilder

#### `new CXMLBuilder()`

Creates a new CXML builder instance.

#### `createResponse()`

Creates a new Response element. This is the root element of a CXML document.

#### `addPlay(url, options)`

Adds a Play element to play an audio file.

Parameters:
- `url`: The URL of the audio file to play
- `options`: Optional parameters for the Play element
  - `answer`: Whether to answer the call before playing (true/false)
  - `digits`: DTMF digits to play instead of an audio file
  - `loop`: Number of times to repeat the audio
  - `statusCallback`: URL to notify about play status
  - `statusCallbackMethod`: HTTP method for status callbacks (GET/POST)

#### `addSay(text, options)`

Adds a Say element for text-to-speech.

Parameters:
- `text`: The text to be spoken
- `options`: Optional parameters for the Say element
  - `answer`: Whether to answer the call before speaking (true/false)
  - `voice`: The voice to use (e.g., 'Google:en-US-Neural2-F')
  - `language`: The language code (e.g., 'en-US')
  - `loop`: Number of times to repeat the text
  - `statusCallback`: URL to notify about say status
  - `statusCallbackMethod`: HTTP method for status callbacks (GET/POST)

#### `addGather(options, cxml)`

Adds a Gather element to collect input from the caller.

Parameters:
- `options`: Configuration for the Gather element
  - `numDigits`: Number of digits to collect
  - `finishOnKey`: Key that ends input collection
  - `timeout`: Timeout in seconds
  - `action`: URL to send the collected digits to
  - `method`: HTTP method to use (GET/POST)
  - `input`: Input type (dtmf, speech, dtmf speech)
  - `speechTimeout`: Timeout for speech input
  - `speechEngine`: Speech recognition engine to use
  - `language`: Language code for speech recognition
  - `actionOnEmptyResult`: Whether to send requests on empty results
  - `maxDuration`: Maximum duration in seconds
  - `speechDetection`: Speech detection settings
  - `interruptible`: Whether gathering can be interrupted
- `cxml`: Optional callback function for defining nested elements

If using the callback function approach, the `cxml` object provides:
- `addSay(text, options)`: Add a Say element inside the Gather
- `addPlay(url, options)`: Add a Play element inside the Gather
- `addPause(length, options)`: Add a Pause element inside the Gather

Example using the callback pattern:
```javascript
.addGather({
  input: 'dtmf',
  timeout: 5
}, cxml => {
  cxml.addSay('Please press a key', { voice: 'woman' })
      .addPlay('https://example.com/beep.wav')
      .addPause(1);
})
```

#### `addDial(options, cxml)` or `addDial(phoneNumber, cxml)`

Adds a Dial element to make an outbound call.

Parameters:
- `options`: Configuration for the Dial element
  - `action`: URL to send the call result to
  - `callerId`: Caller ID to use
  - `callerName`: Caller name to use
  - `forwardHeaders`: Whether to forward headers
  - `headers`: Headers to include
  - `hangupOnStar`: Whether * hangs up the call
  - `hangupOn`: Which digits hang up the call
  - `method`: HTTP method to use (GET/POST)
  - `record`: Whether to record the call
  - `recordingStatusCallback`: URL to send recording status to
  - `recordingStatusCallbackMethod`: Method for recording status callbacks
  - `recordingStatusCallbackEvent`: Events for recording status callbacks
  - `timeLimit`: Maximum call duration in seconds
  - `timeout`: How long to wait for an answer
  - `trim`: How to trim recordings
  - `trunks`: Number of trunks to use
- `cxml`: Optional callback function for defining nested elements

If `phoneNumber` is provided instead of `options`, it will be used as the number to dial.

If using the callback function approach, the `cxml` object provides:
- `addHeader(name, value)`: Add a Header element (should be called first)
- `addNumber(number, options)`: Add a Number element (mutually exclusive)
- `addSip(sipUri, options)`: Add a SIP endpoint (mutually exclusive)
- `addConference(name, options)`: Add a conference (mutually exclusive)
- `addService(serviceNumber, options)`: Add a service (mutually exclusive)

Note: With the exception of Header, the other nouns (Number, Sip, Conference, Service) are mutually exclusive - you can only use one per Dial element.

Example using the callback pattern:
```javascript
.addDial({
  callerId: '+15551234567',
  timeout: 30
}, cxml => {
  cxml.addHeader('X-Custom-Header', 'CustomValue')
      .addNumber('+15559876543');
})
```

#### `addRedirect(url, method)`

Adds a Redirect element to redirect to another URL.

Parameters:
- `url`: The URL to redirect to
- `method`: HTTP method to use (GET/POST, defaults to POST)

#### `addHangup()`

Adds a Hangup element to end the call.

#### `addPause(length, options)`

Adds a Pause element to pause execution.

Parameters:
- `length`: The length of the pause in seconds (default: 1)
- `options`: Optional parameters for the Pause element
  - `answer`: Whether to answer the call before pausing (true/false)

#### `addReject(options)`

Adds a Reject element to reject an incoming call.

Parameters:
- `options`: Optional parameters for the Reject element
  - `reason`: Reason for rejection (busy, rejected)

#### `addRecord(options, cxml)`

Adds a Record element to record audio from the caller.

Parameters:
- `options`: Configuration for the Record element
  - `answer`: Whether to answer the call before recording
  - `action`: URL to which the recording information will be sent
  - `method`: HTTP method to use (GET/POST)
  - `timeout`: Maximum length of silence in seconds before ending
  - `maxLength`: Maximum length of the recording in seconds
  - `maxSilence`: Maximum silence length in seconds
  - `finishOnKey`: Key that ends recording
  - `playBeep`: Whether to play a beep before recording starts
  - `transcribe`: Whether to transcribe the recording
  - `transcribeCallback`: URL to which the transcription will be sent
  - `transcribeEngine`: Transcription engine to use
  - `recordingStatusCallback`: URL for recording status events
  - `recordingStatusCallbackMethod`: HTTP method for status callback
  - `recordingStatusCallbackEvent`: Events to trigger callbacks
  - `trim`: How to trim silence (trim, trim-silence, do-not-trim)
  - `fileFormat`: Format of the recording (mp3, wav)
- `cxml`: Optional callback function for defining nested elements

If using the callback function approach, the `cxml` object provides:
- `addSay(text, options)`: Add a Say element inside the Record
- `addPlay(url, options)`: Add a Play element inside the Record
- `addPause(length, options)`: Add a Pause element inside the Record

Example using the callback pattern:
```javascript
.addRecord({
  action: '/handle-recording',
  method: 'POST',
  maxLength: 60,
  playBeep: false  // We'll play our own beep sound
}, cxml => {
  cxml.addSay('Please leave a message after the tone.')
      .addPause(1)
      .addPlay('https://example.com/sounds/beep.wav');
})
```

#### `addCoach(phoneNumber, options)`

Adds a Coach element to allow a supervisor to monitor and potentially join a call.

Parameters:
- `phoneNumber`: Phone number to connect for coaching
- `options`: Configuration for the Coach element
  - `callerId`: Caller ID to use when dialing out to the coach
  - `callerName`: Name to use for caller ID
  - `listen`: Whether the coach can listen to the call (true/false)
  - `speak`: Whether the coach can speak to the agent (true/false)
  - `whisper`: Whether the coach can whisper to the agent (true/false)
  - `barge`: Whether the coach can barge into the call (true/false)
  - `timeout`: Timeout in seconds for the coach to answer
  - `statusCallback`: URL for status callbacks
  - `statusCallbackMethod`: HTTP method for status callback (GET/POST)
  - `statusCallbackEvent`: Events to trigger callbacks
  - `record`: Whether to record the coaching session
  - `recordingStatusCallback`: URL for recording status callbacks
  - `recordingStatusCallbackMethod`: HTTP method for recording status callback
  - `recordingStatusCallbackEvent`: Events to trigger recording callbacks

#### `addStart(cxml)`

Adds a Start element to initiate an asynchronous operation like media streaming.

Parameters:
- `cxml`: Callback function for defining nested elements

If using the callback function approach, the `cxml` object provides:
- `addStream(options)`: Add a Stream element inside the Start

The `addStream` method accepts these parameters:
- `options`: Configuration options for the Stream
  - `url`: WebSocket URL (required)
  - `name`: Unique name for the stream (for stopping it later)
  - `track`: Which track to stream ('inbound_track', 'outbound_track', 'both_tracks')
  - `statusCallback`: URL for stream status callbacks
  - `statusCallbackMethod`: HTTP method for status callbacks (GET/POST)

Example using the callback pattern:
```javascript
.addStart(cxml => {
  cxml.addStream({
    url: "wss://example.com/media-stream",
    name: "my-stream",
    track: "both_tracks"
  });
})
```

#### `addConverse(options, cxml)`

Adds a Converse element to create an AI voice agent using LLM, TTS, and STT.

Parameters:
- `options`: Configuration for the Converse element
  - `voice`: TTS voice to use (e.g., 'Google:en-US-Neural2-F')
  - `language`: Language code (e.g., 'en-US')
  - `statusCallback`: URL for status updates
  - `statusCallbackMethod`: HTTP method for callbacks (GET/POST)
  - `statusCallbackEvent`: Events to trigger callbacks ('in-progress', 'tool-response', 'llm-response', 'completed')
  - `sessionTools`: Built-in tools to enable ('hangup', 'redirect', 'dial')
  - `model`: LLM model to use (e.g., 'openai:gpt-4o-mini', 'anthropic:claude-3-5-haiku-latest')
  - `context`: Context handling ('auto', 'none', 'no')
  - `temperature`: Sampling temperature for LLM (0-1)
- `cxml`: Callback function for defining nested elements

If using the callback function approach, the `cxml` object provides:
- `addTool(name, url, options)`: Add a Tool element to the Converse
  - Returns a tool builder with:
    - `addParameter(name, options)`: Add a Parameter to the Tool
    - `addDescription(text)`: Add a Description to the Tool
    - `done()`: Return to the main Converse builder
- `addSystem(text)`: Add a System prompt element
- `addUser(text)`: Add a User prompt element
- `addSpeech()`: Add a Speech element (must be last element when used in Gather)

Example using the callback pattern:
```javascript
.addConverse({
  voice: "Google:en-US-Neural2-F", 
  language: "en-US",
  model: "openai:gpt-4o-mini"
}, cxml => {
  // Add a tool
  cxml.addTool("contactLookUp", "https://example.com/contactLookUp")
    .addDescription("Search a contact in our database")
    .addParameter("From")
    .addParameter("To")
    .done();
    
  // Add system prompt
  cxml.addSystem("You are a helpful AI assistant.");
  
  // Add a user message
  cxml.addUser("Hello, can you help me?");
  
  // Add speech input from caller (when used with Gather)
  cxml.addSpeech();
})
```

Example with Gather:
```javascript
.addGather({
  input: "speech",
  speechEngine: "google",
  speechTimeout: 1.5,
  speechDetection: "stt"
}, gatherCxml => {
  gatherCxml.addConverse({
    voice: "Google:en-US-Neural2-F", 
    language: "en-US"
  }, converseCxml => {
    converseCxml.addSystem("You are a helpful voice agent.");
    converseCxml.addSpeech();
  });
})
```

#### `build()`

Builds and returns the CXML document as a string.

### CXMLServer

> **⚠️ WARNING:** The CXMLServer is intended for development and testing purposes only. 
> It lacks proper security features and performance optimizations necessary for production environments.
> For production use, consider integrating with a framework like Express.js.

#### `new CXMLServer(options)`

Creates a new CXML server.

Parameters:
- `options`: Configuration for the server
  - `port`: The port to listen on (default: 3000)
  - `verbose`: Whether to log detailed information (default: false)

#### `route(path, handler)`

Registers a route handler for the specified path.

Parameters:
- `path`: The URL path to handle
- `handler`: Async function that receives a context object and returns a CXML builder or string

The handler receives a context object with these properties:
- `method`: The HTTP method (GET, POST, etc.)
- `path`: The requested URL path
- `query`: Object containing query parameters
- `body`: Parsed request body (supports JSON and form data)
- `headers`: HTTP request headers
- `setHeader(name, value)`: Function to set response headers
- `status(code)`: Function to set response status code

The handler can return:
- A CXMLBuilder instance (will be built and returned as XML)
- A string (assumed to be XML by default)
- An object (will be serialized as JSON)

#### `async start()`

Starts the server. Returns a promise that resolves when the server is listening.

#### `async stop()`

Stops the server. Returns a promise that resolves when the server has stopped.

## Examples

The library includes several examples in the `examples/` directory:

- `simple-server.js`: A basic CXML server
- `complex-ivr-example.js`: A complex IVR system with menu options
- `record-example.js`: Example of recording a message
- `coach-example.js`: Example of coaching a call
- `call-center-coaching-example.js`: Complete call center scenario with coaching
- `nested-record-play-gather-example.js`: Example with nested Record, Play, and Gather elements
- `start-stream-example.js`: Example of media streaming with the Start and Stream elements
- `converse-example.js`: Example of AI voice agents with the Converse verb

## New Features

### Callback-Based Nesting

The library now supports a callback-based approach for defining nested elements, which provides several benefits:

1. **More intuitive nesting syntax**: The callback pattern visually represents the XML hierarchy in your code
2. **Simplified API**: No need to call `.done()` to return to the parent builder
3. **Consistent method naming**: Uses the same method names at all nesting levels
4. **Proper CXML structure**: Automatically handles element ordering rules (e.g., Headers before other nouns in Dial)

Example:
```javascript
// Old approach with .done()
builder.addGather(options)
  .addSay("Press a key")
  .addPlay("beep.wav")
  .done() // Must remember to call done()
  .addHangup();

// New callback-based approach
builder.addGather(options, cxml => {
  cxml.addSay("Press a key")
      .addPlay("beep.wav");
})
.addHangup();
```

### Improved Element Consistency

All verbs now use a consistent implementation pattern:
1. Each verb module has a `create()` method that generates the element structure
2. All nested verbs use the same method signatures as their top-level counterparts
3. Options are processed the same way at all nesting levels

## Limitations and Future Work

While the library is functional, there are still some areas that could be improved:

1. **Comprehensive test coverage:** More tests are needed for all verbs and edge cases, especially for the newly added Record and Coach verbs.

2. **Production-ready server:** The included CXMLServer is suitable for development and testing only. For production use, consider integrating with a more robust server framework like Express.js.

3. **Advanced features:** Some advanced telephony features might be added in future versions, such as better conference controls, additional speech recognition options, and more.

4. **TypeScript support:** Adding TypeScript type definitions would improve developer experience and catch errors earlier.

## License

MIT License

Copyright (c) 2025 Cloudonix, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.