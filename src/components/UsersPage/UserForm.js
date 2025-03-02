// components/UserForm.js
"use strict";

// Import components and utilities
const Input = require('../ui/Input');
const Checkbox = require('../ui/Checkbox');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');
const Validators = require('../../utils/validators');
const userService = require('./usersService');
const { sanitizeObject } = require('../../utils/security');
const { EVENTS } = require('../../utils/constants');

/**
 * Creates a reusable user form component for create and edit operations
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.user - User data for editing mode
 * @param {Function} config.onSubmit - Submit success callback
 * @param {Function} config.onCancel - Cancel callback
 * @param {Function} config.onError - Error callback
 * @returns {Object} - User form component API
 */
const UserForm = (config = {}) => {
    const {
        user = null,
        onSubmit = () => {},
        onCancel = () => {},
        onError = () => {}
    } = config;

    // Form element
    const formElement = document.createElement('form');
    formElement.id = 'userForm';
    formElement.className = 'user-form';
    formElement.setAttribute('novalidate', '');
    formElement.setAttribute('aria-label', user ? 'Edit User' : 'Add New User');

    // Form container with styling
    const formContainer = document.createElement('div');
    formContainer.className = `form-container ${user ? 'editing-mode' : ''}`;
    formContainer.appendChild(formElement);

    // Component state
    let isSubmitting = false;
    let submittingTimer = null;
    let submittingStartTime = null;

    // Initialize form data from user or defaults
    const initialFormData = {
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        active: user?.active ?? true
    };

    // Create form data object that tracks changes from the inputs
    const formData = { ...initialFormData };

    // Create form controls
    const emailInput = Input({
        type: 'email',
        id: 'email',
        name: 'email',
        value: initialFormData.email,
        required: true,
        autocomplete: 'email',
        validators: [
            Validators.required('Email is required'),
            Validators.email('Please enter a valid email address')
        ],
        onChange: (value) => {
            formData.email = value;
        }
    });

    const emailGroup = FormGroup({
        label: 'Email',
        for: 'email',
        component: emailInput,
        required: true
    });

    const firstNameInput = Input({
        type: 'text',
        id: 'first_name',
        name: 'first_name',
        value: initialFormData.first_name,
        required: true,
        autocomplete: 'given-name',
        validators: [
            Validators.required('First name is required'),
            Validators.minLength(2, 'First name must be at least 2 characters')
        ],
        onChange: (value) => {
            formData.first_name = value;
        }
    });

    const firstNameGroup = FormGroup({
        label: 'First Name',
        for: 'first_name',
        component: firstNameInput,
        required: true
    });

    const lastNameInput = Input({
        type: 'text',
        id: 'last_name',
        name: 'last_name',
        value: initialFormData.last_name,
        required: true,
        autocomplete: 'family-name',
        validators: [
            Validators.required('Last name is required'),
            Validators.minLength(2, 'Last name must be at least 2 characters')
        ],
        onChange: (value) => {
            formData.last_name = value;
        }
    });

    const lastNameGroup = FormGroup({
        label: 'Last Name',
        for: 'last_name',
        component: lastNameInput,
        required: true
    });

    const activeCheckbox = Checkbox({
        id: 'active',
        name: 'active',
        label: 'Active Status',
        checked: initialFormData.active,
        onChange: (value) => {
            formData.active = value;
        }
    });

    // Create form grid for layout
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';
    formGrid.appendChild(emailGroup.getElement());
    formGrid.appendChild(firstNameGroup.getElement());
    formGrid.appendChild(lastNameGroup.getElement());
    formGrid.appendChild(activeCheckbox.getElement());

    // Add form grid to form
    formElement.appendChild(formGrid);

    // Error message container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-banner';
    errorContainer.setAttribute('role', 'alert');
    errorContainer.style.display = 'none';
    errorContainer.innerHTML = `
        <svg class="error-icon" viewBox="0 0 24 24">
            <path d="M13 13H11V7H13M11 15H13V17H11M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 6.47715 17.5228 2 12 2Z"/>
        </svg>
        <span class="error-message"></span>
    `;

    // Submit button
    const submitButton = Button({
        text: user ? 'Save Changes' : 'Add User',
        type: 'submit',
        variant: 'primary',
        ariaLabel: user ? 'Save changes' : 'Add new user',
        onClick: handleSubmit
    });

    // Cancel button (only for edit mode)
    const cancelButton = user ? Button({
        text: 'Cancel',
        type: 'button',
        variant: 'cancel',
        ariaLabel: 'Cancel editing',
        onClick: handleCancel
    }) : null;

    // Form actions container
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';

    if (cancelButton) {
        formActions.appendChild(cancelButton.getElement());
    }

    formActions.appendChild(submitButton.getElement());

    // Add actions to form
    formElement.appendChild(formActions);

    // Add error container before the form in the container
    formContainer.insertBefore(errorContainer, formElement);

    // Form validation
    function validateForm() {
        const isEmailValid = emailInput.isValid();
        const isFirstNameValid = firstNameInput.isValid();
        const isLastNameValid = lastNameInput.isValid();

        // Emit validation event
        const validEvent = new CustomEvent(EVENTS.FORM.VALIDATE, {
            detail: {
                isValid: isEmailValid && isFirstNameValid && isLastNameValid,
                errors: {
                    email: emailInput.getErrors()[0],
                    first_name: firstNameInput.getErrors()[0],
                    last_name: lastNameInput.getErrors()[0]
                }
            },
            bubbles: true
        });
        formElement.dispatchEvent(validEvent);

        return isEmailValid && isFirstNameValid && isLastNameValid;
    }

    // Show error message
    function showError(message) {
        const messageElement = errorContainer.querySelector('.error-message');
        messageElement.textContent = message;
        errorContainer.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);

        // Emit error event
        const errorEvent = new CustomEvent(EVENTS.FORM.ERROR, {
            detail: { message },
            bubbles: true
        });
        formElement.dispatchEvent(errorEvent);
    }

    // Hide error message
    function hideError() {
        errorContainer.style.display = 'none';
    }

    // Set loading state
    function setLoading(loading) {
        isSubmitting = loading;

        if (loading) {
            submitButton.setLoading(true);
            // Don't try to disable/enable the button directly
        } else {
            submitButton.setLoading(false);
            // Don't try to enable the button directly
        }
    }

    // Handle cancel action
    function handleCancel(e) {
        if (e) e.preventDefault();
        onCancel();
    }

    // Handle form submission
    async function handleSubmit(e) {
        if (e) e.preventDefault();

        // Validate form
        if (!validateForm()) {
            showError('Please correct the errors in the form');
            return;
        }

        setLoading(true);
        hideError();

        // Emit submit event
        const submitEvent = new CustomEvent(EVENTS.FORM.SUBMIT, {
            detail: { formData: { ...formData } },
            bubbles: true
        });
        formElement.dispatchEvent(submitEvent);

        try {
            // Sanitize form data before sending to server
            const sanitizedData = sanitizeObject(formData);
            let response;

            if (user) {
                response = await userService.updateUser(user.id, sanitizedData);
            } else {
                response = await userService.createUser(sanitizedData);
            }

            // Ensure minimum loading time of 1 second for feedback
            const elapsedTime = Date.now() - submittingStartTime;
            const minimumLoadingTime = 1000; // 1 second

            if (elapsedTime < minimumLoadingTime) {
                await new Promise(resolve => {
                    submittingTimer = setTimeout(resolve, minimumLoadingTime - elapsedTime);
                });
            }

            // Call success callback
            onSubmit(response);

            // Reset form if not editing
            if (!user) {
                resetForm();
            }
        } catch (error) {
            // Ensure minimum loading time of 1 second for feedback
            const elapsedTime = Date.now() - submittingStartTime;
            const minimumLoadingTime = 1000; // 1 second

            if (elapsedTime < minimumLoadingTime) {
                await new Promise(resolve => {
                    submittingTimer = setTimeout(resolve, minimumLoadingTime - elapsedTime);
                });
            }

            // Handle error
            const errorMessage = error.message || 'Failed to save user';
            showError(errorMessage);
            onError(error);
        } finally {
            setLoading(false);
        }
    }

    // Reset form to initial state
    function resetForm() {
        emailInput.setValue('');
        firstNameInput.setValue('');
        lastNameInput.setValue('');
        activeCheckbox.setValue(true);

        // Reset form data
        Object.assign(formData, {
            email: '',
            first_name: '',
            last_name: '',
            active: true
        });

        // Clear any errors
        hideError();
    }

    // Clean up timers on destruction
    function cleanup() {
        if (submittingTimer) {
            clearTimeout(submittingTimer);
        }
    }

    // Set submit event on form
    formElement.addEventListener('submit', handleSubmit);

    // Public API
    return {
        getElement: () => formContainer,

        getFormData: () => ({ ...formData }),

        setFormData: (data) => {
            // Update local data object
            Object.assign(formData, data);

            // Update input components
            emailInput.setValue(data.email || '');
            firstNameInput.setValue(data.first_name || '');
            lastNameInput.setValue(data.last_name || '');
            activeCheckbox.setValue(data.active ?? true);
        },

        reset: resetForm,

        validate: validateForm,

        cleanup,

        submit: handleSubmit,

        setError: showError,

        clearError: hideError
    };
};

module.exports = UserForm;