"use strict";

const routes = [
    {
        path: '/',
        component: () => document.createElement('login-page'),
        requiresAuth: false
    },
    {
        path: '/dashboard',
        component: () => document.createElement('dashboard-page'),
        requiresAuth: true
    }
];

module.exports = routes;
