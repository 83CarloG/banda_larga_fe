// components/DashboardPage/dashboardStats.js
"use strict";

const { createLoadingIndicator } = require('./dashboardTemplate');

/**
 * Creates a dashboard stats component
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.stats - Stats data object
 * @param {boolean} config.isLoading - Loading state
 * @returns {Object} Component API
 */
const DashboardStats = (config = {}) => {
    const {
        stats = {
            activeUsers: 0,
            totalCenters: 0,
            pendingTasks: 0,
            recentActivity: 0
        },
        isLoading = false
    } = config;

    // Create container element
    const container = document.createElement('div');
    container.className = 'stats-container';

    // Function to create a stat card
    const createStatCard = (title, value, subtitle, iconType) => {
        const card = document.createElement('div');
        card.className = 'stat-card';

        let iconSvg = '';

        // Set different icons based on type
        switch (iconType) {
            case 'users':
                iconSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 5.5C10.6193 5.5 9.5 6.61929 9.5 8C9.5 9.38071 10.6193 10.5 12 10.5C13.3807 10.5 14.5 9.38071 14.5 8C14.5 6.61929 13.3807 5.5 12 5.5ZM7.5 8C7.5 5.51472 9.51472 3.5 12 3.5C14.4853 3.5 16.5 5.51472 16.5 8C16.5 10.4853 14.4853 12.5 12 12.5C9.51472 12.5 7.5 10.4853 7.5 8ZM4.84565 17.2767C4.94748 17.2256 5.05795 17.1888 5.17484 17.1677C7.1681 16.8174 9.56932 16.5 12 16.5C14.4307 16.5 16.8319 16.8174 18.8252 17.1677C18.9421 17.1888 19.0525 17.2256 19.1544 17.2767C19.2562 17.3278 19.3967 17.4147 19.4398 17.5757C19.8988 19.3917 20 21.4802 20 22.5H22C22 21.4483 21.8957 19.2069 21.4022 17.234C21.2377 16.4999 20.7396 15.9286 20.1789 15.5716C19.618 15.2147 18.92 15 18.144 15C16.6685 15 15.0195 15.3437 13.4091 15.6344C13.5572 15.6352 13.7057 15.6364 13.8547 15.638C14.8451 15.6514 15.8622 15.6774 16.8458 15.7449C15.0622 15.3661 13.3789 15.228 12 15.228C10.6211 15.228 8.93778 15.3661 7.15422 15.7449C8.13782 15.6774 9.15486 15.6514 10.1453 15.638C10.2943 15.6364 10.4428 15.6352 10.5909 15.6344C8.98052 15.3437 7.33151 15 5.85598 15C5.08004 15 4.38204 15.2147 3.82109 15.5716C3.26015 15.9286 2.76227 16.4999 2.59776 17.234C2.10427 19.2069 2 21.4483 2 22.5H4C4 21.4802 4.10116 19.3917 4.56021 17.5757C4.60326 17.4147 4.74385 17.3278 4.84565 17.2767Z"/></svg>';
                break;
            case 'centers':
                iconSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9.5 2C8.67157 2 8 2.67157 8 3.5V5H5C3.89543 5 3 5.89543 3 7V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V7C21 5.89543 20.1046 5 19 5H16V3.5C16 2.67157 15.3284 2 14.5 2H9.5ZM14 5V4H10V5H14ZM5 7H19V9H5V7ZM5 11H19V18H5V11ZM9 14V15H15V14H9Z"/></svg>';
                break;
            case 'tasks':
                iconSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5ZM7 5V19H17V5H7ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5ZM8.5 12C8.5 9.79086 10.2909 8 12.5 8C14.7091 8 16.5 9.79086 16.5 12V13H8.5V12Z"/></svg>';
                break;
            case 'activity':
                iconSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.9998 3C12.5521 3 13.0286 3.39069 13.1254 3.93357L13.5 6H19.5C20.0522 6 20.5 6.44772 20.5 7C20.5 7.55228 20.0522 8 19.5 8H13.0994L13.4198 10H17.5C18.0522 10 18.5 10.4477 18.5 11C18.5 11.5523 18.0522 12 17.5 12H13.0193L13.3801 14.3834C13.4291 14.6732 13.5 15.2235 13.5 15.5C13.5 17.433 11.933 19 10 19C9.38322 19 8.82597 18.8137 8.35172 18.4978L8.26047 18.4356L4.06047 15.4356C3.6146 15.1048 3.51469 14.4879 3.84549 14.042C4.1763 13.5961 4.79317 13.4962 5.23905 13.827L9.19416 16.6491C9.3721 16.7741 9.65016 16.907 10 16.907C10.8157 16.907 11.407 16.3157 11.407 15.5C11.407 15.301 11.361 14.9223 11.3282 14.7423L11.3274 14.7388L10.9183 12H7.5C6.94772 12 6.5 11.5523 6.5 11C6.5 10.4477 6.94772 10 7.5 10H10.5179L10.1975 8H5.5C4.94772 8 4.5 7.55228 4.5 7C4.5 6.44772 4.94772 6 5.5 6H9.8068L9.47433 4.06643C9.3776 3.52354 9.75822 3 10.2998 3H11.9998Z"/></svg>';
                break;
            default:
                iconSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 7C10.3431 7 9 8.34315 9 10V14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14V10C15 8.34315 13.6569 7 12 7Z"/></svg>';
        }

        card.innerHTML = `
            <div class="stat-card-header">
                <h3 class="stat-card-title">${title}</h3>
                <div class="stat-card-icon ${iconType}">
                    ${iconSvg}
                </div>
            </div>
            <p class="stat-card-value">${value.toLocaleString()}</p>
            <p class="stat-card-subtitle">${subtitle}</p>
        `;

        return card;
    };

    // Render stats cards
    const render = () => {
        container.innerHTML = '';

        if (isLoading) {
            container.innerHTML = createLoadingIndicator('Loading dashboard statistics...');
            return;
        }

        // Users card
        container.appendChild(
            createStatCard('Utenti Attivi', stats.activeUsers, '', 'users')
        );

        // Centers card
        container.appendChild(
            createStatCard('Centri', stats.totalCenters, '', 'centers')
        );

        // Tasks card
        container.appendChild(
            createStatCard('Ospiti Registrati', stats.pendingTasks, '', 'tasks')
        );

        // Activity card
        container.appendChild(
            createStatCard('Azioni Recenti', stats.recentActivity, 'Azioni nelle ultime 24h', 'activity')
        );
    };

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        update: (newStats) => {
            Object.assign(stats, newStats);
            render();
        },

        setLoading: (loading) => {
            isLoading = loading;
            render();
        }
    };
};

module.exports = DashboardStats;