"use strict";

const api = require('../../modules/api');

/**
 * User service for handling API calls
 */
const userService = {
    /**
     * Fetch all users
     * @returns {Promise<Object>} Object containing users, roles, and centers data
     */
    async fetchUsers() {
        const response = await api.getUsers();
        return response.data;
    },

    /**
     * Get user details for editing
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - User data with possible roles and centers
     */
    async getUser(userId) {
        const response = await api.getUser(userId);
        return response.data;
    },

    /**
     * Create new user
     * @param {Object} userData - User data including center_ids
     * @returns {Promise<User>}
     */
    async createUser(userData) {
        // Ensure role_id is properly formatted
        if (userData && userData.role_id) {
            userData.role_id = typeof userData.role_id === 'string'
                ? parseInt(userData.role_id, 10)
                : userData.role_id;
        }

        // Ensure center_ids is an array of numbers
        if (userData && userData.center_ids) {
            userData.center_ids = Array.isArray(userData.center_ids)
                ? userData.center_ids.map(id =>
                    typeof id === 'string' ? parseInt(id, 10) : id)
                : [];

            // Validation for center_ids
            if (userData.center_ids.length === 0) {
                throw new Error('At least one center must be selected');
            }
        } else {
            throw new Error('Centers are required');
        }

        const response = await api.createUser(userData);
        return response.data.user;
    },

    /**
     * Update existing user
     * @param {number} userId - User ID
     * @param {Object} userData - User data including center_ids
     * @returns {Promise<User>}
     */
    async updateUser(userId, userData) {
        // Ensure role_id is properly formatted
        if (userData && userData.role_id !== undefined) {
            userData.role_id = typeof userData.role_id === 'string'
                ? parseInt(userData.role_id, 10)
                : userData.role_id;
        }

        // Ensure center_ids is an array of numbers
        if (userData && userData.center_ids) {
            userData.center_ids = Array.isArray(userData.center_ids)
                ? userData.center_ids.map(id =>
                    typeof id === 'string' ? parseInt(id, 10) : id)
                : [];

            // Validation for center_ids
            if (userData.center_ids.length === 0) {
                throw new Error('At least one center must be selected');
            }
        } else {
            throw new Error('Centers are required');
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