"use strict";

/**
 * Cookie configuration options
 * @constant
 */
const CookieOptions = {
    SECURE: {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
    },
    SESSION: {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
    },
    AUTH: {
        path: '/',
        secure: window.location.protocol === 'https:',
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 30 * 60 * 1000, // 30 minutes
    }
};

/**
 * Registry of cookie names used in the application
 * @constant
 */
const CookieNames = {
    AUTH_TOKEN: 'auth_token',
    SESSION_ID: 'session_id',
    LANGUAGE: 'lang',
    THEME: 'theme'
};

/**
 * Sets a cookie with security options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 */
const setCookie = (name, value, options = {}) => {
    if (!name || !value) {
        throw new Error('Cookie name and value are required');
    }

    if (!/^[\w-]+$/.test(name)) {
        throw new Error('Invalid cookie name');
    }

    const cookieOptions = {
        ...CookieOptions.SECURE,
        ...options
    };

    const finalValue = encodeURIComponent(value);
    let cookieString = `${name}=${finalValue}`;

    Object.entries(cookieOptions).forEach(([key, value]) => {
        if (value === true) {
            cookieString += `; ${key}`;
        } else if (value !== false && value != null) {
            cookieString += `; ${key}=${value}`;
        }
    });

    document.cookie = cookieString;
};

/**
 * Retrieves a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value if found
 */
const getCookie = (name) => {
    if (!name) {
        throw new Error('Cookie name is required');
    }

    const cookies = document.cookie.split('; ');
    const cookieString = cookies.find(row => row.startsWith(name + '='));

    if (!cookieString) {
        return null;
    }

    return decodeURIComponent(cookieString.split('=')[1]);
};

/**
 * Removes a cookie by name
 * @param {string} name - Cookie name
 */
const removeCookie = (name) => {
    setCookie(name, '', {
        ...CookieOptions.SECURE,
        expires: new Date(0)
    });
};

/**
 * Authentication cookie management
 */
const setAuthCookie = (token) => {
    setCookie(CookieNames.AUTH_TOKEN, token, CookieOptions.AUTH);
};

const getAuthCookie = () => {
    return getCookie(CookieNames.AUTH_TOKEN);
};

const removeAuthCookie = () => {
    removeCookie(CookieNames.AUTH_TOKEN);
};

module.exports = {
    setCookie,
    getCookie,
    removeCookie,
    setAuthCookie,
    getAuthCookie,
    removeAuthCookie,
    CookieNames,
    CookieOptions
};