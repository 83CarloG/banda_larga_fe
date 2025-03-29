// components/CentersPage/centersGrid.js
"use strict";

const { createEmptyState, createLoadingIndicator } = require('./template');
const { sanitize } = require('../../utils/security');

/**
 * Creates a center card component
 */
const CenterCard = (center, callbacks = {}) => {
    // Center card container
    const card = document.createElement('div');
    card.className = 'center-card';
    card.dataset.id = center.id;

    // Card header with title
    const header = document.createElement('div');
    header.className = 'center-card-header';

    const title = document.createElement('h3');
    title.className = 'center-card-title';
    title.textContent = sanitize(center.name);

    const statusContainer = document.createElement('div');
    statusContainer.className = 'center-status';

    const statusIndicator = document.createElement('span');
    statusIndicator.className = `status-indicator ${center.active ? 'status-active' : 'status-inactive'}`;

    const statusText = document.createElement('span');
    statusText.className = 'status-text';
    statusText.textContent = center.active ? 'Active' : 'Inactive';

    statusContainer.appendChild(statusIndicator);
    statusContainer.appendChild(statusText);

    header.appendChild(title);
    header.appendChild(statusContainer);
    card.appendChild(header);

    // Card body with center info
    const body = document.createElement('div');
    body.className = 'center-card-body';

    // Center type tags
    const typesContainer = document.createElement('div');
    typesContainer.className = 'center-types';

    if (Array.isArray(center.type)) {
        center.type.forEach(type => {
            const typeTag = document.createElement('span');
            typeTag.className = 'center-type-tag';
            typeTag.textContent = sanitize(type);
            typesContainer.appendChild(typeTag);
        });
    }

    body.appendChild(typesContainer);

    // Center info rows
    const infoRows = [
        { label: 'Director', value: center.director },
        { label: 'Address', value: center.address },
        { label: 'Phone', value: center.phone },
        { label: 'Email', value: center.email },
        { label: 'Open Since', value: formatDate(center.openDate) }
    ];

    infoRows.forEach(info => {
        if (info.value) {
            const row = document.createElement('div');
            row.className = 'center-info-row';

            const label = document.createElement('span');
            label.className = 'center-info-label';
            label.textContent = info.label + ':';

            const value = document.createElement('span');
            value.className = 'center-info-value';
            value.textContent = sanitize(info.value);

            row.appendChild(label);
            row.appendChild(value);
            body.appendChild(row);
        }
    });

    // Mission preview (truncated)
    if (center.mission) {
        const missionRow = document.createElement('div');
        missionRow.className = 'center-info-row';

        const missionLabel = document.createElement('span');
        missionLabel.className = 'center-info-label';
        missionLabel.textContent = 'Mission:';

        const missionValue = document.createElement('span');
        missionValue.className = 'center-info-value';
        missionValue.textContent = truncateText(sanitize(center.mission), 100);

        missionRow.appendChild(missionLabel);
        missionRow.appendChild(missionValue);
        body.appendChild(missionRow);
    }

    card.appendChild(body);

    // Card footer with actions
    const footer = document.createElement('div');
    footer.className = 'center-card-footer';

    // Action buttons
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'action-buttons';

    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'icon-btn edit-btn';
    editButton.setAttribute('aria-label', 'Edit center');
    editButton.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
            <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
        </svg>
    `;
    editButton.addEventListener('click', () => {
        if (callbacks.onEdit) callbacks.onEdit(center.id);
    });

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'icon-btn delete-btn';
    deleteButton.setAttribute('aria-label', 'Delete center');
    deleteButton.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z"/>
        </svg>
    `;
    deleteButton.addEventListener('click', () => {
        if (callbacks.onDelete) callbacks.onDelete(center.id);
    });

    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    footer.appendChild(actionsContainer);
    card.appendChild(footer);

    return card;
};

/**
 * Format date string
 * @param {string} dateString - Date string in ISO format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (error) {
        return dateString;
    }
}

/**
 * Truncate text if too long
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Creates a grid of center cards
 */
const CentersGrid = (config = {}) => {
    // Grid state
    const state = {
        centers: Array.isArray(config.centers) ? [...config.centers] : [],
        isLoading: config.isLoading || false
    };

    // Event callbacks
    const callbacks = {
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {},
        onDelete: typeof config.onDelete === 'function' ? config.onDelete : () => {}
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'centers-container';

    // Render grid
    function render() {
        // If loading, show spinner
        if (state.isLoading) {
            container.innerHTML = createLoadingIndicator();
            return;
        }

        // If no centers, show empty state
        if (!state.centers.length) {
            container.innerHTML = createEmptyState();

            // Add event listener to the add button
            const addButton = container.querySelector('#empty-add-btn');
            if (addButton) {
                addButton.addEventListener('click', () => {
                    // Dispatch a custom event that the parent component can listen for
                    const event = new CustomEvent('add-center', {
                        bubbles: true,
                        composed: true
                    });
                    container.dispatchEvent(event);
                });
            }

            return;
        }

        // Create grid
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'centers-grid';

        // Create center cards
        state.centers.forEach(center => {
            const card = CenterCard(center, callbacks);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        updateCenters: (centers) => {
            state.centers = Array.isArray(centers) ? [...centers] : [];
            state.isLoading = false;
            render();
        },

        setLoading: (loading) => {
            state.isLoading = loading;
            render();
        }
    };
};

module.exports = CentersGrid;