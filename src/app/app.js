// app/app.js
"use strict";

// Import our main CSS
require('../styles/main.css');

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
 * Controls visibility of header/footer based on route and auth state
 */
const updateHeaderFooterVisibility = () => {
    const header = document.querySelector('header-element');
    const footer = document.querySelector('footer-element');
    const isLoginPage = window.location.pathname === '/';
    if (header) header.style.display = isLoginPage ? 'none' : '';
    if (footer) footer.style.display = isLoginPage ? 'none' : '';
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
        updateHeaderFooterVisibility();
    });

    window.addEventListener('auth:logout', () => {
        router.navigate('/');
        updateHeaderFooterVisibility();
    });

    // Handle route changes
    window.addEventListener('DOMContentLoaded', () => {
        router.init();
        updateHeaderFooterVisibility();
    });

    window.addEventListener('popstate', () => {
        updateHeaderFooterVisibility();
    });

    // Optionally, listen for custom navigation events if used
    window.addEventListener('route:change', () => {
        updateHeaderFooterVisibility();
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

// After every navigation, also update header/footer visibility
const originalNavigate = router.navigate;
router.navigate = function(pathname) {
    originalNavigate.call(router, pathname);
    updateHeaderFooterVisibility();
};

module.exports = { initializeApp };