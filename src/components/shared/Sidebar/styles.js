// components/shared/Sidebar/styles.js
"use strict";

const styles = () => `
    :host {
        display: block;
        --header-height: 64px;
        --footer-height: 64px;
        --sidebar-width: 160px;
        --primary-color: #1877f2;
        --bg-color: #f0f2f5;
    }

    .sidebar {
        width: var(--sidebar-width);
        height: calc(100vh - var(--header-height));
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: fixed;
        left: 0;
        top: var(--header-height);
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease;
        overflow-y: auto;
        z-index: 99;
    }

    /* Custom scrollbar */
    .sidebar::-webkit-scrollbar {
        width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
        background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }

    .menu-toggle {
        display: none;
        position: fixed;
        top: calc(var(--header-height) + 16px);
        left: 16px;
        z-index: 101;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin: 4px 8px;
    }

    a {
        color: #050505;
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        padding: 12px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        transition: background-color 0.2s;
    }

    a:hover {
        background-color: var(--bg-color);
    }

    a svg {
        margin-right: 12px;
    }

    /* Active link styles */
    a.active {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }

    /* Main content area */
    .main-content {
    flex: 1;
    padding: 24px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: var(--footer-height); /* Additional margin to prevent content from being hidden by footer */
}

    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            width: 240px;
        }

        .sidebar.active {
            transform: translateX(0);
        }

        .menu-toggle {
            display: block;
        }

        .main-content {
            margin-left: 0;
        }

        /* Add overlay when sidebar is active */
        .sidebar.active::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }
    }
`;

module.exports = styles;