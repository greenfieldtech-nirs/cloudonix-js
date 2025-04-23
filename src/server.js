/**
 * @file CXML Server implementation
 * @copyright 2025 Nir Simionovich, nirs@cloudonix.io
 * @license MIT
 * @module cloudonix-js/server
 * @description Provides a simple HTTP server for serving CXML documents in development environments
 * @warning This server is for development and testing purposes only. 
 * It should NOT be used in production environments.
 */

'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const CXMLBuilder = require('./builder');

/**
 * A simple HTTP server for serving CXML documents.
 * 
 * NOTE: This server is for development and testing purposes only.
 * It should NOT be used in production environments.
 * For production, use a robust server like Express.js with proper
 * security, logging, and error handling.
 */
class CXMLServer {
  /**
   * Create a new CXML server
   * @param {Object} options - Server configuration options
   * @param {number} options.port - Port to listen on (default: 3000)
   * @param {boolean} options.verbose - Whether to log verbose output (default: false)
   */
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.verbose = options.verbose || false;
    this.routes = new Map();
    this.server = null;
  }

  /**
   * Register a route handler
   * @param {string} path - URL path to handle
   * @param {Function} handler - Async function that handles the request
   * @returns {CXMLServer} - The server instance for chaining
   */
  route(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  /**
   * Parse request body based on content type
   * @private
   * @param {Object} req - HTTP request object
   * @returns {Promise<Object|string>} - Parsed body
   */
  async _parseBody(req) {
    const contentType = req.headers['content-type'] || '';
    let body = '';

    // Collect body data
    await new Promise((resolve) => {
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', resolve);
    });

    // Don't try to parse empty body
    if (!body) {
      return '';
    }

    // Parse based on content type
    try {
      if (contentType.includes('application/json')) {
        return JSON.parse(body);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        return querystring.parse(body);
      }
    } catch (error) {
      this._log('Error parsing request body:', error);
    }

    // Return raw body if parsing fails or content type is not recognized
    return body;
  }

  /**
   * Log message if verbose mode is enabled
   * @private
   * @param {...any} args - Arguments to log
   */
  _log(...args) {
    if (this.verbose) {
      console.log(`[CXMLServer]`, ...args);
    }
  }

  /**
   * Start the server
   * @returns {Promise<void>}
   */
  async start() {
    if (this.server) {
      throw new Error('Server is already running');
    }

    this.server = http.createServer(async (req, res) => {
      const startTime = Date.now();
      try {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const handler = this.routes.get(path);

        this._log(`${req.method} ${path}`);

        if (!handler) {
          this._log(`No handler for path: ${path}`);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }

        // Parse request body if method has a body
        let body = '';
        if (req.method === 'POST' || req.method === 'PUT') {
          body = await this._parseBody(req);
        }

        // Create request context
        const context = {
          method: req.method,
          path: path,
          query: parsedUrl.query,
          body,
          headers: req.headers,
          params: {}, // For future use with path parameters
          // Helper methods
          setHeader: (name, value) => res.setHeader(name, value),
          status: (code) => {
            res.statusCode = code;
            return context; // For chaining
          }
        };

        // Execute handler
        const result = await handler(context);
        
        // Handle different response types
        if (result instanceof CXMLBuilder) {
          // If result is a CXMLBuilder, build the XML
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          }
          const xml = result.build();
          res.end(xml);
          this._log(`Responded with CXML (${xml.length} bytes)`);
        } else if (typeof result === 'string') {
          // If result is a string, assume it's already XML unless content type is set
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          }
          res.end(result);
          this._log(`Responded with string (${result.length} bytes)`);
        } else if (result && typeof result === 'object') {
          // If result is an object, serialize as JSON
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
          res.end(JSON.stringify(result));
          this._log(`Responded with JSON object`);
        } else {
          // For other types of results
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          }
          res.end(result ? result.toString() : '');
          this._log(`Responded with ${result ? result.toString().length : 0} bytes`);
        }
      } catch (error) {
        console.error('Error handling request:', error);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        }
        res.end('Internal Server Error: ' + error.message);
      }
      
      const elapsed = Date.now() - startTime;
      this._log(`Request processed in ${elapsed}ms`);
    });

    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`
┌───────────────────────────────────────────────────┐
│                                                   │
│   CXML Server started on http://localhost:${this.port}   │
│                                                   │
│   WARNING: For development purposes only!         │
│   Not recommended for production use.             │
│                                                   │
└───────────────────────────────────────────────────┘
`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.server) {
      return;
    }

    return new Promise((resolve) => {
      this.server.close(() => {
        this.server = null;
        console.log('CXML server stopped');
        resolve();
      });
    });
  }
}

module.exports = CXMLServer;