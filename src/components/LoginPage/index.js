// components/LoginPage/index.js
"use strict";

const api = require('../../modules/api');
const router = require('../../modules/router');
const auth = require('../../modules/auth');
const logoImage = require('/src/assets/img/1@2x.png');

/**
 * Login form styles - Updated with Poppins font
 */
const styles = `
    :host { display: block; }
    .login-container { 
        max-width: 400px; 
        margin: 80px auto; 
        padding: 32px; 
        background: #fff; 
        border-radius: 12px; 
        box-shadow: 0 8px 16px rgba(0,0,0,0.1); 
        font-family: var(--font-family, 'Poppins', sans-serif);
    }
    .login-header {
        text-align: center;
        margin-bottom: 32px;
    }
    .login-logo {
        margin-bottom: 8px;
    }
    .login-logo img {
        max-width: 100%;
        height: auto;
    }
    .login-title {
        font-size: 20px;
        font-weight: var(--font-weight-medium, 500);
        color: var(--text-color, #1e293b);
        margin-bottom: 8px;
    }
    .login-subtitle {
        font-size: 14px;
        color: var(--text-secondary, #64748b);
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: var(--font-weight-medium, 500);
        font-size: 14px;
    }
    .form-group input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-sizing: border-box;
        font-family: var(--font-family, 'Poppins', sans-serif);
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-group input:focus {
        outline: none;
        border-color: var(--primary-color, #1877f2);
        box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.2);
    }
    button {
        width: 100%;
        padding: 12px;
        background: var(--primary-color, #1877f2);
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: var(--font-family, 'Poppins', sans-serif);
        font-weight: var(--font-weight-medium, 500);
        font-size: 16px;
        transition: background 0.2s;
    }
    button:hover {
        background: #0d6efd;
    }
    button:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }
    .recovery-button {
        display: block;
        text-align: center;
        margin-top: 16px;
        color: #fff;
        text-decoration: none;
        font-size: 14px;
        font-weight: var(--font-weight-medium, 500);
    }
    .recovery-button:hover {
        text-decoration: underline;
    }
    .error {
        color: #dc3545;
        margin-top: 20px;
        text-align: center;
        display: none;
        padding: 12px;
        background: #fff5f5;
        border-radius: 8px;
        border-left: 4px solid #dc3545;
        font-size: 14px;
    }
`;

/**
 * Creates login form template
 */
const createTemplate = () => `
    <style>${styles}</style>
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">
                <img src="${logoImage}" alt="Banda Larga" />
            </div>
        </div>
        
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
        <button id="recoverEmailButton" type="button" class="recovery-button">Password dimenticata?</button>
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

module.exports = LoginPageElement;