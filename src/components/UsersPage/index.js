// components/UsersPage/index.js
"use strict";

const StatefulComponent = require('../base/StateFullComponent');
const userService = require('./usersService');
const UserForm = require('./userForm');
const UsersTable = require('./usersTable');
const { createPageTemplate } = require('./template');
const validators = require('../../utils/validators');

const { sanitizeObject } = require('../../utils/security');
const { EVENTS } = require('../../utils/constants');

class UsersPageElement extends StatefulComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize state
        this.initState({
            users: [],
            centers: [],
            roles: [],
            isLoading: true,
            error: null,
            editingUser: null
        });

        // Bind methods to maintain context
        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
        this.handleSubmitError = this.handleSubmitError.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormEvent = this.handleFormEvent.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        // Initial render
        this.render();

        // Fetch data
        this.fetchUsers();

        // Add event listeners for form events
        this.shadowRoot.addEventListener(EVENTS.FORM.SUBMIT, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.ERROR, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.VALIDATE, this.handleFormEvent);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Remove event listeners
        this.shadowRoot.removeEventListener(EVENTS.FORM.SUBMIT, this.handleFormEvent);
        this.shadowRoot.removeEventListener(EVENTS.FORM.ERROR, this.handleFormEvent);
        this.shadowRoot.removeEventListener(EVENTS.FORM.VALIDATE, this.handleFormEvent);
    }

    handleFormEvent(event) {
        // Log form events for debugging
        if (event.type === EVENTS.FORM.ERROR) {
            console.error('Form Error:', event.detail.message);
        } else if (event.type === EVENTS.FORM.SUBMIT) {
            console.log('Form Submit:', event.detail.formData);
        } else if (event.type === EVENTS.FORM.VALIDATE) {
            if (!event.detail.isValid) {
                console.warn('Form Validation Failed:', event.detail.errors);
            }
        }
    }

    async fetchUsers() {
        try {
            this.setState({ isLoading: true, error: null });
            const data = await userService.fetchUsers();

            // Sanitize user data
            const sanitizedUsers = Array.isArray(data.users)
                ? data.users.map(user => sanitizeObject(user))
                : [];

            // Store centers and roles data
            const centers = Array.isArray(data.centers)
                ? data.centers.map(center => sanitizeObject(center))
                : [];

            const roles = Array.isArray(data.roles)
                ? data.roles.map(role => sanitizeObject(role))
                : [];

            this.setState({
                users: sanitizedUsers,
                centers: centers,
                roles: roles,
                isLoading: false
            });
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to fetch users',
                isLoading: false
            });
            console.error("Error fetching users:", error);
        }
    }

    handleSubmitSuccess(response) {
        // Reset editing state and refresh users
        this.setState({ editingUser: null });
        this.fetchUsers();
    }

    handleSubmitError(error) {
        this.setState({
            error: error.message || 'Failed to save user'
        });
    }

    handleEdit(userId) {
        const { users } = this.getState();
        const user = users.find(u => u.id === userId);

        if (user) {
            // Validate user manually
            let isValid = true;
            const errors = {};

            // Basic validation
            if (!user.email) {
                isValid = false;
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                isValid = false;
                errors.email = 'Invalid email format';
            }

            if (!user.first_name) {
                isValid = false;
                errors.first_name = 'First name is required';
            }

            if (!user.last_name) {
                isValid = false;
                errors.last_name = 'Last name is required';
            }

            // Validate role
            if (!user.role_id) {
                isValid = false;
                errors.role_id = 'Role is required';
            }

            // Validate centers - ensure user has centers if required
            if (!user.centers || !Array.isArray(user.centers) || user.centers.length === 0) {
                // We won't block editing for this, as we'll show the centers select
                // and require selection during form submission
                console.warn('User has no centers assigned');
            }

            if (!isValid) {
                this.setState({
                    error: 'Cannot edit user: Invalid user data'
                });
                return;
            }

            this.setState({ editingUser: user });
        }
    }

    async handleDelete(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            this.setState({ isLoading: true, error: null });
            await userService.deleteUser(userId);
            await this.fetchUsers();
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to delete user',
                isLoading: false
            });
            console.error("Error deleting user:", error);
        }
    }

    handleCancel() {
        this.setState({ editingUser: null });
    }

    render() {
        const state = this.getState();

        // Use template to create HTML
        this.shadowRoot.innerHTML = createPageTemplate(state);

        // Setup components after DOM is updated
        this.setupComponents();
    }

    setupComponents() {
        const { users, centers, editingUser, isLoading } = this.getState();

        // Get container elements
        const formContainer = this.shadowRoot.querySelector('#form-container');
        const tableContainer = this.shadowRoot.querySelector('#table-container');

        if (!formContainer || !tableContainer) return;

        // Create or update form component
        const userForm = UserForm({
            user: editingUser,
            centers: centers, // Pass centers data to the form
            onSubmit: this.handleSubmitSuccess,
            onCancel: () => this.handleCancel(),
            onError: this.handleSubmitError
        });

        // Create or update table component
        const usersTable = UsersTable({
            users,
            editingUser,
            isLoading,
            onEdit: this.handleEdit,
            onDelete: this.handleDelete
        });

        // Clear and append to containers
        formContainer.innerHTML = '';
        formContainer.appendChild(userForm.getElement());

        tableContainer.innerHTML = '';
        tableContainer.appendChild(usersTable.getElement());
    }
}

// Register component
if (!window.customElements.get('users-page')) {
    window.customElements.define('users-page', UsersPageElement);
}

module.exports = UsersPageElement;