// userForm.js - Updated version with centers support
"use strict";

const Input = require('../ui/Input');
const Checkbox = require('../ui/Checkbox');
const Select = require('../ui/Select');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');
const MultiSelect = require('../ui/MultiSelect');
const userService = require('./usersService');

/**
 * Creates a user form with role selection and centers multi-select
 */
const UserForm = (config = {}) => {
    const {
        user = null,
        centers = [],
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

    // Extract center IDs from user if present
    const userCenterIds = Array.isArray(user?.centers) ?
        user.centers.map(center => center.id.toString()) : [];

    console.log('User centers:', user?.centers);
    console.log('Center IDs for form:', userCenterIds);

    // Form data from user or defaults
    const formData = {
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        active: user?.active ?? true,
        role_id: user?.role_id || '',
        center_ids: userCenterIds
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

    // Role select
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

    // Centers multi-select
    const centerOptions = centers.map(center => ({
        value: center.id.toString(),
        label: `${center.center_name}${center.center_description ? ' - ' + center.center_description : ''}`
    }));

    const centersSelect = MultiSelect({
        id: 'center_ids',
        options: centerOptions,
        values: formData.center_ids,
        required: true,
        onChange: (values) => {
            formData.center_ids = values;
            console.log('Centers selected:', values);
        }
    });

    // Status checkbox
    const activeCheckbox = Checkbox({
        id: 'active',
        label: 'Attivo',
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
        label: 'Nome',
        for: 'first_name',
        component: firstNameInput,
        required: true
    });

    const lastNameGroup = FormGroup({
        label: 'Cognome',
        for: 'last_name',
        component: lastNameInput,
        required: true
    });

    const roleGroup = FormGroup({
        label: 'Ruolo',
        for: 'role_id',
        component: roleSelect,
        required: true
    });

    const centersGroup = FormGroup({
        label: 'Centri',
        for: 'center_ids',
        component: centersSelect,
        required: true,
        helpText: ''
    });

    // Create form grid layout
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';

    // Add form groups to grid
    formGrid.appendChild(emailGroup.getElement());
    formGrid.appendChild(firstNameGroup.getElement());
    formGrid.appendChild(lastNameGroup.getElement());
    formGrid.appendChild(roleGroup.getElement());
    formGrid.appendChild(centersGroup.getElement());
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

        // Validate centers
        if (!formData.center_ids || formData.center_ids.length === 0) {
            showError('Please select at least one center');
            return;
        }

        try {
            // Convert role_id to number and ensure center_ids is an array of numbers
            const submitData = {
                ...formData,
                role_id: formData.role_id ? parseInt(formData.role_id, 10) : null,
                center_ids: formData.center_ids.map(id => parseInt(id, 10))
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
        text: user ? 'Save Changes' : ' +   Aggiungi Utente',
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