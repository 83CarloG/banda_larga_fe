// modules/rolesService.js
"use strict";

const api = require('./api');

/**
 * Roles service for handling API calls related to roles
 */
const rolesService = {
    /**
     * Fetch all roles
     * @returns {Promise<Array<Role>>}
     */
    async fetchRoles() {
        // Assume we have a getRoles endpoint in our API
        // If not, you might need to add it to the API module
        try {
            const response = await api.getRoles();
            return response.data.roles;
        } catch (error) {
            // If the endpoint doesn't exist yet, return some default roles
            console.warn('Failed to fetch roles, using defaults:', error);
            return [
                { id: 1, name: 'Data Entry' },
                { id: 2, name: 'Supervisor' },
                { id: 3, name: 'Administrator' }
            ];
        }
    }
};

module.exports = rolesService;