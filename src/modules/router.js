// modules/router.js
"use strict";

const auth = require('./auth');

/**
 * Router state structure
 * @typedef {Object} RouterState
 * @property {Map} routes - Route configurations
 * @property {string} currentPath - Current path
 */

/**
 * Private router state
 */
let routerState = {
    routes: new Map(),
    currentPath: window.location.pathname
};

/**
 * Splits path into segments
 * @param {string} path - URL path
 * @returns {Array<string>} Path segments
 */
const getPathSegments = path =>
    path.split('/').filter(segment => segment.length > 0);

/**
 * Matches route segments with URL segments
 * @param {Array<string>} routeSegments - Route path segments
 * @param {Array<string>} urlSegments - URL path segments
 * @returns {Object|null} Route parameters if matched
 */
const matchRoute = (routeSegments, urlSegments) => {
    if (routeSegments.length !== urlSegments.length) return null;

    return routeSegments.reduce((params, routeSegment, index) => {
        const urlSegment = urlSegments[index];

        if (routeSegment.startsWith(':')) {
            const paramName = routeSegment.slice(1);
            return { ...params, [paramName]: urlSegment };
        }

        return routeSegment === urlSegment ? params : null;
    }, {});
};

/**
 * Finds matching route for path
 * @param {string} path - URL path
 * @returns {Object|null} Matched route configuration
 */
const findRoute = path => {
    const urlSegments = getPathSegments(path);

    for (const [routePath, config] of routerState.routes.entries()) {
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

/**
 * Handles rendering error pages
 * @param {string} type - Error type ('404' or 'error')
 * @param {HTMLElement} container - Container element
 */
const handleErrorPage = (type, container) => {
    if (routerState.routes.has(`/${type}`)) {
        container.innerHTML = '';
        container.appendChild(routerState.routes.get(`/${type}`).component());
    }
};

/**
 * Renders component for current route
 * @param {Object} route - Route configuration
 * @param {HTMLElement} container - Container element
 */
const renderComponent = (route, container) => {
    try {
        const componentFn = route.config.component;
        if (typeof componentFn !== 'function') {
            throw new Error(`Component must be a function`);
        }

        const component = componentFn(route.params);
        console.log('router.renderComponent: appending', component);
        container.innerHTML = '';
        container.appendChild(component);
    } catch (error) {
        console.error('Error rendering component:', error);
        handleErrorPage('error', container);
    }
};

/**
 * Handles route access check and rendering
 * @param {string} pathname - URL pathname
 */
const handleLocation = async pathname => {
    console.log('router.handleLocation called with', pathname);
    const container = document.getElementById("app");
    if (!container) {
        console.error("Container with id 'app' not found!");
        return;
    }

    // Check for authentication and authorization
    const route = findRoute(pathname);
    const isAuthenticated = auth.isAuthenticated();
    const hasAccess = route?.config.accessCheck?.() ?? true;

    const publicRoutes = ['/', '/recovery'];
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        window.history.pushState({}, "", "/");
        const loginRoute = findRoute('/');
        if (loginRoute) {
            renderComponent(loginRoute, container);
        }
        return;
    }

    if (!route) {
        handleErrorPage('404', container);
        return;
    }

    if (!hasAccess) {
        handleErrorPage('403', container);
        return;
    }

    routerState.currentPath = pathname;
    renderComponent(route, container);
};

/**
 * Adds route to router configuration
 * @param {string} path - Route path
 * @param {Object|Function} config - Route configuration or component function
 */
const addRoute = (path, config) => {
    if (typeof config === 'function') {
        routerState.routes.set(path, {
            component: config,
            segments: getPathSegments(path)
        });
    } else {
        routerState.routes.set(path, {
            ...config,
            segments: getPathSegments(path)
        });
    }
};

/**
 * Navigates to specified path
 * @param {string} pathname - Target path
 */
const navigate = pathname => {
    console.log('router.navigate called with', pathname);
    if (window.location.pathname !== pathname) {
        window.history.pushState({}, "", pathname);
        handleLocation(pathname);
    }
};

/**
 * Gets current route configuration
 * @returns {Object|null}
 */
const getCurrentRoute = () =>
    findRoute(routerState.currentPath);

/**
 * Initializes router
 */
const init = () => {
    window.addEventListener("popstate", () =>
        handleLocation(window.location.pathname)
    );
    handleLocation(window.location.pathname);
};

module.exports = {
    addRoute,
    navigate,
    getCurrentRoute,
    init
};