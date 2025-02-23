// components/shared/Sidebar/template.js
"use strict";

const auth = require('../../../modules/auth');

/**
 * Menu item configuration
 */
const MENU_ITEMS = [
    {
        path: '/dashboard',
        label: 'Home',
        icon: '<path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>',
        permission: 'dashboard'
    },
    {
        path: '/centers',
        label: 'Centri',
        icon: '<circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />',
        permission: 'centers'
    },
    {
        path: '/operators',
        label: 'Operatori',
        icon: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
        permission: 'operators'
    },
    {
        path: '/guests',
        label: 'Ospiti',
        icon: '<path d="M7 11c1.66 0 3-1.34 3-3S8.66 5 7 5S4 6.34 4 8s1.34 3 3 3zm0 1.5c-2 0-6 1-6 3V17h12v-1.5c0-2-4-3-6-3z"/>',
        permission: 'guests'
    },
    {
        path: '/reports',
        label: 'Report',
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
        permission: 'reports'
    }
];

/**
 * Creates menu item HTML
 */
const createMenuItem = (item) => `
    <li>
        <a href="${item.path}">
            <svg width="24" height="24" viewBox="0 0 24 24" 
                 fill="${item.path === '/centers' ? 'none' : 'currentColor'}" 
                 stroke="${item.path === '/centers' ? 'currentColor' : 'none'}" 
                 stroke-width="2" 
                 stroke-linecap="round" 
                 stroke-linejoin="round">
                ${item.icon}
            </svg>
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