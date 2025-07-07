// components/CentersPage/centerForm.js
"use strict";

const Input = require('../ui/Input');
const Checkbox = require('../ui/Checkbox');
const FormGroup = require('../ui/FormGroup');
const Button = require('../ui/Button');
const centerService = require('./centersService');

/**
 * Creates a multiselect component for center types
 */
const MultiSelect = (config = {}) => {
    const {
        id = 'type',
        value = [],
        options = [], // now array of {label, value}
        onChange = () => {}
    } = config;

    // Container element
    const container = document.createElement('div');
    container.className = 'multi-select-container';

    // Label
    const label = document.createElement('label');
    label.htmlFor = id;
    label.className = 'multi-label';
    label.textContent = 'Center Types';
    const requiredSpan = document.createElement('span');
    requiredSpan.className = 'required';
    requiredSpan.textContent = ' *';
    requiredSpan.style.color = 'var(--danger-color)';
    label.appendChild(requiredSpan);
    container.appendChild(label);

    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'multi-select-options';

    // Track selected values (array of values)
    let selectedValues = Array.isArray(value) ? [...value] : [];

    // Create checkboxes for each option
    options.forEach(optionObj => {
        const option = typeof optionObj === 'object' ? optionObj.value : optionObj;
        const labelText = typeof optionObj === 'object' ? optionObj.label : optionObj;
        const isChecked = selectedValues.includes(option);

        const optContainer = document.createElement('div');
        optContainer.className = 'multi-option-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${id}-${option}`;
        checkbox.value = option;
        checkbox.checked = isChecked;

        const optLabel = document.createElement('label');
        optLabel.htmlFor = `${id}-${option}`;
        optLabel.textContent = labelText;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (!selectedValues.includes(option)) {
                    selectedValues.push(option);
                }
            } else {
                selectedValues = selectedValues.filter(val => val !== option);
            }
            onChange(selectedValues);
        });

        optContainer.appendChild(checkbox);
        optContainer.appendChild(optLabel);
        optionsContainer.appendChild(optContainer);
    });

    container.appendChild(optionsContainer);

    // Public API
    return {
        getElement: () => container,
        getValue: () => selectedValues,
        setValue: (newValues) => {
            if (!Array.isArray(newValues)) return;

            selectedValues = [...newValues];

            // Update checkbox states
            options.forEach(optionObj => {
                const option = typeof optionObj === 'object' ? optionObj.value : optionObj;
                const checkbox = optionsContainer.querySelector(`#${id}-${option}`);
                if (checkbox) {
                    checkbox.checked = selectedValues.includes(option);
                }
            });
        }
    };
};

/**
 * Creates a center form
 */
