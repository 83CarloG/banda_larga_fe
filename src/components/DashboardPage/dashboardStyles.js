// components/DashboardPage/styles.js
"use strict";

const dashboardPageStyles = `
    :host {
        --primary-color: #406B7E;
        --success-color: #16a34a;
        --danger-color: #dc2626;
        --warning-color: #f59e0b;
        --info-color: #3b82f6;
        --text-color: #1e293b;
        --border-color: #e2e8f0;
        --background-light: #f8fafc;
        --spacing-unit: 0.5rem;
        display: block;
        padding: 2rem;
        font-family: 'Poppins', system-ui, sans-serif;
    }
    .dashboard-root {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        grid-template-rows: 1fr auto;
        min-height: 100vh;
        width: 100%;
    }
    sidebar-element {
        grid-row: 1 / 2;
        grid-column: 1 / 2;
        height: 100vh;
    }
    .dashboard-main {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 100vh;
        background: #fff;
    }
    header-element {
        flex-shrink: 0;
    }
    .container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        width: calc(100% - var(--sidebar-width));
        margin-left: var(--sidebar-width);
        padding: 0 2rem;
        box-sizing: border-box;
    }
    .dashboard-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 2px solid var(--border-color);
    }
    h2 {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 600;
        color: var(--secondary-color);
    }
    .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 1rem;
        font-weight: 500;
    }
    .role-badge.advanced {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #bfdbfe;
    }
    .role-badge.basic {
        background: #e2e8f0;
        color: #475569;
        border: 1px solid #cbd5e1;
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
    .content-wrapper {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
    .main-content {
        flex: 1 1 auto;
        min-height: 0;
        padding: 24px 0;
        padding-top: var(--header-height);
        width: 100%;
        box-sizing: border-box;
    }
    footer-element {
        grid-row: 2 / 3;
        grid-column: 1 / span 2;
        width: 100%;
        display: block;
        margin-top: 0;
    }
    .stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
    .charts-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .stat-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .stat-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .stat-card-title {
        color: var(--text-secondary);
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
    }
    .stat-card-icon {
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .stat-card-icon.users {
        background: #dbeafe;
        color: var(--info-color);
    }
    .stat-card-icon.centers {
        background: #dcfce7;
        color: var(--success-color);
    }
    .stat-card-icon.tasks {
        background: #fef3c7;
        color: var(--warning-color);
    }
    .stat-card-icon.activity {
        background: #e0e7ff;
        color: #4f46e5;
    }
    .stat-card-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-color);
    }
    .stat-card-subtitle {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }
    .chart-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        height: 350px;
    }
    .chart-card-header {
        margin-bottom: 1rem;
    }
    .chart-card-title {
        font-size: 1.125rem;
`;

module.exports = dashboardPageStyles;