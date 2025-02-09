export function getHeaderTemplate() {
    return `
        <header class="header">
            <div class="logo-section">
                <div class="logo-placeholder">BL</div>
            </div>
            <div class="title">BANDA LARGA</div>
            <div class="user-section">
                <div class="user-info">
                    <div class="avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#65676b">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <span class="username">User Name</span>
                </div>
                <button id="logout">Logout</button>
            </div>
        </header>`;
}