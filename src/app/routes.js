// modules/routes.js
"use strict";

const auth = require('../modules/auth');

/**
 * Creates route configuration object
 */
const createRoute = (path, component, options = {}) => ({
    path,
    component,
    requiresAuth: options.requiresAuth || false,
    requiredPermissions: options.requiredPermissions || [],
    requiredRoles: options.requiredRoles || []
});

/**
 * Checks if user has required access for route
 */
const hasRouteAccess = (route) => {
    if (!route.requiresAuth) return true;
    if (!auth.isAuthenticated()) return false;

    const hasPermissions = route.requiredPermissions.every(
        permission => auth.hasPermission(permission)
    );

    const hasRole = route.requiredRoles.length === 0 ||
        route.requiredRoles.some(role => auth.hasRole(role));

    return hasPermissions && hasRole;
};

/**
 * Application routes configuration
 */
const routes = [
    createRoute('/', () => document.createElement('login-page')),

    createRoute('/dashboard', () => document.createElement('dashboard-page'), {
        requiresAuth: true
    }),

    createRoute('/users', () => document.createElement('users-page'), {
        requiresAuth: true,
        requiredPermissions: ['operators'],
        requiredRoles: ['administrator'],

    }),

    createRoute('/centers', () => document.createElement('centers-page'), {
        requiresAuth: true,
        requiredPermissions: ['centers'],
        requiredRoles: ['administrator', 'supervisor']
    }),

    createRoute('/guests', () => document.createElement('guests-page'), {
        requiresAuth: true,
        requiredPermissions: ['guests'],
        requiredRoles: ['administrator', 'supervisor', 'data_entry']
    }),

    createRoute('/reports', () => document.createElement('reports-page'), {
        requiresAuth: true,
        requiredPermissions: ['view_reports']
    }),

    createRoute('/recovery', () => document.createElement('recovery-page')),
];

module.exports = {
    routes,
    hasRouteAccess
};