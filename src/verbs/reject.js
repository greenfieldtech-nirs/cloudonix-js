/**
 * @file Reject verb implementation
 * @copyright 2025 Cloudonix, Inc.
 * @license MIT
 * @module cloudonix-js/verbs/reject
 * @description Implements the Reject verb for rejecting incoming calls
 */

'use strict';

module.exports = {
  /**
   * Create a Reject element
   * @param {Object} options - Optional parameters for the Reject element
   * @param {string} options.reason - Rejection reason: 'rejected', 'busy', 'congestion', or 'failed'
   * @returns {Object} - The Reject element
   */
  create: (options = {}) => {
    const rejectElement = {};
    
    // Add reason attribute if provided
    if (options.reason) {
      rejectElement['@_reason'] = options.reason;
    }
    
    return rejectElement;
  }
};