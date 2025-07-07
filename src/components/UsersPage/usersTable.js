require('./UsersTable.css');
// usersTable.js - Updated with centers display
"use strict";

/**
 * Creates a users table with role and centers display
 */
const UsersTable = (config = {}) => {
    // Table state
    const state = {
        users: Array.isArray(config.users) ? [...config.users] : [],
        isLoading: config.isLoading || false
    };

    // Event callbacks
    const callbacks = {
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {},
        onDelete: typeof config.onDelete === 'function' ? config.onDelete : () => {}
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'table-responsive';

    // Role names mapping - keeping it simple with fixed values
    const roleNames = {
        1: 'Data Entry',
        2: 'Supervisor',
        3: 'Administrator'
    };

    // Get role name by ID
    function getRoleName(roleId) {
        return roleNames[roleId] || `Role ${roleId}`;
    }

    // Format centers as comma-separated list
    function formatCenters(centers) {
        if (!centers || !Array.isArray(centers) || centers.length === 0) {
            return '-';
        }

        return centers.map(center => center.center_name).join(', ');
    }

    // Render table
    function render() {
        // If loading, show spinner
        if (state.isLoading) {
            container.innerHTML = `
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>Loading users...</p>
                </div>
            `;
            return;
        }

        // If no users, show empty state
        if (!state.users.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No users found</p>
                </div>
            `;
            return;
        }

        // Create table
        const table = document.createElement('table');
        table.className = 'users-table';

        // Table header
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ruolo</th>
                    <th>Centri</th>
                    <th>Status</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        // Create rows for each user
        state.users.forEach(user => {
            const tr = document.createElement('tr');

            // Format user data
            const name = `${user.first_name || ''} ${user.last_name || ''}`;
            const email = user.email || '';
            const roleName = getRoleName(user.role_id);
            const centersDisplay = formatCenters(user.centers);
            const isActive = user.active;

            // Create row HTML
            tr.innerHTML = `
                <td>${name}</td>
                <td>${email}</td>
                <td>${roleName}</td>
                <td>${centersDisplay}</td>
                <td>
                    <span class="status-pill ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Attivo ' : 'Inattivo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn edit-btn" data-id="${user.id}">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                            </svg>
                        </button>
                        <button class="icon-btn delete-btn" data-id="${user.id}">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            // Add event listeners to buttons
            const editBtn = tr.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => callbacks.onEdit(user.id));

            const deleteBtn = tr.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => callbacks.onDelete(user.id));

            tbody.appendChild(tr);
        });

        // Clear and add table
        container.innerHTML = '';
        container.appendChild(table);
    }

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        updateUsers: (users) => {
            state.users = Array.isArray(users) ? [...users] : [];
            state.isLoading = false;
            render();
        },

        setLoading: (loading) => {
            state.isLoading = loading;
            render();
        }
    };
};

module.exports = UsersTable;