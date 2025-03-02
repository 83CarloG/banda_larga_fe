// components/ui/Input.js
"use strict";

/**
 * Creates a reusable input component
 *
 * @param {Object} config - Configuration object
 * @param {string} config.type - Input type (text, email, etc.)
 * @param {string} config.id - Input ID
 * @param {string} config.name - Input name
 * @param {string} config.value - Initial value
 * @param {boolean} config.required - Whether input is required
 * @param {string} config.placeholder - Placeholder text
 * @param {string} config.autocomplete - Autocomplete attribute
 * @param {boolean} config.disabled - Whether input is disabled
 * @param {Function} config.onChange - Change handler
 * @param {Function} config.onFocus - Focus handler
 * @param {Function} config.onBlur - Blur handler
 * @param {Array} config.validators - Array of validator functions
 * @returns {Object} - Input component API
 */
const Input = (config = {}) => {
    const {
        type = 'text',
        id,
        name = id,
        value = '',
        required = false,
        placeholder = '',
        autocomplete = '',
        disabled = false,
        onChange = () => {},
        onFocus = () => {},
        onBlur = () => {},
        validators = []
    } = config;

    // Create input element
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = name;
    input.value = value;
    input.required = required;
    input.className = 'form-input';
    input.placeholder = placeholder;
    input.disabled = disabled;

    if (autocomplete) {
        input.autocomplete = autocomplete;
    }

    if (required) {
        input.setAttribute('aria-required', 'true');
    }

    // Error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'input-error';
    errorContainer.style.color = 'var(--danger-color)';
    errorContainer.style.fontSize = '0.75rem';
    errorContainer.style.marginTop = '0.25rem';
    errorContainer.style.display = 'none';

    // Keep track of errors
    let errors = [];

    // Validate input value
    const validate = () => {
        errors = [];

        for (const validator of validators) {
            const error = validator(input.value);
            if (error) {
                errors.push(error);
                break; // Only show first error
            }
        }

        updateErrorDisplay();
        return errors.length === 0;
    };

    // Update error display
    const updateErrorDisplay = () => {
        if (errors.length > 0) {
            errorContainer.textContent = errors[0];
            errorContainer.style.display = 'block';
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
        } else {
            errorContainer.style.display = 'none';
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
        }
    };

    // Event listeners
    input.addEventListener('input', (e) => {
        onChange(e.target.value, e);
    });

    input.addEventListener('focus', (e) => {
        onFocus(e.target.value, e);
    });

    input.addEventListener('blur', (e) => {
        validate();
        onBlur(e.target.value, e);
    });

    // Public API
    return {
        getElement: () => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            wrapper.appendChild(input);
            wrapper.appendChild(errorContainer);
            return wrapper;
        },

        getInput: () => input,

        getValue: () => input.value,

        setValue: (newValue) => {
            input.value = newValue;
            validate();
        },

        isValid: () => validate(),

        getErrors: () => [...errors],

        setError: (message) => {
            errors = [message];
            updateErrorDisplay();
        },

        clearError: () => {
            errors = [];
            updateErrorDisplay();
        },

        disable: () => {
            input.disabled = true;
        },

        enable: () => {
            input.disabled = false;
        },

        focus: () => {
            input.focus();
        }
    };
};

module.exports = Input;