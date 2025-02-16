"use strict";

const axios = require('axios');
const cookies = require('./cookies.js');

/**
 * Creates an API client with authentication and error handling
 * @param {string} baseURL - Base URL for API requests
 * @returns {Object} API client with authentication methods
 */
const createApiClient = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Add authentication header to requests
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = cookies.getAuthCookie();
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Handle authentication errors
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                cookies.removeAuthCookie();
                window.location.href = '/';
            }
            return Promise.reject(error.response?.data?.message || 'Request failed');
        }
    );

    return {
        /**
         * Authenticates user with email and password
         * @param {string} email - User's email
         * @param {string} password - User's password
         * @returns {Promise<Object>} Authentication response
         */
        login: async (email, password) => {
            try {
                return await axiosInstance.post('/login', { email, password });
            } catch (error) {
                throw new Error('Unable to log in. Please check your credentials and try again.');
            }
        },

        /**
         * Logs out current user and cleans up session
         */
        logout: () => {
            cookies.removeAuthCookie();
            window.location.href = '/';
        }
    };
};

const apiClient = createApiClient('/api');
module.exports = apiClient;