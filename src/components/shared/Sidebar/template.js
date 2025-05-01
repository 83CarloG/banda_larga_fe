// components/shared/Sidebar/template.js
"use strict";

const auth = require('../../../modules/auth');

/**
 * Menu item configuration with colored icons
 */
const MENU_ITEMS = [
    {
        path: '/dashboard',
        label: 'Home',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#4CAF50"/></svg>',
        permission: 'dashboard'
    },
    {
        path: '/centers',
        label: 'Centri',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#2196F3"/></svg>',
        permission: 'centers'
    },
    {
        path: '/users',
        label: 'Operatori',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#FFC107"/></svg>',
        permission: 'operators'
    },
    {
        path: '/guests',
        label: 'Ospiti',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#9C27B0"/></svg>',
        permission: 'guests'
    },
    {
        path: '/reports',
        label: 'Report',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#FF5722"/></svg>',
        permission: 'reports'
    }
];

/**
 * Creates menu item HTML with colored icons
 */
const createMenuItem = (item) => `
    <li>
        <a href="${item.path}" class="${window.location.pathname === item.path ? 'active' : ''}">
            ${item.icon}
            ${item.label}
        </a>
    </li>
`;

/**
 * Creates sidebar template
 */
const createTemplate = () => {
    const userPermissions = auth.getAuthState().permissions || [];

    const menuItems = MENU_ITEMS
        .filter(item => userPermissions.includes(item.permission))
        .map(createMenuItem)
        .join('');

    return `
        <button class="menu-toggle" aria-label="Toggle menu">☰</button>
        <nav class="sidebar">
            <ul>${menuItems}</ul>
        </nav>
    `;
};

module.exports = createTemplate;