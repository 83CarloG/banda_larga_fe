// modules/auth.js
"use strict";

const cookies = require('./cookies');

/**
 * Auth state structure
 * @typedef {Object} AuthState
 * @property {string|null} token - Authentication token
 * @property {Object|null} user - User data
 * @property {Object|null} role - User role
 * @property {Array<string>|null} permissions - User permissions
 */

/**
 * Initial auth state
 */
const INITIAL_STATE = Object.freeze({
    token: null,
    user: null,
    role: null,
    permissions: null
});

/**
 * Private auth state
 */
let authState = { ...INITIAL_STATE };

/**
 * Gets current authentication state (immutable copy)
 * @returns {AuthState}
 */
const getAuthState = () => Object.freeze({ ...authState });

/**
 * Validates login response structure
 * @param {Object} response - Login response from API
 * @returns {boolean}
 */
const isValidLoginResponse = (response) => {
    return response?.data?.token_type &&
        response?.data?.token &&
        response?.data?.user &&
        response?.data?.role;
};

/**
 * Updates auth state from login response
 * @param {Object} response - Login response from API
 * @throws {Error} If response is invalid
 */
const setAuthFromResponse = (response) => {
    if (!isValidLoginResponse(response)) {
        throw new Error('Invalid login response structure');
    }

    const { token_type, token, user, role, tabs } = response.data;
    const fullToken = `${token_type} ${token}`;

    // Update auth state
    authState = Object.freeze({
        token: fullToken,
        user,
        role,
        permissions: tabs || []
    });

    // Store in cookies
    cookies.setCookie(
        cookies.COOKIE_NAMES.AUTH_TOKEN,
        fullToken,
        cookies.COOKIE_OPTIONS.AUTH
    );

    cookies.setCookie(
        cookies.COOKIE_NAMES.USER_DATA,
        JSON.stringify({ user, role, tabs }),
        cookies.COOKIE_OPTIONS.AUTH
    );

    return getAuthState();
};

/**
 * Checks if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
const hasPermission = (permission) => {
    if (!permission) return false;
    return authState.permissions?.includes(permission) || false;
};

/**
 * Checks if user has specific role
 * @param {string} roleName - Role to check
 * @returns {boolean}
 */
const hasRole = (roleName) => {
    if (!roleName) return false;
    return authState.role?.role_name === roleName;
};

/**
 * Checks if user is authenticated
 * @returns {boolean}
 */
const isAuthenticated = () => Boolean(authState.token);

/**
 * Gets current authentication token
 * @returns {string|null}
 */
const getToken = () => authState.token;

/**
 * Gets current user data
 * @returns {Object|null}
 */
const getUser = () => authState.user;

/**
 * Cleans up auth state and removes cookies
 */
const clearAuth = () => {
    // Clear cookies if they exist
    const token = cookies.getCookie(cookies.COOKIE_NAMES.AUTH_TOKEN);
    const userData = cookies.getCookie(cookies.COOKIE_NAMES.USER_DATA);

    if (token) {
        cookies.removeCookie(cookies.COOKIE_NAMES.AUTH_TOKEN);
    }
    if (userData) {
        cookies.removeCookie(cookies.COOKIE_NAMES.USER_DATA);
    }

    // Reset state
    authState = { ...INITIAL_STATE };
};

/**
 * Initializes auth state from cookies
 */
const initializeAuth = () => {
    try {
        const token = cookies.getCookie(cookies.COOKIE_NAMES.AUTH_TOKEN);
        const userDataString = cookies.getCookie(cookies.COOKIE_NAMES.USER_DATA);

        if (!token || !userDataString) {
            return;
        }

        const userData = JSON.parse(userDataString);

        if (!userData.user || !userData.role) {
            throw new Error('Invalid user data in cookie');
        }

        authState = Object.freeze({
            token,
            user: userData.user,
            role: userData.role,
            permissions: userData.tabs || []
        });
    } catch (error) {
        console.error('Failed to initialize auth from cookies:', error);
        clearAuth();
    }
};

// Initialize auth state when module loads
initializeAuth();

module.exports = {
    getAuthState,
    setAuthFromResponse,
    hasPermission,
    hasRole,
    isAuthenticated,
    getToken,
    getUser,
    clearAuth
};