"use strict";

/**
 * Creates a reusable form group component with label and input component
 *
 * @param {Object} config - Configuration object
 * @param {string} config.label - Label text
 * @param {string} config.for - ID of the input element
 * @param {Object} config.component - Input component instance
 * @param {boolean} config.required - Whether field is required
 * @param {string} config.helpText - Optional help text
 * @returns {Object} - Form group component API
 */
const FormGroup = (config = {}) => {
    const {
        label = '',
        for: forId = '',
        component = null,
        required = false,
        helpText = ''
    } = config;

    // Create main container
    const container = document.createElement('div');
    container.className = 'form-group';

    // Create label if provided
    if (label) {
        const labelElement = document.createElement('label');
        labelElement.htmlFor = forId;
        labelElement.textContent = label;

        // Add required indicator
        if (required) {
            const requiredSpan = document.createElement('span');
            requiredSpan.className = 'required';
            requiredSpan.textContent = ' *';
            requiredSpan.style.color = 'var(--danger-color)';
            labelElement.appendChild(requiredSpan);
        }

        container.appendChild(labelElement);
    }

    // Add component
    if (component && typeof component.getElement === 'function') {
        container.appendChild(component.getElement());
    }

    // Add help text if provided
    let helpElement = null;
    if (helpText) {
        helpElement = document.createElement('small');
        helpElement.className = 'help-text';
        helpElement.textContent = helpText;
        helpElement.style.display = 'block';
        helpElement.style.marginTop = '0.25rem';
        helpElement.style.color = '#64748b';
        container.appendChild(helpElement);
    }

    // Public API
    return {
        getElement: () => container,

        getComponent: () => component,

        setHelpText: (text) => {
            if (helpElement) {
                helpElement.textContent = text;
            } else if (text) {
                helpElement = document.createElement('small');
                helpElement.className = 'help-text';
                helpElement.textContent = text;
                helpElement.style.display = 'block';
                helpElement.style.marginTop = '0.25rem';
                helpElement.style.color = '#64748b';
                container.appendChild(helpElement);
            }
        }
    };
};

module.exports = FormGroup;