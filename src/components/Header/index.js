import { getHeaderTemplate } from "./headerTemplate.js";
import { getHeaderStyles } from "./headerStyles.js";
import cookie from "../../modules/cookies.js";
import router from "../../modules/router.js";

class HeaderElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.shadowRoot.querySelector("#logout")
            .addEventListener("click", () => this.handleLogout());
    }

    handleLogout() {
        cookie.setCookie("jwt", "", -1);
        router.navigate("/");
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${getHeaderStyles()}</style>
            ${getHeaderTemplate()}
        `;
    }
}

if (!window.customElements.get("header-element")) {
    window.customElements.define("header-element", HeaderElement);
}