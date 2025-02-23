"use strict";

/**
 * Validates user form data
 * @param {Object} userData - User form data
 * @returns {Object} Validation result
 */
const validateUserData = (userData) => {
    const errors = {};

    if (!userData.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.email = 'Invalid email format';
    }

    if (!userData.first_name) {
        errors.first_name = 'First name is required';
    }

    if (!userData.last_name) {
        errors.last_name = 'Last name is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = { validateUserData };