const CenterForm = (config = {}) => {
    const {
        center = null,
        centerTypes = [],
        onSubmit = () => {},
        onCancel = () => {},
        onError = () => {}
    } = config;

    // Form element setup
    const formElement = document.createElement('form');
    formElement.id = 'centerForm';
    formElement.className = 'center-form';

    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = `form-container ${center && center.id ? 'editing-mode' : ''}`;
    formContainer.appendChild(formElement);

    // Form data from center or defaults
    const formData = {
        name: center?.name || '',
        type: center?.type || [],
        openDate: center?.openDate || '',
        mission: center?.mission || '',
        fiscalCode: center?.fiscalCode || '',
        director: center?.director || '',
        address: center?.address || '',
        phone: center?.phone || '',
        email: center?.email || '',
        active: center?.active ?? true,
        notes: center?.notes || ''
    };

    // Build options for MultiSelect from centerTypes
    const typeOptions = Array.isArray(centerTypes) && centerTypes.length > 0
        ? centerTypes.map(type => ({ label: type.type_label, value: type.id }))
        : [
            { label: 'Cibo', value: '1' },
            { label: 'Dormitorio', value: '2' },
            { label: 'Housing', value: '3' },
            { label: 'Psicologico', value: '4' },
            { label: 'Collocamento lavorativo', value: '5' },
            { label: 'Formazione', value: '6' },
            { label: 'Abiti e altri beni', value: '7' },
            { label: 'Trasporto', value: '8' }
        ];

    // Form fields
    const nameInput = Input({
        type: 'text',
        id: 'name',
        value: formData.name,
        required: true,
        onChange: (value) => { formData.name = value; }
    });

    const typeSelect = MultiSelect({
        id: 'type',
        value: formData.type,
        options: typeOptions,
        onChange: (value) => { formData.type = value; }
    });

    const openDateInput = Input({
        type: 'date',
        id: 'openDate',
        value: formData.openDate,
        required: true,
        onChange: (value) => { formData.openDate = value; }
    });

    // Create a custom textarea element
    const createTextarea = (id, value, required = false, onChange = () => {}) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'textarea-wrapper';

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.className = 'form-textarea';
        textarea.value = value;
        textarea.required = required;

        textarea.addEventListener('input', (e) => {
            onChange(e.target.value);
        });

        wrapper.appendChild(textarea);

        return {
            getElement: () => wrapper,
            getValue: () => textarea.value,
            setValue: (newValue) => {
                textarea.value = newValue;
            }
        };
    };

    const missionTextarea = createTextarea(
        'mission',
        formData.mission,
        true,
        (value) => { formData.mission = value; }
    );

    const fiscalCodeInput = Input({
        type: 'text',
        id: 'fiscalCode',
        value: formData.fiscalCode,
        required: true,
        onChange: (value) => { formData.fiscalCode = value; }
    });

    const directorInput = Input({
        type: 'text',
        id: 'director',
        value: formData.director,
        required: true,
        onChange: (value) => { formData.director = value; }
    });

    const addressInput = Input({
        type: 'text',
        id: 'address',
        value: formData.address,
        required: true,
        onChange: (value) => { formData.address = value; }
    });

    const phoneInput = Input({
        type: 'tel',
        id: 'phone',
        value: formData.phone,
        required: true,
        onChange: (value) => { formData.phone = value; }
    });

    const emailInput = Input({
        type: 'email',
        id: 'email',
        value: formData.email,
        required: true,
        onChange: (value) => { formData.email = value; }
    });

    const activeCheckbox = Checkbox({
        id: 'active',
        label: 'Active Status',
        checked: formData.active,
        onChange: (value) => { formData.active = value; }
    });

    const notesTextarea = createTextarea(
        'notes',
        formData.notes,
        false,
        (value) => { formData.notes = value; }
    );

    // Form groups
    const nameGroup = FormGroup({
        label: 'Center Name',
        for: 'name',
        component: nameInput,
        required: true
    });

    const typeGroup = FormGroup({
        label: 'Center Types',
        for: 'type',
        component: typeSelect,
        required: true
    });

    const openDateGroup = FormGroup({
        label: 'Opening Date',
        for: 'openDate',
        component: openDateInput,
        required: true
    });

    const missionGroup = FormGroup({
        label: 'Mission/Description',
        for: 'mission',
        component: missionTextarea,
        required: true
    });

    const fiscalCodeGroup = FormGroup({
        label: 'Fiscal Code/VAT Number',
        for: 'fiscalCode',
        component: fiscalCodeInput,
        required: true
    });

    const directorGroup = FormGroup({
        label: 'Director/Manager',
        for: 'director',
        component: directorInput,
        required: true
    });

    const addressGroup = FormGroup({
        label: 'Address',
        for: 'address',
        component: addressInput,
        required: true
    });

    const phoneGroup = FormGroup({
        label: 'Phone Number',
        for: 'phone',
        component: phoneInput,
        required: true
    });

    const emailGroup = FormGroup({
        label: 'Email',
        for: 'email',
        component: emailInput,
        required: true
    });

    const notesGroup = FormGroup({
        label: 'Additional Notes',
        for: 'notes',
        component: notesTextarea,
        required: false
    });

    // Create form grid layout
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';

    // Add form groups to grid
    formGrid.appendChild(nameGroup.getElement());

    // Type is full width
    const typeWrapper = document.createElement('div');
    typeWrapper.className = 'form-full-width';
    typeWrapper.appendChild(typeGroup.getElement());
    formGrid.appendChild(typeWrapper);

    formGrid.appendChild(openDateGroup.getElement());
    formGrid.appendChild(fiscalCodeGroup.getElement());
    formGrid.appendChild(directorGroup.getElement());
    formGrid.appendChild(addressGroup.getElement());
    formGrid.appendChild(phoneGroup.getElement());
    formGrid.appendChild(emailGroup.getElement());
    formGrid.appendChild(activeCheckbox.getElement());

    // Mission is full width
    const missionWrapper = document.createElement('div');
    missionWrapper.className = 'form-full-width';
    missionWrapper.appendChild(missionGroup.getElement());
    formGrid.appendChild(missionWrapper);

    // Notes are full width
    const notesWrapper = document.createElement('div');
    notesWrapper.className = 'form-full-width';
    notesWrapper.appendChild(notesGroup.getElement());
    formGrid.appendChild(notesWrapper);

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
        if (!formData.name || !formData.openDate || !formData.mission || !formData.fiscalCode ||
            !formData.director || !formData.address || !formData.phone || !formData.email) {
            showError('Please fill in all required fields');
            return;
        }

        if (!formData.type || formData.type.length === 0) {
            showError('Please select at least one center type');
            return;
        }

        try {
            let response;
            if (center && center.id) {
                response = await centerService.updateCenter(center.id, formData);
            } else {
                response = await centerService.createCenter(formData);
            }

            onSubmit(response);

        } catch (error) {
            showError(error.message || 'Error saving center');
            onError(error);
        }
    }

    // Add submit and cancel buttons
    const submitButton = Button({
        text: center && center.id ? 'Save Changes' : 'Add Center',
        type: 'submit',
        variant: 'primary',
        onClick: handleSubmit
    });

    const cancelButton = Button({
        text: 'Cancel',
        type: 'button',
        variant: 'cancel',
        onClick: () => onCancel()
    });

    // Form actions
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';

    formActions.appendChild(cancelButton.getElement());
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

module.exports = CenterForm;