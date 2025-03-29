// components/ui/Select.js
"use strict";

/**
 * Creates a simple select component
 *
 * @param {Object} config - Configuration object
 * @param {string} config.id - Select ID
 * @param {Array} config.options - Select options array of {value, label} objects
 * @param {string} config.value - Initial selected value
 * @param {boolean} config.required - Whether select is required
 * @param {Function} config.onChange - Change handler
 * @returns {Object} - Select component API
 */
const Select = (config = {}) => {
    const {
        id,
        name = id,
        options = [],
        value = '',
        required = false,
        disabled = false,
        onChange = () => {}
    } = config;

    // Create select element
    const select = document.createElement('select');
    select.id = id;
    select.name = name;
    select.required = required;
    select.className = 'form-select';
    select.disabled = disabled;

    // Add options to select
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });

    // Set initial value
    select.value = value;

    // Event listeners
    select.addEventListener('change', (e) => {
        onChange(e.target.value, e);
    });

    // Public API
    return {
        getElement: () => select,
        getValue: () => select.value,
        setValue: (newValue) => {
            select.value = newValue;
        }
    };
};

module.exports = Select;