class SidebarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            .sidebar { width: 250px; height: 100vh; background: #333; color: white; position: fixed; left: 0; top: 0; padding: 20px; }
            ul { list-style: none; padding: 0; }
            li { margin: 15px 0; }
            a { color: white; text-decoration: none; font-size: 18px; }
        </style>
        <nav class="sidebar">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Users</a></li>
            </ul>
        </nav>`;
    }
}

if (!window.customElements.get("sidebar-element")) {
    window.customElements.define("sidebar-element", SidebarElement);
}