"use strict";

const api = require('../../modules/api.js');
const router = require('../../modules/router.js');
const cookie = require('../../modules/cookies.js');

/**
 * Custom element that handles the login page functionality
 * @extends HTMLElement
 */
class LoginPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Lifecycle callback when element is added to DOM
     */
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for form submission and password recovery
     */
    setupEventListeners() {
        const form = this.shadowRoot.querySelector("#loginForm");
        let isSubmitting = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (isSubmitting) return;

            try {
                isSubmitting = true;
                this.setLoading(true);
                this.clearError();

                const email = this.shadowRoot.querySelector("#email").value;
                const password = this.shadowRoot.querySelector("#password").value;

                const response = await api.login(email, password);

                if (response?.data?.data?.token) {
                    const { token_type, token } = response.data.data;
                    const fullToken = `${token_type} ${token}`;
                    await cookie.setAuthCookie(fullToken);
                    router.navigate("/dashboard");
                }
            } catch (error) {
                this.showError(error.message || 'Login failed. Please check your email and password.');
            } finally {
                isSubmitting = false;
                this.setLoading(false);
            }
        });

        const recoverButton = this.shadowRoot.querySelector("#recoverEmailButton");
        recoverButton.addEventListener("click", () => {
            alert("Email recovery functionality coming soon. Please contact support.");
        });
    }

    /**
     * Updates the loading state of the submit button
     * @param {boolean} isLoading - Whether the form is currently submitting
     */
    setLoading(isLoading) {
        const button = this.shadowRoot.querySelector('button[type="submit"]');
        button.disabled = isLoading;
        button.textContent = isLoading ? 'Logging in...' : 'Login';
    }

    /**
     * Displays an error message to the user
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = this.shadowRoot.querySelector("#error");
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    /**
     * Clears any displayed error messages
     */
    clearError() {
        const errorDiv = this.shadowRoot.querySelector("#error");
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    /**
     * Renders the login form with styles
     */
    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
            .login-container { 
                max-width: 400px; 
                margin: 40px auto; 
                padding: 20px; 
                background: #fff; 
                border-radius: 8px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                font-family: sans-serif; 
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: .5rem;
            }
            .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            button {
                width: 100%;
                padding: 10px;
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            }
            button:disabled {
                background: #cccccc;
                cursor: not-allowed;
            }
            .error {
                color: #dc3545;
                margin-top: 1rem;
                text-align: center;
                display: none;
            }
        </style>
        <div class="login-container">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required autocomplete="email" />
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" required autocomplete="current-password" />
                </div>
                <button type="submit">Login</button>
            </form>
            <button id="recoverEmailButton" type="button">Recover Email</button>
            <div id="error" class="error"></div>
        </div>`;
    }
}

if (!window.customElements.get("login-page")) {
    window.customElements.define("login-page", LoginPageElement);
}