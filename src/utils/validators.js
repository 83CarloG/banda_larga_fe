"use strict";

/**
 * Collection of reusable validator functions
 */
const Validators = {
    /**
     * Creates a validator that checks if a value is not empty
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    required: (message = 'This field is required') => {
        return (value) => {
            return (!value || value.trim() === '') ? message : null;
        };
    },

    /**
     * Creates a validator that checks if a value is a valid email
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    email: (message = 'Please enter a valid email address') => {
        return (value) => {
            if (!value) return null; // Let required validator handle empty case

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !regex.test(value) ? message : null;
        };
    },

    /**
     * Creates a validator that checks if a value meets minimum length
     * @param {number} length - Minimum length
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    minLength: (length, message = `Must be at least ${length} characters`) => {
        return (value) => {
            if (!value) return null; // Let required validator handle empty case

            return value.length < length ? message : null;
        };
    },

    /**
     * Creates a validator that checks if a value is under maximum length
     * @param {number} length - Maximum length
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    maxLength: (length, message = `Must not exceed ${length} characters`) => {
        return (value) => {
            if (!value) return null; // Let required validator handle empty case

            return value.length > length ? message : null;
        };
    },

    /**
     * Creates a validator that checks if a value matches a pattern
     * @param {RegExp} pattern - RegExp pattern
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    pattern: (pattern, message = 'Please enter a valid value') => {
        return (value) => {
            if (!value) return null; // Let required validator handle empty case

            return !pattern.test(value) ? message : null;
        };
    },

    /**
     * Creates a validator with a custom validation function
     * @param {Function} validationFn - Function that returns true if valid
     * @param {string} message - Error message
     * @returns {Function} - Validator function
     */
    custom: (validationFn, message = 'Invalid value') => {
        return (value) => {
            return !validationFn(value) ? message : null;
        };
    }
};

module.exports = Validators;