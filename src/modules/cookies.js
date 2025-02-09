"use strict";

/**
 * Sets a cookie with a given expiration time in minutes.
 */
const setCookie = (name, value, minutes) => {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Retrieves a cookie value by name.
 * @returns {string|null} The cookie value if found.
 */
const getCookie = (name) =>
    document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;

module.exports = { setCookie, getCookie };
