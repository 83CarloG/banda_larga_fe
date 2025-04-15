// components/CentersPage/template.js
"use strict";

const { sanitize } = require('../../utils/security');
const styles = require('./styles');

/**
 * Creates the main page template
 * @param {Object} state - Application state
 * @returns {string} - HTML string
 */
const createPageTemplate = (state) => {
    const { centers, isLoading, error, editingCenter } = state;

    return `
        <header-element></header-element>
        <sidebar-element></sidebar-element>
        <style>${styles()}</style>
        <div class="container">
            <div class="header">
                <h2>Gestione Centri</h2>
                ${editingCenter ?
                    `<span class="badge">${editingCenter.id ? 'Editing Center' : 'New Center'}</span>` :
                    `<button id="add-center-btn" class="primary-btn">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Add Center
                    </button>`
                }
            </div>

            ${error ? createErrorBanner(error) : ''}

            <div id="form-container" class="${editingCenter ? 'active' : 'hidden'}"></div>
            <div id="grid-container"></div>
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
const createLoadingIndicator = (message = 'Loading centers...') => `
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
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M12 18c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.33-5c0-1.84 1.49-3.33 3.33-3.33s3.33 1.49 3.33 3.33-1.49 3.33-3.33 3.33-3.33-1.49-3.33-3.33z"/>
        </svg>
        <p>No centers found</p>
        <button id="empty-add-btn" class="primary-btn">Add Your First Center</button>
    </div>
`;

module.exports = {
    createPageTemplate,
    createErrorBanner,
    createLoadingIndicator,
    createEmptyState
};