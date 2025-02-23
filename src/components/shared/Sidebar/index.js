// components/shared/Sidebar/index.js
"use strict";

const router = require('../../../modules/router');
const styles = require('./styles');
const createTemplate = require('./template');

/**
 * Handles link clicks
 * @param {Event} event - Click event
 */
const handleLinkClick = (event) => {
    const link = event.target.closest('a');
    if (link) {
        event.preventDefault();
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
    }
}

// Register component
if (!window.customElements.get('sidebar-element')) {
    window.customElements.define('sidebar-element', SidebarElement);
}

module.exports = SidebarElement;