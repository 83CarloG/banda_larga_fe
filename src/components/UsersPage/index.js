// components/UsersPage/index.js
"use strict";

const StatefulComponent = require('../base/StateFullComponent');
const userService = require('./usersService');
const UserForm = require('./UserForm');
const UsersTable = require('./UsersTable');
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
            const users = await userService.fetchUsers();

            // Sanitize user data
            const sanitizedUsers = Array.isArray(users)
                ? users.map(user => sanitizeObject(user))
                : [];

            this.setState({ users: sanitizedUsers, isLoading: false });
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
            // Validate user manually since we don't have a validateUserData function
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
        const { users, editingUser, isLoading } = this.getState();

        // Get container elements
        const formContainer = this.shadowRoot.querySelector('#form-container');
        const tableContainer = this.shadowRoot.querySelector('#table-container');

        if (!formContainer || !tableContainer) return;

        // Create or update form component
        const userForm = UserForm({
            user: editingUser,
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