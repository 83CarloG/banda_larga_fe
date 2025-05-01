// components/shared/Header/styles.js
"use strict";

const styles = () => `
    :host {
        display: block;
        --header-height: 56px;
        font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .header {
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        height: var(--header-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        box-sizing: border-box;
    }

    .logo-section {
        display: flex;
        align-items: center;
        margin-left: 280px;
    }

    
    .title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        color: var(--primary-color, #1877f2);
        font-size: 24px;
        font-weight: var(--font-weight-bold, 700);
        white-space: nowrap;
        letter-spacing: 0.5px;
    }

    .user-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-right: 16px;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .user-info:hover {
        background-color: #f0f2f5;
    }

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e4e6eb;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .username {
        font-size: 16px; /* Increased to minimum */
        font-weight: var(--font-weight-medium, 500);
        color: #050505;
    }

    #logout {
        background-color: #e4e6eb;
        color: #050505;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: var(--font-weight-medium, 500);
        cursor: pointer;
        transition: background-color 0.2s;
        font-family: var(--font-family, 'Poppins', sans-serif);
    }

    #logout:hover {
        background-color: #d8dadf;
    }

    @media (max-width: 768px) {
        .logo-section {
            margin-left: 0;
        }

        .username {
            display: none;
        }

        .title {
            font-size: 20px;
        }
    }
`;

module.exports = styles;