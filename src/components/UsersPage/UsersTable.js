// components/UsersTable.js
"use strict";

const { createLoadingIndicator, createEmptyState, createErrorBanner } = require('./template');
const { sanitize } = require('../../utils/security');
const { EVENTS } = require('../../utils/constants');
const { classNames } = require('../../utils/styleUtils');

/**
 * Creates a reusable users table component
 *
 * @param {Object} config - Configuration object
 * @returns {Object} - Users table component API
 */
const UsersTable = (config = {}) => {
    // Internal state
    const state = {
        users: Array.isArray(config.users) ? [...config.users] : [],
        editingUser: config.editingUser || null,
        isLoading: config.isLoading !== undefined ? !!config.isLoading : true
    };

    // Callbacks
    const callbacks = {
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {},
        onDelete: typeof config.onDelete === 'function' ? config.onDelete : () => {}
    };

    // Create table container element
    const container = document.createElement('div');
    container.className = 'table-responsive';

    // Create custom event for state changes
    const emitStateChange = () => {
        const event = new CustomEvent(EVENTS.STATE.CHANGE, {
            detail: { ...state },
            bubbles: true
        });
        container.dispatchEvent(event);
    };

    // Render loading state
    function renderLoader() {
        container.innerHTML = createLoadingIndicator();
    }

    // Render empty state
    function renderEmptyState() {
        container.innerHTML = createEmptyState();
    }

    // Render error state
    function renderError(message = "Error loading users table") {
        container.innerHTML = createErrorBanner(message);
    }

    // Create table with programmatically created elements and event listeners
    function renderTable() {
        try {
            // Clear container
            container.innerHTML = '';

            // Create table element
            const tableEl = document.createElement('table');
            tableEl.className = 'users-table';
            tableEl.setAttribute('aria-label', 'Users list');

            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            `;
            tableEl.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');

            // If no users, show empty state
            if (!state.users.length) {
                const tr = document.createElement('tr');
                tr.className = 'empty-row';

                const td = document.createElement('td');
                td.setAttribute('colspan', '4');
                td.innerHTML = createEmptyState();

                tr.appendChild(td);
                tbody.appendChild(tr);
            } else {
                // Create a row for each user
                state.users.forEach(user => {
                    if (!user || !user.id) return;

                    // Get user data with proper sanitization
                    const firstName = sanitize(user.first_name || '');
                    const lastName = sanitize(user.last_name || '');
                    const email = sanitize(user.email || '');
                    const active = !!user.active;
                    const id = user.id;

                    // Create row
                    const tr = document.createElement('tr');
                    tr.className = classNames(
                        state.editingUser && state.editingUser.id === id && 'highlight-row'
                    );

                    // Name cell
                    const nameCell = document.createElement('td');
                    nameCell.textContent = `${firstName} ${lastName}`;
                    tr.appendChild(nameCell);

                    // Email cell
                    const emailCell = document.createElement('td');
                    emailCell.textContent = email;
                    tr.appendChild(emailCell);

                    // Status cell
                    const statusCell = document.createElement('td');
                    const statusPill = document.createElement('span');
                    statusPill.className = classNames(
                        'status-pill',
                        active ? 'active' : 'inactive'
                    );
                    statusPill.textContent = active ? 'Active' : 'Inactive';
                    statusCell.appendChild(statusPill);
                    tr.appendChild(statusCell);

                    // Actions cell
                    const actionsCell = document.createElement('td');
                    const actionButtons = document.createElement('div');
                    actionButtons.className = 'action-buttons';

                    // Edit button
                    const editBtn = document.createElement('button');
                    editBtn.className = 'icon-btn edit-btn';
                    editBtn.setAttribute('data-id', id);
                    editBtn.setAttribute('aria-label', 'Edit user');
                    if (state.editingUser) editBtn.disabled = true;

                    editBtn.innerHTML = `
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                        </svg>
                    `;

                    // Add click handler
                    editBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        callbacks.onEdit(id);
                    });

                    // Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'icon-btn delete-btn';
                    deleteBtn.setAttribute('data-id', id);
                    deleteBtn.setAttribute('aria-label', 'Delete user');
                    if (state.editingUser) deleteBtn.disabled = true;

                    deleteBtn.innerHTML = `
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z"/>
                        </svg>
                    `;

                    // Add click handler
                    deleteBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        callbacks.onDelete(id);
                    });

                    // Add buttons to container
                    actionButtons.appendChild(editBtn);
                    actionButtons.appendChild(deleteBtn);
                    actionsCell.appendChild(actionButtons);
                    tr.appendChild(actionsCell);

                    // Add row to table
                    tbody.appendChild(tr);
                });
            }

            // Add tbody to table
            tableEl.appendChild(tbody);

            // Add table to container
            container.appendChild(tableEl);

        } catch (error) {
            console.error("Error rendering table:", error);
            renderError("Error rendering table: " + error.message);
        }
    }

    // Main render function
    function render() {
        try {
            if (state.isLoading) {
                renderLoader();
                return;
            }

            if (!Array.isArray(state.users) || state.users.length === 0) {
                renderEmptyState();
                return;
            }

            renderTable();

            // Emit state change event
            emitStateChange();
        } catch (error) {
            console.error("Error rendering:", error);
            renderError("Rendering error: " + error.message);
        }
    }

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        updateUsers: (newUsers) => {
            state.users = Array.isArray(newUsers) ? [...newUsers] : [];
            state.isLoading = false;
            render();
        },

        setEditingUser: (user) => {
            state.editingUser = user;
            render();
        },

        setLoading: (loading) => {
            state.isLoading = !!loading;
            render();
        },

        getState: () => ({ ...state })
    };
};

module.exports = UsersTable;