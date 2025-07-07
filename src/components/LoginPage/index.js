const { LoginPageElement } = require('./logic');

if (!window.customElements.get('login-page')) {
    window.customElements.define('login-page', LoginPageElement);
}

module.exports = LoginPageElement;