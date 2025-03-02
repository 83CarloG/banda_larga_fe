"use strict";

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} first_name - User first name
 * @property {string} last_name - User last name
 * @property {boolean} active - User active status
 */

/**
 * @typedef {Object} UserState
 * @property {Array<User>} users - List of users
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message
 * @property {User|null} editingUser - Currently editing user
 */

/**
 * Creates initial state object
 * @returns {UserState}
 * @returns {UserState}
 */
const createInitialState = () => ({
    users: [],
    isLoading: false,
    error: null,
    editingUser: null
});

module.exports = { createInitialState };