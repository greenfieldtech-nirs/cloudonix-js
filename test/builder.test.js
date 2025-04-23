/**
 * @file Tests for the CXMLBuilder class
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 */

'use strict';

const assert = require('assert');
const CXMLBuilder = require('../src/builder');

describe('CXMLBuilder', () => {
  it('should create a Response element', () => {
    const builder = new CXMLBuilder();
    const xml = builder.createResponse().build();
    assert.strictEqual(xml, '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n</Response>');
  });

  it('should add a Play element', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addPlay('https://example.com/audio.mp3')
      .build();
    assert.strictEqual(xml, '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Play>https://example.com/audio.mp3</Play>\n</Response>');
  });

  it('should add a Say element with options', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addSay('Hello, world!', { voice: 'woman', language: 'en-US' })
      .build();
    assert.strictEqual(
      xml,
      '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say voice="woman" language="en-US">Hello, world!</Say>\n</Response>'
    );
  });

  it('should add a Gather element with options', () => {
    const builder = new CXMLBuilder();
    const gatherBuilder = builder
      .createResponse()
      .addGather({ numDigits: 1, timeout: 5, action: '/handle-input' });
      
    const xml = gatherBuilder.done().build();
    assert.match(
      xml,
      /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<Response>\n  <Gather (numDigits="1" timeout="5" action="\/handle-input"|action="\/handle-input" numDigits="1" timeout="5"|timeout="5" numDigits="1" action="\/handle-input"|timeout="5" action="\/handle-input" numDigits="1"|action="\/handle-input" timeout="5" numDigits="1"|numDigits="1" action="\/handle-input" timeout="5")\/>\n<\/Response>$/
    );
  });

  it('should add a Redirect element', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addRedirect('/next-step', 'GET')
      .build();
    assert.strictEqual(
      xml,
      '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Redirect method="GET">/next-step</Redirect>\n</Response>'
    );
  });

  it('should add a Hangup element', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addHangup()
      .build();
    assert.strictEqual(xml, '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Hangup/>\n</Response>');
  });

  it('should chain multiple elements', () => {
    const builder = new CXMLBuilder();
    const gatherBuilder = builder
      .createResponse()
      .addSay('Please press a key')
      .addGather({ numDigits: 1 });
    
    const xml = gatherBuilder.done().build();
    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<Response>'));
    assert.ok(xml.includes('<Say>Please press a key</Say>'));
    assert.ok(xml.includes('<Gather numDigits="1"/>'));
    assert.ok(xml.includes('</Response>'));
  });
  
  it('should create Record elements', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addRecord({
        action: '/recording',
        maxLength: 60,
        playBeep: true,
        finishOnKey: '#'
      })
      .build();
    
    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<Response>'));
    assert.ok(xml.includes('<Record '));
    assert.ok(xml.includes('action="/recording"'));
    assert.ok(xml.includes('maxLength="60"'));
    assert.ok(xml.includes('playBeep="true"'));
    assert.ok(xml.includes('finishOnKey="#"'));
    assert.ok(xml.includes('/>'));
    assert.ok(xml.includes('</Response>'));
  });
  
  it('should create Coach elements', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addCoach('+18005551234', {
        callerId: '+15551234567',
        listen: true,
        speak: false
      })
      .build();
    
    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<Response>'));
    assert.ok(xml.includes('<Coach '));
    assert.ok(xml.includes('callerId="+15551234567"'));
    assert.ok(xml.includes('listen="true"'));
    assert.ok(xml.includes('speak="false"'));
    assert.ok(xml.includes('>+18005551234</Coach>'));
    assert.ok(xml.includes('</Response>'));
  });
  
  it('should handle nested elements in Gather', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addGather({ numDigits: 1 })
      .addSay('Press a key')
      .addPlay('https://example.com/beep.mp3')
      .done()
      .build();
    
    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<Response>'));
    assert.ok(xml.includes('<Gather numDigits="1">'));
    assert.ok(xml.includes('<Say>Press a key</Say>'));
    assert.ok(xml.includes('<Play>https://example.com/beep.mp3</Play>'));
    assert.ok(xml.includes('</Gather>'));
    assert.ok(xml.includes('</Response>'));
  });
  
  it('should handle nested elements in Dial', () => {
    const builder = new CXMLBuilder();
    const xml = builder
      .createResponse()
      .addDial({ callerId: '+15551234567' })
      .addNumber('+18005551234')
      .addHeader('X-Custom-Header', 'value')
      .done()
      .build();
    
    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<Response>'));
    assert.ok(xml.includes('<Dial callerId="+15551234567">'));
    assert.ok(xml.includes('<Number>+18005551234</Number>'));
    assert.ok(xml.includes('<Header name="X-Custom-Header" value="value"/>'));
    assert.ok(xml.includes('</Dial>'));
    assert.ok(xml.includes('</Response>'));
  });
});