"use strict";

const escapeHTML = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const createUserForm = ({ isLoading, editingUser, formData }) => `
    <div class="form-container ${editingUser ? 'editing-mode' : ''}">
        <form id="userForm" class="user-form" aria-label="${editingUser ? 'Edit User' : 'Add New User'}">
            <div class="form-grid">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required
                           value="${escapeHTML(formData.email)}"
                           class="form-input" autocomplete="email" 
                           aria-required="true" />
                </div>
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" required
                           value="${escapeHTML(formData.first_name)}"
                           class="form-input" autocomplete="given-name"
                           aria-required="true" />
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" required
                           value="${escapeHTML(formData.last_name)}"
                           class="form-input" autocomplete="family-name"
                           aria-required="true" />
                </div>
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="active" 
                               ${formData.active ? 'checked' : ''}
                               class="visually-hidden" />
                        <span class="checkmark"></span>
                        Active Status
                    </label>
                </div>
            </div>
            <div class="form-actions">
                ${editingUser ? `
                    <button type="button" class="button cancel-btn" aria-label="Cancel editing">
                        Cancel
                    </button>
                ` : ''}
                <button type="submit" class="button primary-btn" 
                        ${isLoading ? 'disabled' : ''}
                        aria-label="${editingUser ? 'Save changes' : 'Add new user'}">
                    ${isLoading ?
    '<span class="spinner"></span> Saving...' :
    (editingUser ? 'Save Changes' : 'Add User')}
                </button>
            </div>
        </form>
    </div>
`;

const createUsersTable = ({ users, editingUser }) => `
    <div class="table-responsive">
        <table class="users-table" aria-label="Users list">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.length === 0 ? `
                    <tr class="empty-row">
                        <td colspan="4">
                            <div class="empty-state">
                                <svg class="empty-icon" viewBox="0 0 24 24">
                                    <path d="M12 5V3M3 7H5M21 7H19M7 3H9M7 21H9M3 5H5M19 5H21M18 16.5C18 17.9 17.18 19 16 19C14.82 19 14 17.9 14 16.5C14 15.1 16 13 16 13C16 13 18 15.1 18 16.5M12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13Z"/>
                                </svg>
                                No users found
                            </div>
                        </td>
                    </tr>
                ` : users.map(user => `
                    <tr class="${editingUser?.id === user.id ? 'highlight-row' : ''}">
                        <td>${escapeHTML(user.first_name + ' ' + user.last_name)}</td>
                        <td>${escapeHTML(user.email)}</td>
                        <td>
                            <span class="status-pill ${user.active ? 'active' : 'inactive'}">
                                ${user.active ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="icon-btn edit-btn" data-id="${user.id}" 
                                        ${editingUser ? 'disabled' : ''}
                                        aria-label="Edit user">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                                    </svg>
                                </button>
                                <button class="icon-btn delete-btn" data-id="${user.id}"
                                        ${editingUser ? 'disabled' : ''}
                                        aria-label="Delete user">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;

const template = (state) => `
    <div class="container">
        <header class="header">
            <h2>${state.editingUser ? 'Edit User' : 'User Management'}</h2>
            ${state.users.length > 0 ? `
                <div class="badge">Total users: ${state.users.length}</div>
            ` : ''}
        </header>

        ${state.error ? `
            <div class="error-banner" role="alert">
                <svg class="error-icon" viewBox="0 0 24 24">
                    <path d="M13 13H11V7H13M11 15H13V17H11M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 6.47715 17.5228 2 12 2Z"/>
                </svg>
                <span>${state.error}</span>
            </div>
        ` : ''}

        ${createUserForm(state)}

        ${state.isLoading ? `
            <div class="loading-indicator" role="status">
                <div class="spinner"></div>
                <p>Loading users...</p>
            </div>
        ` : createUsersTable(state)}
    </div>
`;

module.exports = template;