/**
 * @file Tests for the CXMLServer class
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 */

'use strict';

const assert = require('assert');
const http = require('http');
const { CXMLBuilder, CXMLServer } = require('../src/cxml');

describe('CXMLServer', function() {
  let server;
  const PORT = 3456;

  // Helper function to make HTTP requests to the server
  async function makeRequest(path, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: path,
        method: method,
        headers: headers
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        if (typeof body === 'object') {
          req.write(JSON.stringify(body));
        } else {
          req.write(body);
        }
      }

      req.end();
    });
  }

  beforeEach(async function() {
    this.timeout(5000); // Give the server time to start
    
    // Create a new server
    server = new CXMLServer({ port: PORT });
    
    // Add a route that returns a simple CXML document
    server.route('/test', async (context) => {
      const builder = new CXMLBuilder();
      return builder
        .createResponse()
        .addSay('Hello, this is a test!')
        .addPause(1)
        .addHangup();
    });
    
    // Add a route that echoes the request body
    server.route('/echo', async (context) => {
      return {
        method: context.method,
        path: context.path,
        body: context.body,
        query: context.query
      };
    });
    
    // Start the server
    await server.start();
  });

  afterEach(async function() {
    // Stop the server after tests
    if (server) {
      await server.stop();
    }
  });

  it('should serve CXML documents', async function() {
    const response = await makeRequest('/test');
    
    assert.strictEqual(response.statusCode, 200);
    assert.ok(response.headers['content-type'].includes('application/xml'));
    assert.ok(response.body.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(response.body.includes('<Response>'));
    assert.ok(response.body.includes('<Say>Hello, this is a test!</Say>'));
    assert.ok(response.body.includes('<Pause length="1"/>'));
    assert.ok(response.body.includes('<Hangup/>'));
  });

  it('should handle 404 for unknown routes', async function() {
    const response = await makeRequest('/nonexistent');
    
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body, 'Not Found');
  });

  it('should parse JSON request bodies', async function() {
    const testData = { foo: 'bar', baz: 123 };
    const response = await makeRequest('/echo', 'POST', testData, {
      'Content-Type': 'application/json'
    });
    
    assert.strictEqual(response.statusCode, 200);
    assert.ok(response.headers['content-type'].includes('application/json'));
    
    const body = JSON.parse(response.body);
    assert.strictEqual(body.method, 'POST');
    assert.strictEqual(body.path, '/echo');
    assert.deepStrictEqual(body.body, testData);
  });

  it('should parse URL-encoded request bodies', async function() {
    const response = await makeRequest('/echo', 'POST', 'foo=bar&baz=123', {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    assert.strictEqual(response.statusCode, 200);
    
    const body = JSON.parse(response.body);
    assert.strictEqual(body.method, 'POST');
    assert.strictEqual(body.path, '/echo');
    assert.deepStrictEqual(body.body, { foo: 'bar', baz: '123' });
  });

  it('should parse query parameters', async function() {
    const response = await makeRequest('/echo?foo=bar&baz=123');
    
    assert.strictEqual(response.statusCode, 200);
    
    const body = JSON.parse(response.body);
    assert.strictEqual(body.method, 'GET');
    assert.strictEqual(body.path, '/echo');
    assert.deepStrictEqual(body.query, { foo: 'bar', baz: '123' });
  });
});