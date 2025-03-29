// src/services/api.js
"use strict";

const axios = require('axios');
const auth = require('./auth');
const router = require('./router');
const { API_CONFIG, HTTP_STATUS } = require('../utils/constants');

/**
 * Creates request headers with authentication
 */
const createHeaders = (token) => ({
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: token })
});

/**
 * Request interceptor to handle authentication
 */
const requestInterceptor = (config) => ({
    ...config,
    headers: createHeaders(auth.getToken())
});

/**
 * Response data extractor
 */
const extractResponseData = response => response.data;

/**
 * Error response handler
 */
const handleResponseError = error => {
    const { status, data } = error.response || {};

    const errorMap = {
        [HTTP_STATUS.UNAUTHORIZED]: () => {
            auth.clearAuth();
            router.navigate('/');
            throw new Error('Session expired. Please log in again.');
        },
        [HTTP_STATUS.FORBIDDEN]: () => {
            throw new Error('You do not have permission to perform this action.');
        },
        [HTTP_STATUS.VALIDATION_ERROR]: () => {
            throw {
                message: data?.message || 'Validation failed',
                errors: data?.errors || {}
            };
        },
        default: () => {
            throw new Error(data?.message || 'An unexpected error occurred');
        }
    };

    const handler = errorMap[status] || errorMap.default;
    return handler();
};

/**
 * Creates configured axios instance
 */
const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: API_CONFIG.HEADERS
    });

    instance.interceptors.request.use(
        requestInterceptor,
        error => Promise.reject(error)
    );

    instance.interceptors.response.use(
        extractResponseData,
        handleResponseError
    );

    return instance;
};

/**
 * API operation wrapper with error handling
 */
const withErrorHandling = (operation) => async (...args) => {
    try {
        return await operation(...args);
    } catch (error) {
        console.error('API Error:', {
            operation: operation.name,
            arguments: args,
            error
        });
        throw error;
    }
};

/**
 * Validates required fields in user data
 */
const validateUserData = (userData, requiredFields = ['email', 'first_name', 'last_name', 'role_id']) => {
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
};

/**
 * Creates API methods
 */
const createApiMethods = (instance) => ({
    // Auth endpoints
    login: withErrorHandling(async (email, password) => {
        const response = await instance.post('/login', { email, password });
        if (response.status === 'success') {
            auth.setAuthFromResponse(response);
        }
        return response;
    }),

    logout: withErrorHandling(async () => {
        try {
            const response = await instance.post('/logout');
            if (response.status === 'success') {
                auth.clearAuth();
                router.navigate('/');
            }
            return response;
        } catch (error) {
            auth.clearAuth();
            router.navigate('/');
            throw error;
        }
    }),

    /// User endpoints
    getUsers: withErrorHandling(async () =>
        instance.get('/users')
    ),

    getUser: withErrorHandling(async (userId) =>
        // Using Laravel's edit route convention
        instance.get(`/users/${userId}/edit`)
    ),

    createUser: withErrorHandling(async (userData) => {
        // Make sure required fields are present
        if (!userData.email || !userData.first_name || !userData.last_name || !userData.role_id) {
            throw new Error('Missing required fields');
        }

        // Ensure role_id is a number
        userData.role_id = parseInt(userData.role_id, 10);
        return instance.post('/users', userData);
    }),

    updateUser: withErrorHandling(async (userId, userData) => {
        // Ensure role_id is a number if present
        if (userData.role_id) {
            userData.role_id = parseInt(userData.role_id, 10);
        }
        return instance.put(`/users/${userId}`, userData);
    }),

    deleteUser: withErrorHandling(async (userId) =>
        instance.delete(`/users/${userId}`)
    )
});

// Create and export API instance
const api = createApiMethods(createAxiosInstance());

module.exports = api;