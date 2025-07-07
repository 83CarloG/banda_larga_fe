"use strict";

const styles = () => `
    :host {
        --primary-color: #406B7E;
        --success-color: #16a34a;
        --danger-color: #dc2626;
        --warning-color: #ca8a04;
        --text-color: #1e293b;
        --border-color: #e2e8f0;
        --background-light: #f8fafc;
        --spacing-unit: 0.5rem;
        display: block;
        font-family: 'Poppins', system-ui, sans-serif;
    }

    .dashboard-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .content-wrapper {
        flex: 1;
        margin-left: var(--sidebar-width);
        display: flex;
        flex-direction: column;
        width: calc(100% - var(--sidebar-width));
        height: calc(100vh - var(--header-height));
        position: relative;
        overflow: hidden;
    }

    .main-content {
        flex: 1;
        padding: 2rem;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        margin-top: var(--header-height);
        padding-bottom: var(--footer-height);
        overflow-y: auto;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-color);
        top: 0;
        background: var(--background-light);
        z-index: 10;
    }

    h2 {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 600;
        color: var(--secondary-color);
    }

    .badge {
        background: var(--background-light);
        color: var(--text-color);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 1rem;
        border: 1px solid var(--border-color);
    }

    .form-container {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .form-container.editing-mode {
        border-left: 4px solid var(--primary-color);
    }

    .form-container.hidden {
        display: none;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }

    .form-full-width {
        grid-column: 1 / -1;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-color);
    }

    .form-select {
        padding: 0.625rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 1rem;
        width: 100%;
        background-color: white;
        transition: border-color 0.2s;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1rem;
    }

    .form-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
    
    .form-input,
    .form-textarea {
        padding: 0.625rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s;
        width: 100%;
    }

    .form-textarea {
        min-height: 100px;
        resize: vertical;
    }

    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .checkbox-group {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .checkbox-label {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
    }

    .checkmark {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--border-color);
        border-radius: 0.375rem;
        transition: all 0.2s;
    }

    input[type="checkbox"]:checked ~ .checkmark {
        background: var(--primary-color);
        border-color: var(--primary-color);
    }

    input[type="checkbox"]:focus ~ .checkmark {
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .form-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .primary-btn {
        background: var(--primary-color);
        color: white;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .primary-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .primary-btn:hover:not(:disabled) {
        opacity: 0.9;
    }

    .cancel-btn {
        background: none;
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cancel-btn:hover:not(:disabled) {
        background-color: var(--background-light);
    }
    
    .cancel-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .error-banner {
        background: #fef2f2;
        color: var(--danger-color);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border: 1px solid #fecaca;
    }

    .error-icon {
        width: 1.5rem;
        height: 1.5rem;
        fill: currentColor;
    }

    /* Centers Grid Layout */
    .centers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    /* Center Card Styles - Enhanced */
    .center-card {
        background: white;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .center-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }

    .center-card-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8fafc;
        height: 50px
    }

    .center-card-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
        margin: 0;
    }

    .center-card-body {
        padding: 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Enhanced contact section */
    .contact-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        background-color: #f0f9ff;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
        border-left: 3px solid #3b82f6;
    }

    .contact-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .email-row {
        padding-bottom: 0.5rem;
        border-bottom: 1px dashed #cbd5e1;
        margin-bottom: 0.25rem;
    }

    .contact-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3b82f6;
    }

    .contact-value {
        font-size: 1rem;
        word-break: break-all;
    }

    .email-value {
        font-weight: 500;
        color: #1e40af;
        text-decoration: none;
    }

    .email-value:hover {
        text-decoration: underline;
    }

    /* Info section styling */
    .info-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .center-info-row {
        display: flex;
        gap: 0.5rem;
        padding: 0.25rem 0;
    }

    .center-info-label {
        font-weight: 500;
        font-size: 1rem;
        color: #64748b;
        min-width: 80px;
    }

    .center-info-value {
        font-size: 1rem;
    }

    /* Mission section */
    .mission-section {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background-color: #f1f5f9;
        border-radius: 0.5rem;
    }

    .mission-label {
        font-weight: 600;
        color: #334155;
        display: block;
        margin-bottom: 0.25rem;
    }

    .mission-value {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
        color: #475569;
    }

    .center-card-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
        background-color: #f8fafc;
    }

    .center-types {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .center-type-tag {
        background: #e0f2fe;
        color: #0369a1;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-weight: 500;
    }

    .center-status {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }

    .status-indicator {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
    }

    .status-active {
        background-color: var(--success-color);
    }

    .status-inactive {
        background-color: var(--danger-color);
    }

    .status-text {
        font-size: 0.75rem;
        font-weight: 500;
    }

    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .icon-btn {
        padding: 0.5rem;
        border: none;
        background: none;
        color: var(--text-color);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
    }

    .icon-btn:hover:not(:disabled) {
        background: var(--background-light);
        color: var(--primary-color);
    }

    .icon-btn.delete-btn:hover {
        color: var(--danger-color);
    }

    .icon-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .icon {
        width: 1.25rem;
        height: 1.25rem;
        fill: currentColor;
    }

    .loading-indicator {
        padding: 2rem;
        text-align: center;
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .spinner {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite;
        box-sizing: border-box;
        flex-shrink: 0;
        transform-origin: center center;
        will-change: transform;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .empty-state {
        padding: 3rem;
        text-align: center;
        color: #64748b;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
    }

    .empty-icon {
        width: 4rem;
        height: 4rem;
        fill: #cbd5e1;
        margin-bottom: 1rem;
    }
    
    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    
    .hidden {
        display: none !important;
    }

    .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .multi-select-container {
        width: 100%;
    }

    .multi-select-options {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .multi-option-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    @media (max-width: 768px) {
        .content-wrapper {
            margin-left: 0;
            width: 100%;
        }
        
        .centers-grid {
            grid-template-columns: 1fr;
        }
        
        .header {
            flex-direction: column;
            align-items: flex-start;
        }
    }`;

module.exports = styles;