"use strict";

// src/app/components/LoginPage/index.js

const api = require('../../modules/api.js');
const cookie = require('../../modules/cookies.js');
const router = require('../../modules/router.js');

/**
 * Web Component for the login page.
 */
class LoginPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector("#loginForm").addEventListener("submit", (event) => this.handleLogin(event));
    }

    /**
     * Renders the login form inside the shadow DOM.
     */
    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
            .login-container { max-width: 400px; margin: 40px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: sans-serif; }
            .login-container h2 { text-align: center; }
            .login-container form { display: flex; flex-direction: column; gap: 10px; }
            .login-container input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
            .login-container button { padding: 10px; background: #007bff; color: #fff; border: none; cursor: pointer; }
            .login-container button:hover { background: #0056b3; }
            .error { color: red; text-align: center; }
        </style>
        <div class="login-container">
            <h2>Login</h2>
            <form id="loginForm">
                <label for="username">Username:</label>
                <input type="text" id="username" required />
                <label for="password">Password:</label>
                <input type="password" id="password" required />
                <button type="submit">Login</button>
            </form>
            <div id="error" class="error"></div>
        </div>`;
    }

    /**
     * Handles the login logic, prevents default form submission,
     * calls API, sets cookie, and navigates to the dashboard.
     */
    handleLogin(event) {
        event.preventDefault();
        const username = this.shadowRoot.querySelector("#username").value;
        const password = this.shadowRoot.querySelector("#password").value;
        const errorDiv = this.shadowRoot.querySelector("#error");
        errorDiv.textContent = "";

        api.login(username, password)
            .then((response) => {
                cookie.setCookie("jwt", response.token, 10);
                router.navigate("/dashboard");
            })
            .catch(() => {
                errorDiv.textContent = "Invalid username or password.";
            });
    }
}

// Define the custom element if not already registered
if (!window.customElements.get("login-page")) {
    window.customElements.define("login-page", LoginPageElement);
}

