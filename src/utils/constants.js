// src/utils/constants.js
"use strict";

// To do List: use ENV

/**
 * API Configuration
 */
const API_CONFIG = {
    BASE_URL: '/api',
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500
};

/**
 * Local Storage Keys
 */
const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    SETTINGS: 'user_settings'
};

/**
 * Event Names
 */
const EVENTS = {
    AUTH: {
        LOGIN: 'auth:login',
        LOGOUT: 'auth:logout',
        ERROR: 'auth:error'
    },
    STATE: {
        CHANGE: 'state:change',
        ERROR: 'state:error'
    },
    FORM: {
        SUBMIT: 'form:submit',
        VALIDATE: 'form:validate',
        ERROR: 'form:error'
    }
};

/**
 * CSS Custom Properties
 */
const CSS_VARS = {
    // Colors
    PRIMARY: '--primary-color',
    SECONDARY: '--secondary-color',
    SUCCESS: '--success-color',
    ERROR: '--error-color',
    WARNING: '--warning-color',
    INFO: '--info-color',

    // Typography
    FONT_FAMILY: '--font-family',
    FONT_SIZE_BASE: '--font-size-base',

    // Spacing
    SPACING_UNIT: '--spacing-unit',

    // Layout
    HEADER_HEIGHT: '--header-height',
    SIDEBAR_WIDTH: '--sidebar-width',
    CONTENT_MAX_WIDTH: '--content-max-width'
};

module.exports = {
    API_CONFIG,
    HTTP_STATUS,
    STORAGE_KEYS,
    EVENTS,
    CSS_VARS
};