"use strict";

/**
 * Creates a reusable multi-select component
 *
 * @param {Object} config - Configuration object
 * @param {string} config.id - Select ID
 * @param {Array} config.options - Select options array of {value, label} objects
 * @param {Array} config.values - Initial selected values
 * @param {boolean} config.required - Whether select is required
 * @param {Function} config.onChange - Change handler
 * @returns {Object} - MultiSelect component API
 */
const MultiSelect = (config = {}) => {
    const {
        id,
        name = id,
        options = [],
        values = [],
        required = false,
        disabled = false,
        placeholder = 'Select options',
        onChange = () => {}
    } = config;

    // Container element
    const container = document.createElement('div');
    container.className = 'multi-select-container';
    container.style.position = 'relative';

    // Selected items container
    const selectedContainer = document.createElement('div');
    selectedContainer.className = 'selected-items';
    selectedContainer.style.display = 'flex';
    selectedContainer.style.flexWrap = 'wrap';
    selectedContainer.style.gap = '0.5rem';
    selectedContainer.style.padding = '0.5rem';
    selectedContainer.style.minHeight = '42px';
    selectedContainer.style.border = '1px solid var(--border-color)';
    selectedContainer.style.borderRadius = '0.5rem';
    selectedContainer.style.cursor = 'pointer';

    // Create hidden select for form submission
    const hiddenSelect = document.createElement('select');
    hiddenSelect.id = id;
    hiddenSelect.name = name;
    hiddenSelect.multiple = true;
    hiddenSelect.required = required;
    hiddenSelect.style.display = 'none';
    hiddenSelect.disabled = disabled;

    // Add options to hidden select
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        optionElement.selected = values.includes(option.value);
        hiddenSelect.appendChild(optionElement);
    });

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'multi-select-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.left = '0';
    dropdown.style.right = '0';
    dropdown.style.zIndex = '1000'; // Ensure it's above other elements
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid var(--border-color)';
    dropdown.style.borderRadius = '0.5rem';
    dropdown.style.marginTop = '0.25rem';
    dropdown.style.maxHeight = '200px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    dropdown.style.display = 'none';

    // Store selected values
    let selectedValues = [...values];

    // Update selected items display
    const updateSelectedDisplay = () => {
        selectedContainer.innerHTML = '';

        if (selectedValues.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.textContent = 'Select options';
            placeholder.style.color = '#64748b';
            selectedContainer.appendChild(placeholder);
            return;
        }

        selectedValues.forEach(value => {
            const option = options.find(opt => opt.value === value);
            if (!option) return;

            const chip = document.createElement('span');
            chip.className = 'selected-chip';
            chip.textContent = option.label;
            chip.dataset.value = value;
            chip.style.backgroundColor = 'var(--background-light)';
            chip.style.padding = '0.25rem 0.5rem';
            chip.style.borderRadius = '0.25rem';
            chip.style.fontSize = '0.875rem';
            chip.style.display = 'flex';
            chip.style.alignItems = 'center';

            if (!disabled) {
                const removeBtn = document.createElement('span');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.marginLeft = '0.5rem';
                removeBtn.style.cursor = 'pointer';
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeValue(value);
                });
                chip.appendChild(removeBtn);
            }

            selectedContainer.appendChild(chip);
        });
    };

    // Create dropdown options
    const createDropdownOptions = () => {
        dropdown.innerHTML = '';

        options.forEach(option => {
            const optItem = document.createElement('div');
            optItem.className = 'dropdown-item';
            optItem.textContent = option.label;
            optItem.dataset.value = option.value;
            optItem.style.padding = '0.5rem';
            optItem.style.cursor = 'pointer';

            if (selectedValues.includes(option.value)) {
                optItem.style.backgroundColor = 'var(--background-light)';
                optItem.style.fontWeight = '500';
            }

            optItem.addEventListener('click', () => {
                toggleValue(option.value);
            });

            optItem.addEventListener('mouseover', () => {
                optItem.style.backgroundColor = 'var(--background-light)';
            });

            optItem.addEventListener('mouseout', () => {
                if (!selectedValues.includes(option.value)) {
                    optItem.style.backgroundColor = '';
                }
            });

            dropdown.appendChild(optItem);
        });
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        const isVisible = dropdown.style.display === 'block';

        // Close all other dropdowns first
        document.querySelectorAll('.multi-select-dropdown').forEach(d => {
            if (d !== dropdown) d.style.display = 'none';
        });

        // Toggle this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            createDropdownOptions();
            // Make sure dropdown is properly positioned
            dropdown.style.top = `${selectedContainer.offsetHeight}px`;
            dropdown.style.width = `${selectedContainer.offsetWidth}px`;
        }
    };

    // Toggle a value selection
    const toggleValue = (value) => {
        const index = selectedValues.indexOf(value);

        if (index === -1) {
            selectedValues.push(value);
        } else {
            selectedValues.splice(index, 1);
        }

        // Update hidden select
        Array.from(hiddenSelect.options).forEach(option => {
            option.selected = selectedValues.includes(option.value);
        });

        updateSelectedDisplay();
        createDropdownOptions();

        // Trigger change event
        const event = new Event('change', { bubbles: true });
        hiddenSelect.dispatchEvent(event);

        onChange(selectedValues);
    };

    // Remove a value
    const removeValue = (value) => {
        const index = selectedValues.indexOf(value);
        if (index !== -1) {
            selectedValues.splice(index, 1);

            // Update hidden select
            Array.from(hiddenSelect.options).forEach(option => {
                option.selected = selectedValues.includes(option.value);
            });

            updateSelectedDisplay();

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            hiddenSelect.dispatchEvent(event);

            onChange(selectedValues);
        }
    };

    // Set initial selected values
    values.forEach(value => {
        const option = Array.from(hiddenSelect.options).find(opt => opt.value === value);
        if (option) {
            option.selected = true;
        }
    });

    // Click handler for the container
    selectedContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (!disabled) {
            toggleDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Make sure the dropdown appears directly after the container
    container.appendChild(dropdown);

    // Add a visual indicator that this is a dropdown
    const dropdownArrow = document.createElement('span');
    dropdownArrow.innerHTML = '&#9662;'; // Down arrow character
    dropdownArrow.style.position = 'absolute';
    dropdownArrow.style.right = '10px';
    dropdownArrow.style.top = '50%';
    dropdownArrow.style.transform = 'translateY(-50%)';
    dropdownArrow.style.pointerEvents = 'none'; // So clicks pass through to the container
    selectedContainer.style.position = 'relative';
    selectedContainer.style.paddingRight = '25px'; // Make room for the arrow
    selectedContainer.appendChild(dropdownArrow);

    // Initialize display
    updateSelectedDisplay();

    // Build component - ensure proper ordering
    container.appendChild(selectedContainer);
    container.appendChild(hiddenSelect);

    // Create click-to-select text
    const helpText = document.createElement('small');
    helpText.className = 'multi-select-help';
    helpText.style.color = '#64748b';
    helpText.style.fontSize = '0.75rem';
    helpText.style.marginTop = '0.25rem';
    helpText.style.display = 'block';
    helpText.textContent = 'Click to select options';
    container.appendChild(helpText);

    // Force dropdown visibility initially then hide (helps with some browser rendering issues)
    dropdown.style.display = 'block';
    setTimeout(() => {
        dropdown.style.display = 'none';
    }, 10);

    // Error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'input-error';
    errorContainer.style.color = 'var(--danger-color)';
    errorContainer.style.fontSize = '0.75rem';
    errorContainer.style.marginTop = '0.25rem';
    errorContainer.style.display = 'none';
    container.appendChild(errorContainer);

    // Validation
    const validate = () => {
        if (required && selectedValues.length === 0) {
            errorContainer.textContent = 'Please select at least one option';
            errorContainer.style.display = 'block';
            return false;
        }

        errorContainer.style.display = 'none';
        return true;
    };

    // Public API
    return {
        getElement: () => container,

        getInput: () => hiddenSelect,

        getValue: () => selectedValues,

        setValue: (newValues) => {
            if (!Array.isArray(newValues)) {
                newValues = [newValues].filter(Boolean);
            }

            selectedValues = newValues;

            // Update hidden select
            Array.from(hiddenSelect.options).forEach(option => {
                option.selected = selectedValues.includes(option.value);
            });

            updateSelectedDisplay();

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            hiddenSelect.dispatchEvent(event);
        },

        isValid: () => validate(),

        disable: () => {
            disabled = true;
            hiddenSelect.disabled = true;
            selectedContainer.style.opacity = '0.7';
            selectedContainer.style.cursor = 'not-allowed';
        },

        enable: () => {
            disabled = false;
            hiddenSelect.disabled = false;
            selectedContainer.style.opacity = '1';
            selectedContainer.style.cursor = 'pointer';
        },

        // Debug method
        showDropdown: () => {
            dropdown.style.display = 'block';
            createDropdownOptions();
        }
    };
};

module.exports = MultiSelect;