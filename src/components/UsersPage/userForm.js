// userForm.js - Simplified version with role support
"use strict";

const Input = require('../ui/Input');
const Checkbox = require('../ui/Checkbox');
const Select = require('../ui/Select');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');
const userService = require('./usersService');

/**
 * Creates a user form with role selection
 */
const UserForm = (config = {}) => {
    const {
        user = null,
        onSubmit = () => {},
        onCancel = () => {},
        onError = () => {}
    } = config;

    // Form element setup
    const formElement = document.createElement('form');
    formElement.id = 'userForm';
    formElement.className = 'user-form';

    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = `form-container ${user ? 'editing-mode' : ''}`;
    formContainer.appendChild(formElement);

    // Form data from user or defaults
    const formData = {
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        active: user?.active ?? true,
        role_id: user?.role_id || ''
    };

    // Standard input fields
    const emailInput = Input({
        type: 'email',
        id: 'email',
        value: formData.email,
        required: true,
        onChange: (value) => { formData.email = value; }
    });

    const firstNameInput = Input({
        type: 'text',
        id: 'first_name',
        value: formData.first_name,
        required: true,
        onChange: (value) => { formData.first_name = value; }
    });

    const lastNameInput = Input({
        type: 'text',
        id: 'last_name',
        value: formData.last_name,
        required: true,
        onChange: (value) => { formData.last_name = value; }
    });

    // Role select - fixed options, no API call
    const roleSelect = Select({
        id: 'role_id',
        options: [
            { value: '', label: 'Select a role' },
            { value: '1', label: 'Data Entry' },
            { value: '2', label: 'Supervisor' },
            { value: '3', label: 'Administrator' }
        ],
        value: formData.role_id ? formData.role_id.toString() : '',
        required: true,
        onChange: (value) => { formData.role_id = value; }
    });

    // Status checkbox
    const activeCheckbox = Checkbox({
        id: 'active',
        label: 'Active Status',
        checked: formData.active,
        onChange: (value) => { formData.active = value; }
    });

    // Form groups
    const emailGroup = FormGroup({
        label: 'Email',
        for: 'email',
        component: emailInput,
        required: true
    });

    const firstNameGroup = FormGroup({
        label: 'First Name',
        for: 'first_name',
        component: firstNameInput,
        required: true
    });

    const lastNameGroup = FormGroup({
        label: 'Last Name',
        for: 'last_name',
        component: lastNameInput,
        required: true
    });

    const roleGroup = FormGroup({
        label: 'Role',
        for: 'role_id',
        component: roleSelect,
        required: true
    });

    // Create form grid layout
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';

    // Add form groups to grid
    formGrid.appendChild(emailGroup.getElement());
    formGrid.appendChild(firstNameGroup.getElement());
    formGrid.appendChild(lastNameGroup.getElement());
    formGrid.appendChild(roleGroup.getElement());
    formGrid.appendChild(activeCheckbox.getElement());

    // Add grid to form
    formElement.appendChild(formGrid);

    // Error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-banner';
    errorContainer.style.display = 'none';

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    // Handle form submission
    async function handleSubmit(e) {
        if (e) e.preventDefault();

        // Simple validation
        if (!formData.email || !formData.first_name || !formData.last_name || !formData.role_id) {
            showError('Please fill in all required fields');
            return;
        }

        try {
            // Convert role_id to number
            const submitData = {
                ...formData,
                role_id: formData.role_id ? parseInt(formData.role_id, 10) : null
            };

            let response;
            if (user) {
                response = await userService.updateUser(user.id, submitData);
            } else {
                response = await userService.createUser(submitData);
            }

            onSubmit(response);

        } catch (error) {
            showError(error.message || 'Error saving user');
            onError(error);
        }
    }

    // Add submit and cancel buttons
    const submitButton = Button({
        text: user ? 'Save Changes' : 'Add User',
        type: 'submit',
        variant: 'primary',
        onClick: handleSubmit
    });

    const cancelButton = user ? Button({
        text: 'Cancel',
        type: 'button',
        variant: 'cancel',
        onClick: () => onCancel()
    }) : null;

    // Form actions
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';

    if (cancelButton) {
        formActions.appendChild(cancelButton.getElement());
    }
    formActions.appendChild(submitButton.getElement());

    // Build form
    formElement.appendChild(formActions);
    formContainer.insertBefore(errorContainer, formElement);

    // Listen for submit
    formElement.addEventListener('submit', handleSubmit);

    // Public API
    return {
        getElement: () => formContainer,
        getFormData: () => ({ ...formData })
    };
};

module.exports = UserForm;