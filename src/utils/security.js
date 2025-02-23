// src/utils/security.js
"use strict";

/**
 * Sanitizes a string for safe HTML insertion
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitize = (str) => {
    if (typeof str !== 'string') {
        return str;
    }

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Validates and sanitizes object properties
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? sanitize(value) : value;
        return acc;
    }, {});
};

module.exports = {
    sanitize,
    sanitizeObject
};