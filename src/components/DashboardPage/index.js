// components/DashboardPage/index.js
"use strict";

// require('./DashboardPage.css'); // No longer needed, styles are injected via JS
const StatefulComponent = require('../base/StateFullComponent');
const auth = require('../../modules/auth');
const DashboardStats = require('./dashboardStats');
const DashboardCharts = require('./dashboardCharts');
const { createDashboardTemplate } = require('./dashboardTemplate');

class DashboardPageElement extends StatefulComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize state
        this.initState({
            isLoading: true,
            error: null,
            stats: {
                activeUsers: 0,
                totalCenters: 0,
                pendingTasks: 0,
                recentActivity: 0
            },
            chartData: {
                userActivity: [],
                centerDistribution: []
            }
        });

        // Bind methods to maintain context
        this.checkUserRole = this.checkUserRole.bind(this);
        this.fetchDashboardData = this.fetchDashboardData.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        // Initial render
        this.render();

        // Fetch data
        this.fetchDashboardData();
    }

    /**
     * Check if user is not data entry
     * @returns {boolean} True if user is not data entry
     */
    checkUserRole() {
        const authState = auth.getAuthState();
        return authState.role && authState.role.role_name !== 'Data Entry';
    }

    /**
     * Fetch dashboard data from API
     */
    async fetchDashboardData() {
        try {
            this.setState({ isLoading: true, error: null });

            // In a real application, we would fetch this data from an API
            // For this example, we'll simulate a delay and return mock data
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock data for demonstration
            const statsData = {
                activeUsers: 16,
                totalCenters: 6,
                pendingTasks: 8,
                recentActivity: 24
            };

            const chartData = {
                userActivity: [
                    { month: 'Gen', count: 12 },
                    { month: 'Feb', count: 19 },
                    { month: 'Mar', count: 15 },
                    { month: 'Apr', count: 22 },
                    { month: 'Mag', count: 30 },
                    { month: 'Giu', count: 25 }
                ],
                centerDistribution: [
                    { name: 'Centro A', value: 35 },
                    { name: 'Centro B', value: 25 },
                    { name: 'Centro C', value: 20 },
                    { name: 'Centro D', value: 10 },
                    { name: 'Centro E', value: 5 },
                    { name: 'Centro F', value: 5 }
                ]
            };

            this.setState({
                stats: statsData,
                chartData: chartData,
                isLoading: false
            });
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to fetch dashboard data',
                isLoading: false
            });
            console.error("Error fetching dashboard data:", error);
        }
    }

    render() {
        const state = this.getState();
        const canViewAdvanced = this.checkUserRole();

        // Use template to create HTML
        this.shadowRoot.innerHTML = createDashboardTemplate(state, canViewAdvanced);

        // Setup components after DOM is updated
        this.setupComponents();
    }

    setupComponents() {
        const { stats, chartData, isLoading } = this.getState();
        const canViewAdvanced = this.checkUserRole();

        // Get container elements
        const statsContainer = this.shadowRoot.querySelector('#stats-container');
        const chartsContainer = this.shadowRoot.querySelector('#charts-container');

        if (!statsContainer) return;

        // Create dashboard stats component
        const dashboardStats = DashboardStats({
            stats,
            isLoading
        });

        // Add stats to container
        statsContainer.innerHTML = '';
        statsContainer.appendChild(dashboardStats.getElement());

        // Add charts if user has permissions
        if (canViewAdvanced && chartsContainer) {
            const dashboardCharts = DashboardCharts({
                chartData,
                isLoading
            });

            chartsContainer.innerHTML = '';
            chartsContainer.appendChild(dashboardCharts.getElement());
        }
    }
}

// Register component
if (!window.customElements.get('dashboard-page')) {
    window.customElements.define('dashboard-page', DashboardPageElement);
}

module.exports = DashboardPageElement;