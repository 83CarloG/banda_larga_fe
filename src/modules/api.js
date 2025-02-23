// modules/api.js
"use strict";

const axios = require('axios');
const auth = require('./auth');
const router = require('./router');

/**
 * Default API configuration
 */
const API_CONFIG = {
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000 // 30 seconds
};

/**
 * Creates base axios instance
 * @returns {Object} Configured axios instance
 */
const createAxiosInstance = () => {
    const instance = axios.create(API_CONFIG);

    // Request interceptor
    instance.interceptors.request.use(
        config => {
            const token = auth.getToken();
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        response => response.data,
        error => {
            const status = error.response?.status;
            const data = error.response?.data;

            // Handle 401 Unauthorized
            if (status === 401) {
                auth.clearAuth();
                router.navigate('/');
                throw new Error('Session expired. Please log in again.');
            }

            // Handle 403 Forbidden
            if (status === 403) {
                throw new Error('You do not have permission to perform this action.');
            }

            // Handle 422 Validation Error
            if (status === 422) {
                const message = data?.message || 'Validation failed';
                const errors = data?.errors || {};
                throw { message, errors };
            }

            // Handle 500 and other errors
            throw new Error(data?.message || 'An unexpected error occurred');
        }
    );

    return instance;
};

/**
 * Creates API methods
 * @param {Object} axiosInstance - Configured axios instance
 * @returns {Object} API methods
 */
const createApiMethods = (axiosInstance) => ({
    /**
     * Login user
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>}
     */
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/login', {
                email,
                password
            });

            if (response.status === 'success') {
                auth.setAuthFromResponse(response);
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        try {
            const response = await axiosInstance.post('/logout');

            if (response.status === 'success') {
                auth.clearAuth();
                router.navigate('/');
            }

            return response;
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear auth and redirect
            auth.clearAuth();
            router.navigate('/');
            throw error;
        }
    },

});

// Create and export API client instance
const apiClient = createApiMethods(createAxiosInstance());
module.exports = apiClient;