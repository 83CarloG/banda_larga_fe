"use strict";

const StatefulComponent = require('../base/StateFullComponent');
const styles = require('./styles');
const template = require('./template');
const { validateUserData } = require('./validation');
const userService = require('./usersService');

class UsersPageElement extends StatefulComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize state
        this.initState({
            users: [],
            isLoading: false,
            error: null,
            editingUser: null,
            formData: {
                email: '',
                first_name: '',
                last_name: '',
                active: true
            }
        });

        // Bind methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupEventListeners();
        this.fetchUsers();
    }

    setupEventListeners() {
        // Form events
        this.shadowRoot.addEventListener('submit', (event) => {
            if (event.target.matches('#userForm')) {
                event.preventDefault();
                this.handleSubmit();
            }
        });

        // Input changes
        this.shadowRoot.addEventListener('input', (event) => {
            const input = event.target.closest('input[name="active"]');
            if (input) {
                const name = input.name;
                const value = input.checked;
                this.handleInputChange(name, value);
            }
        });

        // Button clicks
        this.shadowRoot.addEventListener('click', (event) => {
            const button = event.target.closest('.edit-btn, .delete-btn, .cancel-btn');
            if (!button) return;

            if (button.matches('.edit-btn')) {
                this.handleEdit(Number(button.dataset.id));
            } else if (button.matches('.delete-btn')) {
                this.handleDelete(Number(button.dataset.id));
            } else if (button.matches('.cancel-btn')) {
                this.handleCancel();
            }
        });
    }

    handleInputChange(name, value) {
        this.setState(state => ({
            formData: {
                ...state.formData,
                [name]: value
            }
        }));
    }

    async fetchUsers() {
        this.setState({ isLoading: true, error: null });

        try {
            const users = await userService.fetchUsers();
            this.setState({ users, isLoading: false });
        } catch (error) {
            this.handleError('Failed to fetch users', error);
        }
    }

    async handleSubmit() {
        const { formData, editingUser } = this.getState();

        const validation = validateUserData(formData);
        if (!validation.isValid) {
            this.setState({ error: Object.values(validation.errors)[0] });
            return;
        }

        this.setState({ isLoading: true, error: null });

        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData);
            } else {
                await userService.createUser(formData);
            }

            this.resetForm();
            await this.fetchUsers();
        } catch (error) {
            this.handleError('Failed to save user', error);
        }
    }

    handleEdit(userId) {
        const { users } = this.getState();
        const user = users.find(u => u.id === userId);

        if (user) {
            this.setState({
                editingUser: user,
                formData: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    active: user.active
                }
            });
        }
    }

    async handleDelete(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        this.setState({ isLoading: true, error: null });

        try {
            await userService.deleteUser(userId);
            await this.fetchUsers();
        } catch (error) {
            this.handleError('Failed to delete user', error);
        }
    }

    handleCancel() {
        this.resetForm();
    }

    resetForm() {
        this.setState({
            editingUser: null,
            formData: {
                email: '',
                first_name: '',
                last_name: '',
                active: true
            },
            error: null
        });
    }

    handleError(message, error) {
        console.error(message, error);

        this.setState({
            error: error.message || message,
            isLoading: false
        });

        if (this._errorTimeout) {
            clearTimeout(this._errorTimeout);
        }
        this._errorTimeout = setTimeout(() => {
            this.setState({ error: null });
        }, 5000);
    }

    cleanup() {
        if (this._errorTimeout) {
            clearTimeout(this._errorTimeout);
        }
    }

    render() {
        const state = this.getState();
        this.shadowRoot.innerHTML = `
            <style>${styles()}</style>
            ${template(state)}
        `;
    }
}

// Register component
if (!window.customElements.get('users-page')) {
    window.customElements.define('users-page', UsersPageElement);
}

module.exports = UsersPageElement;