// components/shared/Footer/styles.js
"use strict";

const styles = () => `
    :host {
        display: block;
        --footer-height: 64px;
    }

    .footer {
        background: white;
        border-top: 1px solid #dddfe2;
        padding: 0 16px;
        height: var(--footer-height);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 98;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }

    .footer-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 280px 0 0;
        width: 100%;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #1c1e21;
    }

    .contact-item svg {
        flex-shrink: 0;
        color: #65676b;
    }

    @media (max-width: 1024px) {
        .footer-content {
            flex-direction: column;
            gap: 8px;
            padding: 8px 0;
        }

        .footer {
            height: auto;
            min-height: var(--footer-height);
        }
    }

    @media (max-width: 768px) {
        .footer-content {
            padding: 8px;
        }

        .contact-item {
            font-size: 13px;
        }
    }
`;

module.exports = styles;