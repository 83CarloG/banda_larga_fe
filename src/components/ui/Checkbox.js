// components/ui/Checkbox.js
"use strict";

/**
 * Creates a reusable checkbox component that matches the existing styling
 *
 * @param {Object} config - Configuration object
 * @param {string} config.id - Checkbox ID
 * @param {string} config.name - Checkbox name
 * @param {string} config.label - Checkbox label
 * @param {boolean} config.checked - Initial checked state
 * @param {boolean} config.disabled - Whether checkbox is disabled
 * @param {Function} config.onChange - Change handler
 * @returns {Object} - Checkbox component API
 */
const Checkbox = (config = {}) => {
    const {
        id,
        name = id,
        label = '',
        checked = false,
        disabled = false,
        onChange = () => {}
    } = config;

    // Create checkbox element (hidden visually but accessible)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.name = name;
    checkbox.checked = checked;
    checkbox.disabled = disabled;
    checkbox.className = 'visually-hidden';

    // Create label with custom styled checkbox
    const labelElement = document.createElement('label');
    labelElement.className = 'checkbox-label';
    labelElement.htmlFor = id;

    // Create custom checkbox visual (the checkmark span)
    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';

    // Label text
    const labelText = document.createTextNode(label);

    // Build label structure
    labelElement.appendChild(checkbox);
    labelElement.appendChild(checkmark);
    labelElement.appendChild(labelText);

    // Event listeners
    checkbox.addEventListener('change', (e) => {
        onChange(e.target.checked, e);
    });

    // Public API
    return {
        getElement: () => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-group checkbox-group';
            wrapper.appendChild(labelElement);
            return wrapper;
        },

        getInput: () => checkbox,

        getValue: () => checkbox.checked,

        setValue: (newValue) => {
            checkbox.checked = Boolean(newValue);
            // Dispatch change event to trigger any listeners
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        },

        disable: () => {
            checkbox.disabled = true;
        },

        enable: () => {
            checkbox.disabled = false;
        }
    };
};

module.exports = Checkbox;