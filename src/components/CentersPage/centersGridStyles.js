const centersGridStyles = `
.centers-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 1rem 0.5rem;
    justify-content: flex-start;
}
.center-card {
    --font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-weight-light: 300;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --secondary-color: #D36D48;
    --info-color: #0dcaf0;
    --text-secondary: #64748b;
    --header-height: 60px;
    --footer-height: 64px;
    --sidebar-width: 160px;
    --font-size-xs: 1rem;
    --font-size-sm: 1rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-radius-xl: 1rem;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    --primary-color: #406B7E;
    --success-color: #16a34a;
    --danger-color: #dc2626;
    --warning-color: #ca8a04;
    --text-color: #1e293b;
    --border-color: #e2e8f0;
    --background-light: #fff;
    --spacing-unit: 0.5rem;
    font-family: 'Poppins', system-ui, sans-serif;
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
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
.center-card-header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    height: 50px;
}
.center-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0;
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
    background: var(--success-color);
}
.status-inactive {
    background: var(--danger-color);
}
.status-text {
    font-size: 0.75rem;
    font-weight: 500;
}
.center-card-body {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
.contact-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f0f9ff;
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
    background: #e0f2fe;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: inline-block;
    border-bottom: 1px dashed #cbd5e1;
    margin-bottom: 0.25rem;
    width: 100%;
}
.email-value:hover {
    text-decoration: underline;
}
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
.mission-section {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: #f1f5f9;
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
    margin-top: auto;
    border-top: 1px solid var(--border-color);
    background: #f8fafc;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 48px;
}
.action-buttons {
    display: flex;
    gap: 0.5rem;
}
.icon-btn {
    padding: 0.25rem;
    border: none;
    background: none;
    color: #64748b;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}
.icon-btn:hover:not(:disabled) {
    background: #e0e7ef;
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
    background: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid var(--border-color);
}
.empty-icon {
    width: 4rem;
    height: 4rem;
    fill: #cbd5e1;
    margin-bottom: 1rem;
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
    .center-card-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
`;

module.exports = centersGridStyles; 