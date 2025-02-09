import { getFooterTemplate } from "./footerTemplate.js";
import { getFooterStyles } from "./footerStyles.js";

class FooterElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${getFooterStyles()}</style>
            ${getFooterTemplate()}
        `;
    }
}

if (!window.customElements.get("footer-element")) {
    window.customElements.define("footer-element", FooterElement);
}