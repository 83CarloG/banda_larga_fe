"use strict";

const api = require('../../modules/api');

/**
 * User service for handling API calls
 */
const userService = {
    /**
     * Fetch all users
     * @returns {Promise<Array<User>>}
     */
    async fetchUsers() {
        const response = await api.getUsers();
        return response.data.users;
    },

    /**
     * Get user details for editing
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - User data with possible roles
     */
    async getUser(userId) {
        const response = await api.getUser(userId);
        return response.data;
    },

    /**
     * Create new user
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async createUser(userData) {
        // Ensure role_id is properly formatted
        if (userData && userData.role_id) {
            userData.role_id = typeof userData.role_id === 'string'
                ? parseInt(userData.role_id, 10)
                : userData.role_id;
        }

        const response = await api.createUser(userData);
        return response.data.user;
    },

    /**
     * Update existing user
     * @param {number} userId - User ID
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async updateUser(userId, userData) {
        // Ensure role_id is properly formatted and included
        if (userData && userData.role_id !== undefined) {
            userData.role_id = typeof userData.role_id === 'string'
                ? parseInt(userData.role_id, 10)
                : userData.role_id;
        }

        const response = await api.updateUser(userId, userData);
        return response.data.user;
    },

    /**
     * Delete user
     * @param {number} userId - User ID
     * @returns {Promise<void>}
     */
    async deleteUser(userId) {
        await api.deleteUser(userId);
    }
};

module.exports = userService;