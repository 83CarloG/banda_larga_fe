// app/app.js
"use strict";

// Import our main CSS
import '../styles/main.css';

const router = require('../modules/router');
const { routes, hasRouteAccess } = require('./routes');
const auth = require('../modules/auth');

/**
 * Loads required components
 */
const loadComponents = () => {
    require('../components/LoginPage');
    require('../components/DashboardPage');
    require('../components/UsersPage');
    require('../components/CentersPage');
    require('../components/GuestsPage');

    require('../components/shared/Header');
    require('../components/shared/Footer');
    require('../components/shared/Sidebar');
};

/**
 * Initializes application routes
 */
const initializeRoutes = () => {
    routes.forEach(route => {
        router.addRoute(route.path, {
            component: route.component,
            requiresAuth: route.requiresAuth,
            accessCheck: () => hasRouteAccess(route)
        });
    });
};

/**
 * Initializes application event listeners
 */
const initializeEventListeners = () => {
    // Handle authentication events
    window.addEventListener('auth:login', () => {
        const authState = auth.getAuthState();
        if (authState.user) {
            router.navigate('/dashboard');
        }
    });

    window.addEventListener('auth:logout', () => {
        router.navigate('/');
    });

    // Handle route changes
    window.addEventListener('DOMContentLoaded', () => {
        router.init();
    });
};

/**
 * Initialize the application
 */
const initializeApp = () => {
    loadComponents();
    initializeRoutes();
    initializeEventListeners();
};

// Start the application
initializeApp();

module.exports = { initializeApp };