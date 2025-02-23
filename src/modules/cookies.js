// modules/cookies.js
"use strict";

/**
 * Cookie configuration presets
 */
const COOKIE_OPTIONS = Object.freeze({
    AUTH: {
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
});

/**
 * Cookie names used in the application
 */
const COOKIE_NAMES = Object.freeze({
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data'
});

/**
 * Validates cookie name format
 */
const isValidCookieName = name =>
    typeof name === 'string' && /^[\w-]+$/.test(name);

/**
 * Creates cookie options string
 */
const formatCookieOptions = options =>
    Object.entries(options)
        .map(([key, value]) => {
            if (value === true) return key;
            if (value !== false && value != null) return `${key}=${value}`;
            return '';
        })
        .filter(Boolean)
        .join('; ');

/**
 * Sets a cookie with provided name and value
 */
const setCookie = (name, value, options = {}) => {
    if (!name || value === undefined) {
        throw new Error('Cookie name and value are required');
    }

    if (!isValidCookieName(name)) {
        throw new Error('Invalid cookie name format');
    }

    const cookieOptions = {
        path: '/',
        ...options
    };

    document.cookie = `${name}=${encodeURIComponent(value)}; ${formatCookieOptions(cookieOptions)}`;
};

/**
 * Gets cookie value by name
 */
const getCookie = name => {
    if (!name) return null;

    const cookies = document.cookie
        .split('; ')
        .reduce((acc, cookie) => {
            const [cookieName, cookieValue] = cookie.split('=');
            return {
                ...acc,
                [cookieName]: decodeURIComponent(cookieValue)
            };
        }, {});

    return cookies[name] || null;
};

/**
 * Removes a cookie by name
 */
const removeCookie = name => {
    if (!name) return;

    // Set expiration to past date to remove cookie
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

module.exports = {
    COOKIE_OPTIONS,
    COOKIE_NAMES,
    setCookie,
    getCookie,
    removeCookie
};