"use strict";

const styles = () => `
    :host {
        --primary-color: #406B7E;
        --success-color: #16a34a;
        --danger-color: #dc2626;
        --warning-color: #f59e0b;
        --info-color: #0ea5e9;
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

    .action-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5rem;
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
    
    .secondary-btn {
        background: none;
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .secondary-btn:hover:not(:disabled) {
        background-color: var(--background-light);
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
    
    .search-panel {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        margin-bottom: 1.5rem;
    }

    .table-responsive {
        overflow-x: auto;
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .guests-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;
    }

    .guests-table th,
    .guests-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
        vertical-align: middle;
    }

    .guests-table th {
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
    
    .guest-form-container {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
    }
    
    .guest-form-container.editing-mode {
        border-left: 4px solid var(--primary-color);
    }
    
    .form-steps {
        display: flex;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
        overflow-x: auto;
        gap: 0.5rem;
    }
    
    .form-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
    border: 1px solid transparent;
    }
    
    .form-step:hover {
        background-color: var(--background-light);
        border-color: var(--border-color);
    }
    
    .form-step.active {
        background: var(--primary-color);
        color: white;
    }
    
    .form-step.completed {
        background: var(--background-light);
        color: var(--success-color);
    }
    
    /* Remove the disabled styling since all tabs are now clickable */
    .form-step.disabled {
        opacity: 1;
        cursor: pointer;
    }
    
    .form-progress {
        height: 0.5rem;
        background: var(--border-color);
        border-radius: 0.25rem;
        margin-bottom: 2rem;
        overflow: hidden;
    }
    
    .form-progress-bar {
        height: 100%;
        background: var(--primary-color);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }
    
    .form-grid-full {
        grid-column: 1 / -1;
    }
    
    .form-actions {
        display: flex;
        justify-content: space-between;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }
    
    .form-actions-right {
        display: flex;
        gap: 0.75rem;
    }
    
    /* Guest View - New Layout */
    .guest-view-container {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .guest-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--background-light);
        border-bottom: 1px solid var(--border-color);
    }
    
    .guest-info h2 {
        margin: 0;
        font-size: 1.5rem;
    }
    
    .guest-meta {
        font-size: 0.875rem;
        color: #64748b;
        margin-top: 0.25rem;
        display: flex;
        gap: 1rem;
    }
    
    .guest-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    /* Tabs that span the full width */
    .guest-tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--background-light);
        overflow-x: auto;
    }
    
    .tab-button {
        padding: 0.875rem 1.5rem;
        background: none;
        border: none;
        font-weight: 500;
        color: #4b5563;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
        border-bottom: 3px solid transparent;
    }
    
    .tab-button.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
        background-color: white;
    }
    
    .tab-button:hover:not(.active) {
        background-color: rgba(0, 0, 0, 0.03);
    }
    
    .tab-icon {
        font-size: 1.125rem;
    }
    
    /* Split view layout */
    .guest-split-view {
        display: flex;
        height: calc(100vh - 12rem);
        min-height: 500px;
    }
    
    .guest-left-panel {
        width: 50%;
        overflow-y: auto;
        border-right: 1px solid var(--border-color);
    }
    
    .guest-right-panel {
        width: 50%;
        overflow-y: auto;
        background-color: var(--background-light);
        display: flex;
        flex-direction: column;
    }
    
    /* Tab content styles */
    .tab-content {
        padding: 0;
    }
    
    .tab-section {
        padding: 1.5rem;
    }
    
    .tab-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: var(--text-color);
    }
    
    /* Field rows for more compact display */
    .field-row {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .field-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #64748b;
        margin-bottom: 0.25rem;
    }
    
    .field-value {
        font-size: 0.875rem;
    }
    
    .note-row {
        padding-bottom: 0;
        border-bottom: none;
    }
    
    .note-value {
        padding: 0.5rem;
        background-color: #f8f9fa;
        border-radius: 0.25rem;
        margin-top: 0.25rem;
    }
    
    /* History panel styles */
    .history-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .history-header h2 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .history-filters {
        display: flex;
        padding: 0.75rem 1rem;
        gap: 1rem;
        border-bottom: 1px solid var(--border-color);
        background-color: white;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .filter-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #64748b;
    }
    
    .filter-select {
        padding: 0.375rem 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        font-size: 0.75rem;
        min-width: 8rem;
    }
    
    .history-content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0.75rem;
    }
    
    .empty-history {
        padding: 2rem;
        text-align: center;
        color: #64748b;
    }
    
    .history-date-section {
        margin-bottom: 1.5rem;
    }
    
    .history-date-header {
        font-weight: 600;
        font-size: 0.875rem;
        padding: 0.5rem;
        background-color: #f1f5f9;
        border-radius: 0.25rem 0.25rem 0 0;
        border: 1px solid var(--border-color);
    }
    
    .history-entries {
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 0.25rem 0.25rem;
        overflow: hidden;
        background-color: white;
    }
    
    .history-entry {
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
    }
    
    .history-entry:last-child {
        border-bottom: none;
    }
    
    .history-entry:hover {
        background-color: #f8f9fa;
    }
    
    .entry-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
    }
    
    .entry-category {
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }
    
    .category-icon {
        font-size: 1rem;
    }
    
    .entry-time {
        color: #64748b;
    }
    
    .entry-content {
        border-radius: 0.25rem;
        padding: 0.5rem;
        font-size: 0.875rem;
    }
    
    .entry-content.modified {
        background-color: #fef9c3;
    }
    
    .entry-content.added {
        background-color: #dcfce7;
    }
    
    .entry-content.removed {
        background-color: #fee2e2;
    }
    
    .entry-content.creation {
        background-color: #dbeafe;
    }
    
    .entry-field {
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
    
    .entry-values {
        display: flex;
        gap: 1rem;
    }
    
    .old-value {
        text-decoration: line-through;
        color: #dc2626;
    }
    
    .new-value {
        color: #16a34a;
    }
    
    .entry-value {
        font-size: 0.875rem;
    }
    
    .added-value {
        color: #16a34a;
    }
    
    .removed-value {
        color: #dc2626;
    }
    
    .creation-value {
        color: #0284c7;
    }
    
    /* Legend */
    .history-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 0.75rem;
        background-color: white;
        border-top: 1px solid var(--border-color);
        font-size: 0.75rem;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }
    
    .legend-dot {
        width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
    }
    
    .legend-dot.addition {
        background-color: #16a34a;
    }
    
    .legend-dot.removal {
        background-color: #dc2626;
    }
    
    .legend-dot.modification {
        background-color: #eab308;
    }
    
    .legend-dot.creation {
        background-color: #0284c7;
    }
    
    /* Placeholder message */
    .placeholder-message {
        padding: 1.5rem;
        text-align: center;
        color: #64748b;
        background-color: #f8f9fa;
        border-radius: 0.25rem;
    }

    @media (max-width: 768px) {
        :host {
            padding: 1rem;
        }
        
        .header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .guest-split-view {
            flex-direction: column;
            height: auto;
        }
        
        .guest-left-panel, .guest-right-panel {
            width: 100%;
            height: auto;
            max-height: 500px;
        }
        
        .guest-tabs {
            overflow-x: auto;
        }
        
        .tab-button {
            padding: 0.75rem 1rem;
            font-size: 0.8125rem;
        }
        
        .guest-actions {
            margin-top: 0.5rem;
        }
    }
`;

module.exports = styles;