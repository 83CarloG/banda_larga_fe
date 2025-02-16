"use strict";

const router = require('../modules/router.js');
const routes = require('./routes.js');

require('../components/Header/index.js');
require('../components/Footer/index.js');
require('../components/DashboardPage/index.js');
require('../components/Sidebar/index.js');
require('../components/LoginPage/index.js');

class App {
    constructor() {
        this.initializeRouter();
        this.setupEventListeners();
    }

    initializeRouter() {
        // Register routes from configuration (pass the entire route object)
        routes.forEach(route => {
            router.addRoute(route.path, {
                component: route.component,
                requiresAuth: route.requiresAuth !== undefined ? route.requiresAuth : (route.auth || false)
            });
        });
    }

    setupEventListeners() {
        window.addEventListener('DOMContentLoaded', () => {
            router.init();
        });
    }
}

const app = new App();
module.exports = app;
