// components/shared/Header/index.js
"use strict";

const auth = require('../../../modules/auth');
const router = require('../../../modules/router');
const api = require('../../../modules/api');
const styles = require('./styles');
const createTemplate = require('./template');

/**
 * Handles logout functionality
 * @param {Event} event - Click event
 */
const handleLogout = async (event) => {
    event.preventDefault();

    try {
        // Call the API logout endpoint
        await api.logout();

        // Clear auth state
        auth.clearAuth();

        // Navigate to login page
        router.navigate('/');

        // Dispatch logout event for other components
        window.dispatchEvent(new Event('auth:logout'));
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

/**
 * Creates header event listeners
 * @param {ShadowRoot} shadow - Shadow DOM root
 */
const setupEventListeners = (shadow) => {
    const logoutButton = shadow.querySelector('#logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
};

/**
 * Updates header with user data
 * @param {ShadowRoot} shadow - Shadow DOM root
 */
const updateUserInfo = (shadow) => {
    const userData = auth.getAuthState().user;
    if (userData) {
        const username = shadow.querySelector('.username');
        if (username) {
            username.textContent = `${userData.first_name} ${userData.last_name}`;
        }
    }
};

class HeaderElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Persist handlers for proper cleanup
        this._onLogin = () => {
            const userData = auth.getAuthState().user;
            if (!userData) return;
            this.style.display = '';
            if (!this.shadowRoot.innerHTML.trim()) {
                this.shadowRoot.innerHTML = `
            <style>${styles()}</style>
            ${createTemplate(userData)}
        `;
                setupEventListeners(this.shadowRoot);
            } else {
                updateUserInfo(this.shadowRoot);
            }
        };

        this._onLogout = () => {
            this.style.display = 'none';
            this.shadowRoot.innerHTML = '';
        };

        window.addEventListener('auth:login', this._onLogin);
        window.addEventListener('auth:logout', this._onLogout);

        // Initial render depending on current auth state
        const userData = auth.getAuthState().user;
        if (!userData) {
            this.style.display = 'none';
            this.shadowRoot.innerHTML = '';
            return;
        }
        this.style.display = '';
        this.shadowRoot.innerHTML = `
            <style>${styles()}</style>
            ${createTemplate(userData)}
        `;
        setupEventListeners(this.shadowRoot);
    }

    disconnectedCallback() {
        // Clean up event listeners
        if (this._onLogin) {
            window.removeEventListener('auth:login', this._onLogin);
        }
        if (this._onLogout) {
            window.removeEventListener('auth:logout', this._onLogout);
        }
    }
}

// Register component
if (!window.customElements.get('header-element')) {
    window.customElements.define('header-element', HeaderElement);
}

module.exports = HeaderElement;