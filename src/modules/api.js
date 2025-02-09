"use strict";

const axios = require('axios');

/**
 * Creates an API client with a base URL.
 */
const createApiClient = (baseURL) => ({
    /**
     * Sends login request with email and password.
     * @returns {Promise<string>} JWT token on success.
     */
    login: (email, password) =>
        axios.post(`${baseURL}/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
            .then(response => response.data.data)
            .catch(error => Promise.reject(error.response?.data?.message || 'Login failed')),
});

const apiClient = createApiClient('/api');

module.exports = apiClient;
