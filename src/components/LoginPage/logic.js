const api = require('../../modules/api');
const router = require('../../modules/router');
const auth = require('../../modules/auth');
const { createTemplate } = require('./template');
const loginPageStyles = require('./styles');

const getFormElements = root => ({
    form: root.querySelector('#loginForm'),
    emailInput: root.querySelector('#email'),
    passwordInput: root.querySelector('#password'),
    submitButton: root.querySelector('button[type="submit"]'),
    errorDiv: root.querySelector('#error'),
    recoverLink: root.querySelector('#recoverEmailLink')
});

const setLoading = (submitButton, isLoading) => {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
};

const showError = (errorDiv, message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
};

const clearError = errorDiv => {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
};

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

class LoginPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>${loginPageStyles}</style>
            ${createTemplate()}
        `;
        const elements = getFormElements(this.shadowRoot);
        elements.form.addEventListener('submit', event => handleSubmit(event, elements));
        elements.recoverLink.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Password recovery feature coming soon. Please contact support.');
        });
    }
}

module.exports = {
    getFormElements,
    setLoading,
    showError,
    clearError,
    handleSubmit,
    LoginPageElement
}; 