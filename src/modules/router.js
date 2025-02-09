"use strict";

const cookie = require('../modules/cookies.js');

/**
 * Creates a client-side router for handling navigation.
 */
const createRouter = () => {
    const routes = {};
    let lastPath = window.location.pathname;

    /**
     * Handles navigation updates.
     */
    const handleLocation = (pathname) => {
        const appDiv = document.getElementById("app");
        if (!appDiv) return console.error("Container with id 'app' not found!");

        const isAuthenticated = !!cookie.getCookie("jwt");

        if (pathname === "/dashboard" && !isAuthenticated) {
            window.history.replaceState({}, "", "/");
            setTimeout(() => router.navigate("/"), 100);
            return;
        }

        lastPath = pathname;
        appDiv.innerHTML = "";
        appDiv.appendChild(routes[pathname] ? routes[pathname]() : routes["/"]());
    };

    const router = {
        /**
         * Registers a new route.
         */
        addRoute: (pathname, callback) => { routes[pathname] = callback; },

        /**
         * Navigates to a new path.
         */
        navigate: (pathname) => {
            if (window.location.pathname !== pathname) {
                window.history.pushState({}, "", pathname);
                handleLocation(pathname);
            }
        },

        /**
         * Initializes router event listeners.
         */
        init: () => {
            window.addEventListener("popstate", () => handleLocation(window.location.pathname));
            handleLocation(window.location.pathname);
        }
    };

    return router;
};

const router = createRouter();
module.exports = router;
