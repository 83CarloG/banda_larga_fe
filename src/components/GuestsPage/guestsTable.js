// guestsTable.js
"use strict";

/**
 * Creates a guests table component
 */
const GuestsTable = (config = {}) => {
    // Table state
    const state = {
        guests: Array.isArray(config.guests) ? [...config.guests] : [],
        isLoading: config.isLoading || false
    };

    // Event callbacks
    const callbacks = {
        onView: typeof config.onView === 'function' ? config.onView : () => {},
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {},
        onDelete: typeof config.onDelete === 'function' ? config.onDelete : () => {}
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'table-responsive';

    // Format guest name
    function formatName(guest) {
        return `${guest.guest_first_name || ''} ${guest.guest_last_name || ''}`;
    }

    // Format guest address
    function formatAddress(guest) {
        return guest.guest_address || 'N/A';
    }

    // Render table
    function render() {
        // If loading, show spinner
        if (state.isLoading) {
            container.innerHTML = `
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>Loading guests...</p>
                </div>
            `;
            return;
        }

        // If no guests, show empty state
        if (!state.guests.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No guests found</p>
                </div>
            `;
            return;
        }

        // Create table
        const table = document.createElement('table');
        table.className = 'guests-table';

        // Table header
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Fiscal Code</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        // Create rows for each guest
        state.guests.forEach(guest => {
            const tr = document.createElement('tr');

            // Format guest data
            const name = formatName(guest);
            const address = formatAddress(guest);
            const isActive = guest.active;

            // Create row HTML
            tr.innerHTML = `
                <td>${guest.guest_code || guest.id}</td>
                <td>${name}</td>
                <td>${guest.guest_fiscal_code || 'N/A'}</td>
                <td>${address}</td>
                <td>${guest.guest_phone_number || 'N/A'}</td>
                <td>${guest.guest_email || 'N/A'}</td>
                <td>
                    <span class="status-pill ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn view-btn" data-id="${guest.id}" title="View Guest">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                        <button class="icon-btn edit-btn" data-id="${guest.id}" title="Edit Guest">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                            </svg>
                        </button>
                        <button class="icon-btn delete-btn" data-id="${guest.id}" title="Delete Guest">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            // Add event listeners to buttons
            const viewBtn = tr.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => callbacks.onView(guest.id));

            const editBtn = tr.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => callbacks.onEdit(guest.id));

            const deleteBtn = tr.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => callbacks.onDelete(guest.id));

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

        updateGuests: (guests) => {
            state.guests = Array.isArray(guests) ? [...guests] : [];
            state.isLoading = false;
            render();
        },

        setLoading: (loading) => {
            state.isLoading = loading;
            render();
        }
    };
};

module.exports = GuestsTable;