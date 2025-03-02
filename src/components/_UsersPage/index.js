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
            submitting: false,  // New property specifically for form submission
            error: null,
            editingUser: null,
            formData: {
                email: '',
                first_name: '',
                last_name: '',
                active: true
            }
        });

        // Add loading timer properties
        this._submittingTimerId = null;
        this._submittingStartTime = null;

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

    // Clean fixed setupEventListeners method
    setupEventListeners() {
        // Keep the original form submission handler
        this.shadowRoot.addEventListener('submit', (event) => {
            if (event.target.matches('#userForm')) {
                event.preventDefault();
                this.handleSubmit();
            }
        });

        // For text and email inputs, update state on input but track and restore focus
        this.shadowRoot.addEventListener('input', (event) => {
            if (event.target.matches('input[type="text"], input[type="email"]')) {
                const name = event.target.name;
                const value = event.target.value;
                const activeElement = event.target;
                const selectionStart = activeElement.selectionStart;
                const selectionEnd = activeElement.selectionEnd;

                // Update state
                this.setState(state => ({
                    formData: {
                        ...state.formData,
                        [name]: value
                    }
                }), () => {
                    // After re-render, restore focus and selection
                    setTimeout(() => {
                        const newInput = this.shadowRoot.querySelector(`input[name="${name}"]`);
                        if (newInput) {
                            newInput.focus();
                            if (newInput.setSelectionRange) {
                                newInput.setSelectionRange(selectionStart, selectionEnd);
                            }
                        }
                    }, 0);
                });
            }
        });

        // Handle checkbox changes
        this.shadowRoot.addEventListener('change', (event) => {
            if (event.target.matches('input[type="checkbox"]')) {
                const name = event.target.name;
                const value = event.target.checked;
                this.handleInputChange(name, value);
            }
        });

        // Button clicks for edit/delete/cancel
        this.shadowRoot.addEventListener('click', (event) => {
            // First check if it's the button itself
            let button = event.target;

            // If not, try to find a button parent (for SVG icons, etc.)
            if (!button.classList ||
                !(button.classList.contains('edit-btn') ||
                    button.classList.contains('delete-btn') ||
                    button.classList.contains('cancel-btn'))) {
                button = event.target.closest('.edit-btn, .delete-btn, .cancel-btn');
            }

            if (!button) return;

            // Prevent any possible double-firing
            event.preventDefault();
            event.stopPropagation();

            if (button.classList.contains('edit-btn')) {
                this.handleEdit(Number(button.dataset.id));
            } else if (button.classList.contains('delete-btn')) {
                this.handleDelete(Number(button.dataset.id));
            } else if (button.classList.contains('cancel-btn')) {
                this.handleCancel();
            }
        });
    }

// Also update handleInputChange to work with our temporary _formData
    handleInputChange(name, value) {
        // First update our direct reference to form data
        this._formData = this._formData || {};
        this._formData[name] = value;

        // Then update the state (which will cause a re-render)
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

        // Start loading and submission state
        this.setState({ isLoading: true, submitting: true, error: null });

        // Record start time
        this._submittingStartTime = Date.now();

        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData);
            } else {
                await userService.createUser(formData);
            }

            // Calculate how much time has passed and ensure minimum 3s
            const elapsedTime = Date.now() - this._submittingStartTime;
            const remainingTime = Math.max(0, 3000 - elapsedTime);

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            this.resetForm();
            await this.fetchUsers();
        } catch (error) {
            // Calculate minimum spinner time
            const elapsedTime = Date.now() - this._submittingStartTime;
            const remainingTime = Math.max(0, 3000 - elapsedTime);

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            this.handleError('Failed to save user', error);
        } finally {
            this.setState({ submitting: false });
        }
    }

    handleEdit(userId) {
        const { users } = this.getState();
        const user = users.find(u => u.id === userId);

        if (user) {
            console.log(user)
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
            error: null,
            submitting: false
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