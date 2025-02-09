export function getTemplate() {
    return `
        <div class="container">
            <header-element></header-element>
            <button class="menu-toggle" aria-label="Toggle menu">☰</button>
            <nav class="sidebar">
                <ul>
                    <li><a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px">
                            <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                        </svg>
                        Home
                    </a></li>
                    <li><a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Users
                    </a></li>
                </ul>
            </nav>
            <div class="content-wrapper">
                <div class="main-content">
                    <h2>Welcome to Dashboard</h2>
                </div>
                <footer-element></footer-element>
            </div>
        </div>`;
}