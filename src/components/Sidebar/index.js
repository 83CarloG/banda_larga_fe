import { getTemplate } from "./sidebarTemplate.js";
import { getStyles } from "./sidebarStyles.js";

class SideBarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
        const sidebar = this.shadowRoot.querySelector(".sidebar");

        menuToggle?.addEventListener("click", () => {
            sidebar?.classList.toggle("active");
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 &&
                !this.shadowRoot.contains(e.target) &&
                sidebar?.classList.contains("active")) {
                sidebar.classList.remove("active");
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${getStyles()}</style>
            ${getTemplate()}
        `;
    }
}

customElements.define("sidebar-element", SideBarElement);