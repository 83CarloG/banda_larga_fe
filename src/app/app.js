"use strict";

const router = require('../modules/router.js');
require('../components/Header/index.js'); // Assicura che i componenti vengano registrati
require('../components/Footer/index.js'); // Prima di essere usati
require('../components/DashboardPage/index.js');
require('../components/LoginPage/index.js');

// Define routes
router.addRoute("/", () => document.createElement("login-page"));
router.addRoute("/dashboard", () => document.createElement("dashboard-page"));

// Initialize router on page load
document.addEventListener("DOMContentLoaded", function() {
    router.init();
});
