// template.js
"use strict";

const { sanitize } = require('../../utils/security');
const { cssVar, classNames } = require('../../utils/styleUtils');
const styles = require('./styles');

/**
 * Creates the main page template
 * @param {Object} state - Application state
 * @returns {string} - HTML string
 */
const createPageTemplate = (state) => {
    const { users, isLoading, error, editingUser } = state;

    return `
        <style>${styles()}</style>
        <div class="dashboard-container">
            <header-element></header-element>
            <sidebar-element></sidebar-element>
            
            <div class="content-wrapper">
                <div class="main-content">
                    <div class="header">
                        <h2>Gestione Utenti</h2>
                        <span class="badge">${editingUser ? 'Modifica Utente' : 'Nuovo Utente'}</span>
                    </div>
                    
                    ${error ? createErrorBanner(error) : ''}
                    
                    <div id="form-container"></div>
                    <div id="table-container"></div>
                </div>
            </div>
        </div>
        <footer-element></footer-element>
    `;
};

/**
 * Creates an error banner
 * @param {string} errorMessage - Error message to display
 * @returns {string} - HTML string
 */
const createErrorBanner = (errorMessage) => `
    <div class="error-banner" role="alert">
        <svg class="error-icon" viewBox="0 0 24 24">
            <path d="M13 13H11V7H13M11 15H13V17H11M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 6.47715 17.5228 2 12 2Z"/>
        </svg>
        <span>${sanitize(errorMessage)}</span>
    </div>
`;

/**
 * Creates loading indicator template
 * @returns {string} - HTML string
 */
const createLoadingIndicator = (message = 'Loading users...') => `
    <div class="loading-indicator">
        <div class="spinner"></div>
        <p>${sanitize(message)}</p>
    </div>
`;

/**
 * Creates empty state template
 * @returns {string} - HTML string
 */
const createEmptyState = () => `
    <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
            <path d="M12 5V3M3 7H5M21 7H19M7 3H9M7 21H9M3 5H5M19 5H21M18 16.5C18 17.9 17.18 19 16 19C14.82 19 14 17.9 14 16.5C14 15.1 16 13 16 13C16 13 18 15.1 18 16.5M12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13Z"/>
        </svg>
        <p>No users found</p>
    </div>
`;

/**
 * Creates a CSS class string based on conditions
 * @param {Object} conditions - Map of class names to boolean conditions
 * @returns {string} - CSS class string
 */
const getClassNames = (conditions) => {
    const classes = [];
    for (const [className, condition] of Object.entries(conditions)) {
        if (condition) classes.push(className);
    }
    return classes.join(' ');
};

module.exports = {
    createPageTemplate,
    createErrorBanner,
    createLoadingIndicator,
    createEmptyState,
    getClassNames
};