"use strict";

const { createEmptyState, createLoadingIndicator } = require('./template');
const { sanitize } = require('../../utils/security');
const centersGridStyles = require('./centersGridStyles');

/**
 * Creates a center card component with improved email visibility
 */
const CenterCard = (center, centerTypes = [], callbacks = {}) => {
    // Helper to get type label from ID
    function getTypeLabel(typeId) {
        const found = centerTypes.find(t => t.id == typeId || t.type_name == typeId);
        return found ? found.type_label : typeId;
    }
    // Center card container
    const card = document.createElement('div');
    card.className = 'card center-card';
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
            typeTag.textContent = sanitize(getTypeLabel(type));
            typesContainer.appendChild(typeTag);
        });
    }

    body.appendChild(typesContainer);

    // Improved Contact Section with Highlighted Email
    const contactSection = document.createElement('div');
    contactSection.className = 'contact-section';

    // Email row with icon - Make this more prominent
    const emailRow = document.createElement('div');
    emailRow.className = 'contact-row email-row';

    const emailIcon = document.createElement('span');
    emailIcon.className = 'contact-icon';
    emailIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
    `;

    const emailValue = document.createElement('a');
    emailValue.className = 'contact-value email-value';
    emailValue.href = `mailto:${sanitize(center.email)}`;
    emailValue.textContent = sanitize(center.email || 'No email provided');

    emailRow.appendChild(emailIcon);
    emailRow.appendChild(emailValue);
    contactSection.appendChild(emailRow);

    // Phone row with icon
    const phoneRow = document.createElement('div');
    phoneRow.className = 'contact-row';

    const phoneIcon = document.createElement('span');
    phoneIcon.className = 'contact-icon';
    phoneIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
    `;

    const phoneValue = document.createElement('span');
    phoneValue.className = 'contact-value';
    phoneValue.textContent = sanitize(center.phone || 'No phone provided');

    phoneRow.appendChild(phoneIcon);
    phoneRow.appendChild(phoneValue);
    contactSection.appendChild(phoneRow);

    // Add contact section to body
    body.appendChild(contactSection);

    // Center info rows - other info
    const infoSection = document.createElement('div');
    infoSection.className = 'info-section';

    const infoRows = [
        { label: 'Director', value: center.director },
        { label: 'Address', value: center.address },
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
            infoSection.appendChild(row);
        }
    });

    body.appendChild(infoSection);

    // Mission preview (truncated)
    if (center.mission) {
        const missionSection = document.createElement('div');
        missionSection.className = 'mission-section';

        const missionLabel = document.createElement('span');
        missionLabel.className = 'mission-label';
        missionLabel.textContent = 'Mission:';

        const missionValue = document.createElement('p');
        missionValue.className = 'mission-value';
        missionValue.textContent = truncateText(sanitize(center.mission), 100);

        missionSection.appendChild(missionLabel);
        missionSection.appendChild(missionValue);
        body.appendChild(missionSection);
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
    editButton.className = 'button icon-btn edit-btn';
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
    deleteButton.className = 'button icon-btn delete-btn';
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
        centerTypes: Array.isArray(config.centerTypes) ? [...config.centerTypes] : [],
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

    // Inject styles if not already present
    function injectStyles() {
        if (!container.querySelector('style[data-centers-grid]')) {
            const style = document.createElement('style');
            style.setAttribute('data-centers-grid', 'true');
            style.textContent = centersGridStyles;
            container.prepend(style);
        }
    }

    // Render grid
    function render() {
        injectStyles();
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
            const card = CenterCard(center, state.centerTypes, callbacks);
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