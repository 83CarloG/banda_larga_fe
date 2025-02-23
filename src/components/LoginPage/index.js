// components/LoginPage/index.js
"use strict";

const api = require('../../modules/api');
const router = require('../../modules/router');
const auth = require('../../modules/auth');

/**
 * Login form styles
 */
const styles = `
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
`;

/**
 * Creates login form template
 */
const createTemplate = () => `
    <style>${styles}</style>
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
    </div>
`;

/**
 * Gets form elements
 */
const getFormElements = root => ({
    form: root.querySelector('#loginForm'),
    emailInput: root.querySelector('#email'),
    passwordInput: root.querySelector('#password'),
    submitButton: root.querySelector('button[type="submit"]'),
    errorDiv: root.querySelector('#error'),
    recoverButton: root.querySelector('#recoverEmailButton')
});

/**
 * Updates loading state
 */
const setLoading = (submitButton, isLoading) => {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
};

/**
 * Shows error message
 */
const showError = (errorDiv, message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
};

/**
 * Clears error message
 */
const clearError = errorDiv => {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
};

/**
 * Handles form submission
 */
const handleSubmit = async (event, elements) => {
    event.preventDefault();

    const { emailInput, passwordInput, submitButton, errorDiv } = elements;

    setLoading(submitButton, true);
    clearError(errorDiv);

    try {
        await api.login(emailInput.value, passwordInput.value);

        if (auth.isAuthenticated()) {
            router.navigate('/dashboard');
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        showError(errorDiv, error.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoading(submitButton, false);
    }
};

/**
 * Login page web component
 */
class LoginPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = createTemplate();
        const elements = getFormElements(this.shadowRoot);

        elements.form.addEventListener('submit', event =>
            handleSubmit(event, elements)
        );

        elements.recoverButton.addEventListener('click', () =>
            alert('Password recovery feature coming soon. Please contact support.')
        );
    }
}

// Register component if not already registered
if (!window.customElements.get('login-page')) {
    window.customElements.define('login-page', LoginPageElement);
}