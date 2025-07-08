// components/DashboardPage/template.js
"use strict";

const { sanitize } = require('../../utils/security');
const dashboardPageStyles = require('./dashboardStyles');

/**
 * Creates the dashboard page template
 * @param {Object} state - Dashboard state
 * @param {boolean} canViewAdvanced - Whether the user can view advanced content
 * @returns {string} - HTML string
 */
const createDashboardTemplate = (state, canViewAdvanced) => {
    const { isLoading, error } = state;

    return `
        <style>${dashboardPageStyles}</style>
        <div class="dashboard-root">
            <sidebar-element></sidebar-element>
            <div class="dashboard-main">
                <div class="content-wrapper">
                    <div class="main-content">
                        <div class="dashboard-header">
                            <h2>Home</h2>
                        </div>
                        ${error ? createErrorBanner(error) : ''}
                        <div id="stats-container" class="stats-container"></div>
                        ${canViewAdvanced
        ? '<div id="charts-container" class="charts-container"></div>'
        : '<div class="limited-access-notice">Some dashboard features are only available to supervisors and administrators.</div>'}
                    </div>
                </div>
            </div>
        </div>
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
const createLoadingIndicator = (message = 'Loading dashboard data...') => `
    <div class="loading-indicator">
        <div class="spinner"></div>
        <p>${sanitize(message)}</p>
    </div>
`;

module.exports = {
    createDashboardTemplate,
    createErrorBanner,
    createLoadingIndicator
};