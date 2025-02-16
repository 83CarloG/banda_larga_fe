"use strict";

const cookie = require('../modules/cookies.js');

/**
 * Creates a client-side router with nested routes support.
 */
const createRouter = () => {
    const routes = new Map();
    let currentPath = window.location.pathname;
    let routerInstance; // Reference to store the router instance

    const getPathSegments = (path) => {
        return path.split('/').filter(segment => segment.length > 0);
    };

    const matchRoute = (routeSegments, urlSegments) => {
        if (routeSegments.length !== urlSegments.length) return null;

        const params = {};

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const urlSegment = urlSegments[i];

            if (routeSegment.startsWith(':')) {
                const paramName = routeSegment.slice(1);
                params[paramName] = urlSegment;
                continue;
            }

            if (routeSegment !== urlSegment) return null;
        }

        return params;
    };

    const findRoute = (path) => {
        const urlSegments = getPathSegments(path);

        for (const [routePath, config] of routes.entries()) {
            const routeSegments = getPathSegments(routePath);
            const params = matchRoute(routeSegments, urlSegments);

            if (params !== null) {
                return {
                    config,
                    params,
                    matches: urlSegments
                };
            }
        }

        return null;
    };
    console.log('App container:', document.getElementById("app"));

    const handleLocation = async (pathname) => {
        const appDiv = document.getElementById("app");
        if (!appDiv) return console.error("Container with id 'app' not found!");

        const isAuthenticated = !!cookie.getAuthCookie();
        console.log('Current path:', pathname);
        console.log('Is authenticated:', isAuthenticated);
        console.log('Auth cookie value:', cookie.getAuthCookie());

        const route = findRoute(pathname);
        console.log('Found route:', route);

        // Handle 404
        if (!route) {
            if (routes.has('/404')) {
                appDiv.innerHTML = '';
                appDiv.appendChild(routes.get('/404').component());
                return;
            }
            console.error(`No route found for ${pathname}`);
            return;
        }

        // Handle authentication
        if (route.config.requiresAuth && !isAuthenticated) {
            console.log('Authentication required but user not authenticated');
            window.history.replaceState({}, "", "/");
            routerInstance.navigate("/");
            return;
        }

        currentPath = pathname;
        appDiv.innerHTML = '';

        try {
            const componentFn = route.config.component;
            if (typeof componentFn !== 'function') {
                throw new Error(`Component for route ${pathname} must be a function`);
            }
            console.log('Creating component for path:', pathname);
            const component = componentFn(route.params);
            console.log('Created component:', component);
            appDiv.appendChild(component);
        } catch (error) {
            console.error('Error rendering component:', error);
            if (routes.has('/error')) {
                appDiv.appendChild(routes.get('/error').component());
            }
        }
    };

    routerInstance = {
        addRoute: (path, config) => {
            if (typeof config === 'function') {
                routes.set(path, {
                    component: config,
                    segments: getPathSegments(path)
                });
            } else {
                routes.set(path, {
                    ...config,
                    segments: getPathSegments(path)
                });
            }
        },

        navigate: (pathname) => {
            if (window.location.pathname !== pathname) {
                window.history.pushState({}, "", pathname);
                handleLocation(pathname);
            }
        },

        getCurrentRoute: () => findRoute(currentPath),

        init: () => {
            window.addEventListener("popstate", () =>
                handleLocation(window.location.pathname)
            );
            handleLocation(window.location.pathname);
        }
    };

    return routerInstance;
};

module.exports = createRouter();
