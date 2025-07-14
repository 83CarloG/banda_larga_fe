const { createTemplate } = require('./template');
const recoveryPageStyles = require('./styles');
const router = require('../../modules/router');

const getFormElements = root => ({
    form: root.querySelector('#recoveryForm'),
    emailInput: root.querySelector('#email'),
    submitButton: root.querySelector('button[type="submit"]'),
    messageDiv: root.querySelector('#message'),
    backToLoginLink: root.querySelector('#backToLoginLink')
});

const setLoading = (submitButton, isLoading) => {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Invio...' : 'Invia link di recupero';
};

const showMessage = (messageDiv, message, isError = false) => {
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.background = isError ? '#fff5f5' : '#e6ffed';
    messageDiv.style.color = isError ? '#dc3545' : '#198754';
    messageDiv.style.borderLeft = isError ? '4px solid #dc3545' : '4px solid #198754';
};

const clearMessage = messageDiv => {
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
};

const handleSubmit = async (event, elements) => {
    event.preventDefault();
    const { emailInput, submitButton, messageDiv } = elements;
    setLoading(submitButton, true);
    clearMessage(messageDiv);
    try {
        const response = await fetch('https://dacosta-vm.nubilaria.corp/banda_larga_backend/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email: emailInput.value }),
        });
        if (response.ok) {
            showMessage(messageDiv, "Se l'email è registrata, riceverai un link per il recupero della password.", false);
        } else {
            const data = await response.json();
            showMessage(messageDiv, data.message || "Errore durante l'invio della richiesta.", true);
        }
    } catch (err) {
        showMessage(messageDiv, 'Errore di rete.', true);
    } finally {
        setLoading(submitButton, false);
    }
};

class RecoveryPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>${recoveryPageStyles}</style>
            ${createTemplate()}
        `;
        const elements = getFormElements(this.shadowRoot);
        elements.form.addEventListener('submit', event => handleSubmit(event, elements));
        elements.backToLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            router.navigate('/');
        });
    }
}

if (!window.customElements.get('recovery-page')) {
    window.customElements.define('recovery-page', RecoveryPageElement);
}

module.exports = { RecoveryPageElement }; 