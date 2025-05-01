// components/shared/Header/template.js
"use strict";
const logoImage = require('/src/assets/img/4@2x.png');
const createTemplate = (userData = {}) => `
    <header class="header">
        <div class="logo-section">
        </div>
        <div class="header-logo">
            <!-- Using an img tag instead of inline SVG for simplicity -->
            <img src=${logoImage} alt="Banda Larga" class="banda-larga-logo" />
        </div>
        <div class="user-section">
            <div class="user-info">
                <div class="avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#65676b">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <span class="username">${userData.first_name || 'User'} ${userData.last_name || ''}</span>
            </div>
            <button id="logout">Logout</button>
        </div>
    </header>
`;

module.exports = createTemplate;