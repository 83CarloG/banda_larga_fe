"use strict";

const styles = require('./styles');
const createTemplate = require('./template');

class FooterElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>${styles()}</style>
            ${createTemplate()}
        `;
    }
}

// Register component
if (!window.customElements.get('footer-element')) {
    window.customElements.define('footer-element', FooterElement);
}

module.exports = FooterElement;