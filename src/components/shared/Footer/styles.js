// components/shared/Footer/styles.js
"use strict";

const styles = () => `
    :host {
        display: block;
        --footer-height: 80px; /* Increased footer height to accommodate larger logo */
        font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .footer {
        background: white;
        border-top: 1px solid #dddfe2;
        padding: 0 16px;
        height: var(--footer-height);
        width: 100%;           /* Use normal content width */
        left: 0;               /* Start at the very left */
        position: relative;    /* Static or relative, not fixed */
        z-index: 98;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-shadow: -1px 0 0 0 #dddfe2; /* Visually connect with sidebar */
    }

    .footer-content {
        display: flex;
        justify-content: space-between; /* Changed to space-between for equal spacing */
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        padding: 0;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #1c1e21;
        font-weight: var(--font-weight-regular, 400);
    }

    .contact-item svg {
        flex-shrink: 0;
    }

    .contact-item .contact-icon {
        color: #65676b;
    }

    .contact-item .custom-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 140px; /* Ensure logo has minimum width */
    }

    @media (max-width: 1024px) {
        .footer {
            width: 100%;
        }
        .footer-content {
            flex-direction: column;
            gap: 16px; /* Increased gap for better spacing in column layout */
            padding: 16px 0;
        }
        .footer {
            height: auto;
            min-height: var(--footer-height);
        }
    }

    @media (max-width: 768px) {
        .footer {
            left: 0;
            width: 100%; /* On mobile, footer takes full width when sidebar is hidden */
        }
        
        .footer-content {
            padding: 16px 8px;
        }

        .contact-item {
            font-size: 13px;
        }
    }
`;

module.exports = styles;