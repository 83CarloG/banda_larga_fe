const { RecoveryPageElement } = require('./logic');

if (!window.customElements.get('recovery-page')) {
    window.customElements.define('recovery-page', RecoveryPageElement);
}

module.exports = RecoveryPageElement; 