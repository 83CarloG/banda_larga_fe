// components/shared/Sidebar/index.js
"use strict";

const router = require('../../../modules/router');
const styles = require('./styles');
const createTemplate = require('./template');

/**
 * Handles link clicks with active state management
 * @param {Event} event - Click event
 */
const handleLinkClick = (event) => {
    const link = event.target.closest('a');
    if (link) {
        event.preventDefault();

        // Update active state on all links
        const allLinks = document.querySelectorAll('sidebar-element').forEach(sidebar => {
            const links = sidebar.shadowRoot.querySelectorAll('.sidebar a');
            links.forEach(a => a.classList.remove('active'));
        });

        // Set active state on clicked link
        link.classList.add('active');

        // Navigate to the route
        router.navigate(link.getAttribute('href'));

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            const sidebar = link.closest('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }
    }
};

/**
 * Handles menu toggle
 * @param {ShadowRoot} shadow - Shadow DOM root
 */
const handleMenuToggle = (shadow) => {
    const sidebar = shadow.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
};

/**
 * Sets up event listeners
 * @param {ShadowRoot} shadow - Shadow DOM root
 */
const setupEventListeners = (shadow) => {
    // Menu toggle
    shadow.querySelector('.menu-toggle')?.addEventListener('click', () =>
        handleMenuToggle(shadow)
    );

    // Link navigation
    shadow.querySelector('.sidebar')?.addEventListener('click', handleLinkClick);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 &&
            !shadow.contains(event.target)) {
            shadow.querySelector('.sidebar')?.classList.remove('active');
        }
    });
};

/**
 * Sets initial active state based on current path
 * @param {ShadowRoot} shadow - Shadow DOM root
 */
const setInitialActiveState = (shadow) => {
    const currentPath = window.location.pathname;
    const links = shadow.querySelectorAll('.sidebar a');

    links.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

class SidebarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>${styles()}</style>
            ${createTemplate()}
        `;
        setupEventListeners(this.shadowRoot);
        setInitialActiveState(this.shadowRoot);

        // Listen for route changes to update active state
        window.addEventListener('popstate', () => {
            setInitialActiveState(this.shadowRoot);
        });
    }

    disconnectedCallback() {
        // Clean up event listeners when component is removed
        window.removeEventListener('popstate', () => {
            setInitialActiveState(this.shadowRoot);
        });
    }
}

// Register component
if (!window.customElements.get('sidebar-element')) {
    window.customElements.define('sidebar-element', SidebarElement);
}

module.exports = SidebarElement;