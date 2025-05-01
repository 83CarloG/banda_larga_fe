"use strict";

const styles = () => `
    :host {
        --primary-color: #406B7E;
        --success-color: #16a34a;
        --danger-color: #dc2626;
        --text-color: #1e293b;
        --border-color: #e2e8f0;
        --background-light: #f8fafc;
        --spacing-unit: 0.5rem;
        display: block;
        padding: 2rem;
        font-family: 'Poppins', system-ui, sans-serif;
    }

    .container {
        width: calc(100% - var(--sidebar-width));
        margin-left: var(--sidebar-width);
        padding: 0 2rem;
        box-sizing: border-box;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-color);
    }

    h2 {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 600;
        color: var(--text-color);
    }

    .badge {
        background: var(--background-light);
        color: var(--text-color);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        border: 1px solid var(--border-color);
    }

    .form-container {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
    }

    .form-container.editing-mode {
        border-left: 4px solid var(--primary-color);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.875rem;
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
    
    .form-input {
        padding: 0.625rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .checkbox-group {
        flex-direction: row;
        align-items: center;
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

    .table-responsive {
        overflow-x: auto;
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .users-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;
    }

    .users-table th,
    .users-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
        vertical-align: middle;
    }

    .users-table th {
        background: var(--background-light);
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .status-pill {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .status-pill.active {
        background: #dcfce7;
        color: var(--success-color);
    }

    .status-pill.inactive {
        background: #fee2e2;
        color: var(--danger-color);
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

    /* Fixed spinner for perfectly circular animation */
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
        padding: 2rem;
        text-align: center;
        color: #64748b;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .empty-icon {
        width: 3rem;
        height: 3rem;
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
    
    /* Transitions for improved fluidity */
    .form-container {
        transition: border-color 0.3s ease;
    }
    
    .badge {
        transition: all 0.3s ease;
    }
    
    .error-banner {
        transition: opacity 0.3s ease;
        opacity: 1;
    }
    
    .error-banner.hiding {
        opacity: 0;
    }
    
    .table-responsive {
        transition: opacity 0.2s ease;
    }

    /* Multi-select styles */
    .multi-select-container {
        width: 100%;
    }
    
    .selected-items {
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        min-height: 42px;
        padding: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        background-color: white;
        transition: border-color 0.2s;
    }
    
    .selected-items:focus-within,
    .selected-items:hover {
        border-color: var(--primary-color);
    }
    
    .selected-chip {
        background-color: var(--background-light);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .multi-select-dropdown {
        background-color: white;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        max-height: 200px;
        overflow-y: auto;
        z-index: 100;
    }
    
    .dropdown-item {
        padding: 0.5rem;
        cursor: pointer;
    }
    
    .dropdown-item:hover {
        background-color: var(--background-light);
    }

    @media (max-width: 768px) {
        :host {
            padding: 1rem;
        }
        
        .header {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

module.exports = styles;