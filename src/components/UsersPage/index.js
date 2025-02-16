import { getTemplate } from "./usersTemplate.js";
import { getStyles } from "./usersStyles.js";
import cookie from "../../modules/cookies.js";
import router from "../../modules/router.js";

class UsersPageElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${getStyles()}</style>
            ${getTemplate()}
        `;
    }
}

customElements.define("users-page", UsersPageElement);