// src/utils/_validation.js
"use strict";

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(String(email).toLowerCase());
};

/**
 * Checks if a string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Validates a password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result and errors
 */
const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array<string>} requiredFields - List of required field names
 * @returns {Object} Validation result and errors
 */
const validateRequired = (data, requiredFields) => {
    const errors = {};

    requiredFields.forEach(field => {
        if (isEmpty(data[field])) {
            errors[field] = `${field} is required`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    isValidEmail,
    isEmpty,
    validatePassword,
    validateRequired
};