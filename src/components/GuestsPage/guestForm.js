// guestForm.js
"use strict";

const Input = require('../ui/Input');
const Select = require('../ui/Select');
const Checkbox = require('../ui/Checkbox');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');
const guestService = require('./guestService');

/**
 * Creates a multi-step guest form
 */
const GuestForm = (config = {}) => {
    // Default configuration
    const {
        guest = null,
        initialStep = 0, // Add support for initial step
        onSubmit = () => {},
        onCancel = () => {},
        onError = () => {}
    } = config;

    // Form element
    const formElement = document.createElement('form');
    formElement.id = 'guestForm';
    formElement.className = 'guest-form';

    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = `guest-form-container ${guest ? 'editing-mode' : ''}`;
    formContainer.appendChild(formElement);

    // Form steps
    const steps = [
        { id: 'anagrafica', title: 'Anagrafica', icon: '🧑‍💼' },
        { id: 'economica', title: 'Situazione Economica e Salute', icon: '💰' },
        { id: 'relazioni', title: 'Rete e Relazioni', icon: '👥' },
        { id: 'casa', title: 'Casa/Abitazione', icon: '🏠' },
        { id: 'lavoro', title: 'Lavoro/Occupazione', icon: '💼' },
        { id: 'alimentazione', title: 'Cibo/Alimentazione', icon: '🍽️' },
        { id: 'riepilogo', title: 'Riepilogo', icon: '📋' }
    ];

    // Form data state
    const formData = {
        // Anagrafica
        guest_code: guest?.guest_code || '',
        guest_first_name: guest?.guest_first_name || '',
        guest_last_name: guest?.guest_last_name || '',
        guest_birth_date: guest?.guest_birth_date || '',
        guest_birth_place: guest?.guest_birth_place || '',
        guest_sex: guest?.guest_sex || 'M',
        guest_fiscal_code: guest?.guest_fiscal_code || '',
        guest_nationality: guest?.guest_nationality || 'Italiana',
        guest_phone_number: guest?.guest_phone_number || '',
        guest_email: guest?.guest_email || '',
        guest_emergency_contact: guest?.guest_emergency_contact || '',
        guest_additional_info: guest?.guest_additional_info || '',
        guest_note: guest?.guest_note || '',

        // Casa/Abitazione
        casa_problematiche: guest?.casa_problematiche || false,
        casa_sfd: guest?.casa_sfd || false, // Senza Fissa Dimora
        casa_residenza_comune: guest?.casa_residenza_comune || '',
        casa_residenza_cap: guest?.casa_residenza_cap || '',
        casa_residenza_indirizzo: guest?.casa_residenza_indirizzo || '',
        casa_domicilio_comune: guest?.casa_domicilio_comune || '',
        casa_domicilio_cap: guest?.casa_domicilio_cap || '',
        casa_domicilio_indirizzo: guest?.casa_domicilio_indirizzo || '',
        casa_situazione: guest?.casa_situazione || '',

        // Lavoro/Occupazione
        lavoro_titolo_studio: guest?.lavoro_titolo_studio || '',
        lavoro_attestati: guest?.lavoro_attestati || '',
        lavoro_patente: guest?.lavoro_patente || '',
        lavoro_possesso_auto: guest?.lavoro_possesso_auto || false,
        lavoro_conoscenza_pc: guest?.lavoro_conoscenza_pc || false,
        lavoro_conoscenza_lingue: guest?.lavoro_conoscenza_lingue || '',
        lavoro_occupazione: guest?.lavoro_occupazione || 'No',
        lavoro_copertura_previdenziale: guest?.lavoro_copertura_previdenziale || 'No',
        lavoro_svolto: guest?.lavoro_svolto || '',
        lavoro_note: guest?.lavoro_note || '',
        lavoro_ore_settimanali: guest?.lavoro_ore_settimanali || '',

        // Alimentazione
        alimentazione_spese_vitto: guest?.alimentazione_spese_vitto || '',
        alimentazione_note: guest?.alimentazione_note || '',

        // Other sections fields can be added later
    };

    // Field validation
    const validators = {
        // Codice Fiscale validation for Italy
        fiscalCode: (value) => {
            if (!value) return null;

            // Simple validation for Italian Fiscal Code
            const regex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
            if (!regex.test(value)) {
                return 'Invalid Fiscal Code format';
            }
            return null;
        },

        // Email validation
        email: (value) => {
            if (!value) return null;

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(value)) {
                return 'Invalid email format';
            }
            return null;
        },

        // Required field validation
        required: (value) => {
            if (!value || value.trim() === '') {
                return 'This field is required';
            }
            return null;
        }
    };

    // Form state
    let currentStep = initialStep; // Use initialStep from config
    let completedSteps = new Set();
    let formComponents = {};

    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'form-steps';

    // Create progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress-bar';
    progressContainer.appendChild(progressBar);

    // Create step content container
    const stepContent = document.createElement('div');
    stepContent.className = 'step-content';

    // Create form actions
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';

    const actionsLeft = document.createElement('div');
    actionsLeft.className = 'form-actions-left';

    const actionsRight = document.createElement('div');
    actionsRight.className = 'form-actions-right';

    formActions.appendChild(actionsLeft);
    formActions.appendChild(actionsRight);

    // Create buttons
    const backButton = Button({
        text: 'Back',
        type: 'button',
        variant: 'cancel',
        onClick: goToPreviousStep
    });

    const nextButton = Button({
        text: 'Next',
        type: 'button',
        variant: 'primary',
        onClick: goToNextStep
    });

    const submitButton = Button({
        text: guest ? 'Save Changes' : 'Create Guest',
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

    // Initialize form
    function init() {
        // Create steps
        steps.forEach((step, index) => {
            const stepButton = document.createElement('button');
            stepButton.type = 'button';
            stepButton.className = `form-step ${index === currentStep ? 'active' : ''}`;
            stepButton.dataset.step = index;
            stepButton.innerHTML = `
            <span class="step-icon">${step.icon}</span>
            <span class="step-title">${step.title}</span>
        `;

            // Make all tabs directly clickable regardless of completion status
            stepButton.addEventListener('click', () => {
                goToStep(index);
            });

            stepsContainer.appendChild(stepButton);
        });

        // Mark previous steps as completed when starting at a later step
        for (let i = 0; i < currentStep; i++) {
            completedSteps.add(i);
        }

        // Update progress bar
        updateProgress();

        // Setup initial step
        setupStepContent(currentStep);

        // Update buttons
        updateButtons();

        // Build form structure
        formElement.appendChild(stepsContainer);
        formElement.appendChild(progressContainer);
        formElement.appendChild(stepContent);
        formElement.appendChild(formActions);
    }

    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update form buttons based on current step
    function updateButtons() {
        // Clear actions
        actionsLeft.innerHTML = '';
        actionsRight.innerHTML = '';

        // Add cancel button on left
        actionsLeft.appendChild(cancelButton.getElement());

        // Add navigation buttons on right
        if (currentStep > 0) {
            actionsRight.appendChild(backButton.getElement());
        }

        if (currentStep < steps.length - 1) {
            actionsRight.appendChild(nextButton.getElement());
        } else {
            actionsRight.appendChild(submitButton.getElement());
        }
    }

    // Navigate to previous step
    function goToPreviousStep() {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    }

    // Navigate to next step
    function goToNextStep() {
        if (validateCurrentStep()) {
            completedSteps.add(currentStep);
            if (currentStep < steps.length - 1) {
                goToStep(currentStep + 1);
            }
        }
    }

    // Navigate to specific step
    function goToStep(stepIndex) {
        // Store the current step as completed if validation passes
        if (currentStep !== stepIndex && validateCurrentStep()) {
            completedSteps.add(currentStep);
        }

        // Update step buttons
        const stepButtons = stepsContainer.querySelectorAll('.form-step');
        stepButtons.forEach((btn, index) => {
            btn.classList.remove('active');
            if (index === stepIndex) {
                btn.classList.add('active');
            }
            if (completedSteps.has(index)) {
                btn.classList.add('completed');
            }
        });

        // Update current step
        currentStep = stepIndex;

        // Clear step content
        stepContent.innerHTML = '';

        // Setup step content based on current step
        setupStepContent(currentStep);

        // Update progress and buttons
        updateProgress();
        updateButtons();
    }

    // Setup step content based on the current step index
    function setupStepContent(stepIndex) {
        switch(steps[stepIndex].id) {
            case 'anagrafica':
                setupAnagraficaStep();
                break;
            case 'economica':
                setupEconomicaStep();
                break;
            case 'relazioni':
                setupRelazioniStep();
                break;
            case 'casa':
                setupCasaStep();
                break;
            case 'lavoro':
                setupLavoroStep();
                break;
            case 'alimentazione':
                setupAlimentazioneStep();
                break;
            case 'riepilogo':
                setupRiepilogoStep();
                break;
        }
    }

    // Validate current step fields
    function validateCurrentStep() {
        let isValid = true;
        const currentStepId = steps[currentStep].id;

        switch(currentStepId) {
            case 'anagrafica':
                // Validate required fields
                if (!formData.guest_first_name) {
                    formComponents.firstName.setError('First name is required');
                    isValid = false;
                }

                if (!formData.guest_last_name) {
                    formComponents.lastName.setError('Last name is required');
                    isValid = false;
                }

                // Validate fiscal code
                const fiscalCodeError = validators.fiscalCode(formData.guest_fiscal_code);
                if (fiscalCodeError) {
                    formComponents.fiscalCode.setError(fiscalCodeError);
                    isValid = false;
                }

                // Validate email
                const emailError = validators.email(formData.guest_email);
                if (emailError) {
                    formComponents.email.setError(emailError);
                    isValid = false;
                }
                break;

            case 'casa':
                // No strict validation for casa step
                break;

            case 'lavoro':
                // No strict validation for lavoro step
                break;

            case 'alimentazione':
                // No strict validation for alimentazione step
                break;

            // Add validation for other steps as needed
        }

        return isValid;
    }

    // Setup Anagrafica step
    function setupAnagraficaStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Informazioni Anagrafiche</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Guest code
        const guestCodeInput = Input({
            type: 'text',
            id: 'guest_code',
            name: 'guest_code',
            value: formData.guest_code,
            onChange: (value) => { formData.guest_code = value; }
        });

        const guestCodeGroup = FormGroup({
            label: 'Codice Ospite',
            for: 'guest_code',
            component: guestCodeInput
        });

        // First name
        const firstNameInput = Input({
            type: 'text',
            id: 'guest_first_name',
            name: 'guest_first_name',
            value: formData.guest_first_name,
            required: true,
            onChange: (value) => { formData.guest_first_name = value; }
        });

        const firstNameGroup = FormGroup({
            label: 'Nome',
            for: 'guest_first_name',
            component: firstNameInput,
            required: true
        });

        // Last name
        const lastNameInput = Input({
            type: 'text',
            id: 'guest_last_name',
            name: 'guest_last_name',
            value: formData.guest_last_name,
            required: true,
            onChange: (value) => { formData.guest_last_name = value; }
        });

        const lastNameGroup = FormGroup({
            label: 'Cognome',
            for: 'guest_last_name',
            component: lastNameInput,
            required: true
        });

        // Birth date
        const birthDateInput = Input({
            type: 'date',
            id: 'guest_birth_date',
            name: 'guest_birth_date',
            value: formData.guest_birth_date,
            onChange: (value) => { formData.guest_birth_date = value; }
        });

        const birthDateGroup = FormGroup({
            label: 'Data di Nascita',
            for: 'guest_birth_date',
            component: birthDateInput
        });

        // Birth place
        const birthPlaceInput = Input({
            type: 'text',
            id: 'guest_birth_place',
            name: 'guest_birth_place',
            value: formData.guest_birth_place,
            onChange: (value) => { formData.guest_birth_place = value; }
        });

        const birthPlaceGroup = FormGroup({
            label: 'Luogo di Nascita',
            for: 'guest_birth_place',
            component: birthPlaceInput
        });

        // Sex
        const sexSelect = Select({
            id: 'guest_sex',
            name: 'guest_sex',
            options: [
                { value: 'M', label: 'Maschile' },
                { value: 'F', label: 'Femminile' }
            ],
            value: formData.guest_sex,
            onChange: (value) => { formData.guest_sex = value; }
        });

        const sexGroup = FormGroup({
            label: 'Genere',
            for: 'guest_sex',
            component: sexSelect
        });

        // Fiscal code
        const fiscalCodeInput = Input({
            type: 'text',
            id: 'guest_fiscal_code',
            name: 'guest_fiscal_code',
            value: formData.guest_fiscal_code,
            validators: [validators.fiscalCode],
            onChange: (value) => { formData.guest_fiscal_code = value; }
        });

        const fiscalCodeGroup = FormGroup({
            label: 'Codice Fiscale',
            for: 'guest_fiscal_code',
            component: fiscalCodeInput,
            helpText: 'Format: RSSMRA80A01H501Z'
        });

        // Nationality
        const nationalityInput = Input({
            type: 'text',
            id: 'guest_nationality',
            name: 'guest_nationality',
            value: formData.guest_nationality,
            onChange: (value) => { formData.guest_nationality = value; }
        });

        const nationalityGroup = FormGroup({
            label: 'Nazionalità',
            for: 'guest_nationality',
            component: nationalityInput
        });

        // Phone number
        const phoneInput = Input({
            type: 'tel',
            id: 'guest_phone_number',
            name: 'guest_phone_number',
            value: formData.guest_phone_number,
            onChange: (value) => { formData.guest_phone_number = value; }
        });

        const phoneGroup = FormGroup({
            label: 'Numero di Telefono',
            for: 'guest_phone_number',
            component: phoneInput
        });

        // Email
        const emailInput = Input({
            type: 'email',
            id: 'guest_email',
            name: 'guest_email',
            value: formData.guest_email,
            validators: [validators.email],
            onChange: (value) => { formData.guest_email = value; }
        });

        const emailGroup = FormGroup({
            label: 'Email',
            for: 'guest_email',
            component: emailInput
        });

        // Emergency contact
        const emergencyContactInput = Input({
            type: 'tel',
            id: 'guest_emergency_contact',
            name: 'guest_emergency_contact',
            value: formData.guest_emergency_contact,
            onChange: (value) => { formData.guest_emergency_contact = value; }
        });

        const emergencyContactGroup = FormGroup({
            label: 'Contatto di Emergenza',
            for: 'guest_emergency_contact',
            component: emergencyContactInput
        });

        // Add components to grid
        formGrid.appendChild(guestCodeGroup.getElement());
        formGrid.appendChild(firstNameGroup.getElement());
        formGrid.appendChild(lastNameGroup.getElement());
        formGrid.appendChild(birthDateGroup.getElement());
        formGrid.appendChild(birthPlaceGroup.getElement());
        formGrid.appendChild(sexGroup.getElement());
        formGrid.appendChild(fiscalCodeGroup.getElement());
        formGrid.appendChild(nationalityGroup.getElement());
        formGrid.appendChild(phoneGroup.getElement());
        formGrid.appendChild(emailGroup.getElement());
        formGrid.appendChild(emergencyContactGroup.getElement());

        // Store components for validation
        formComponents.guestCode = guestCodeInput;
        formComponents.firstName = firstNameInput;
        formComponents.lastName = lastNameInput;
        formComponents.birthDate = birthDateInput;
        formComponents.birthPlace = birthPlaceInput;
        formComponents.sex = sexSelect;
        formComponents.fiscalCode = fiscalCodeInput;
        formComponents.nationality = nationalityInput;
        formComponents.phone = phoneInput;
        formComponents.email = emailInput;
        formComponents.emergencyContact = emergencyContactInput;

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Economica step (placeholder)
    function setupEconomicaStep() {
        const container = document.createElement('div');
        container.innerHTML = `
            <h3>Situazione Economica e Salute</h3>
            <div class="form-grid">
                <p>Questa sezione è in corso di implementazione. Si prega di procedere alla sezione successiva.</p>
            </div>
        `;
        stepContent.appendChild(container);
        completedSteps.add(currentStep);
    }

    // Setup Relazioni step (placeholder)
    function setupRelazioniStep() {
        const container = document.createElement('div');
        container.innerHTML = `
            <h3>Rete e Relazioni</h3>
            <div class="form-grid">
                <p>Questa sezione è in corso di implementazione. Si prega di procedere alla sezione successiva.</p>
            </div>
        `;
        stepContent.appendChild(container);
        completedSteps.add(currentStep);
    }

    // Setup Casa step
    function setupCasaStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Casa/Abitazione</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Problematiche abitative
        const problematicheCheckbox = Checkbox({
            id: 'casa_problematiche',
            name: 'casa_problematiche',
            label: 'Problematiche abitative',
            checked: formData.casa_problematiche,
            onChange: (value) => { formData.casa_problematiche = value; }
        });

        // Senza fissa dimora
        const sfdCheckbox = Checkbox({
            id: 'casa_sfd',
            name: 'casa_sfd',
            label: 'Senza Fissa Dimora',
            checked: formData.casa_sfd,
            onChange: (value) => { formData.casa_sfd = value; }
        });

        // Residenza - Comune
        const residenzaComuneInput = Input({
            type: 'text',
            id: 'casa_residenza_comune',
            name: 'casa_residenza_comune',
            value: formData.casa_residenza_comune,
            onChange: (value) => { formData.casa_residenza_comune = value; }
        });

        const residenzaComuneGroup = FormGroup({
            label: 'Comune di Residenza',
            for: 'casa_residenza_comune',
            component: residenzaComuneInput
        });

        // Residenza - CAP
        const residenzaCapInput = Input({
            type: 'text',
            id: 'casa_residenza_cap',
            name: 'casa_residenza_cap',
            value: formData.casa_residenza_cap,
            onChange: (value) => { formData.casa_residenza_cap = value; }
        });

        const residenzaCapGroup = FormGroup({
            label: 'CAP Residenza',
            for: 'casa_residenza_cap',
            component: residenzaCapInput
        });

        // Residenza - Indirizzo
        const residenzaIndirizzoInput = Input({
            type: 'text',
            id: 'casa_residenza_indirizzo',
            name: 'casa_residenza_indirizzo',
            value: formData.casa_residenza_indirizzo,
            onChange: (value) => { formData.casa_residenza_indirizzo = value; }
        });

        const residenzaIndirizzoGroup = FormGroup({
            label: 'Indirizzo Residenza',
            for: 'casa_residenza_indirizzo',
            component: residenzaIndirizzoInput
        });

        // Domicilio - Comune
        const domicilioComuneInput = Input({
            type: 'text',
            id: 'casa_domicilio_comune',
            name: 'casa_domicilio_comune',
            value: formData.casa_domicilio_comune,
            onChange: (value) => { formData.casa_domicilio_comune = value; }
        });

        const domicilioComuneGroup = FormGroup({
            label: 'Comune Domicilio',
            for: 'casa_domicilio_comune',
            component: domicilioComuneInput
        });

        // Domicilio - CAP
        const domicilioCapInput = Input({
            type: 'text',
            id: 'casa_domicilio_cap',
            name: 'casa_domicilio_cap',
            value: formData.casa_domicilio_cap,
            onChange: (value) => { formData.casa_domicilio_cap = value; }
        });

        const domicilioCapGroup = FormGroup({
            label: 'CAP Domicilio',
            for: 'casa_domicilio_cap',
            component: domicilioCapInput
        });

        // Domicilio - Indirizzo
        const domicilioIndirizzoInput = Input({
            type: 'text',
            id: 'casa_domicilio_indirizzo',
            name: 'casa_domicilio_indirizzo',
            value: formData.casa_domicilio_indirizzo,
            onChange: (value) => { formData.casa_domicilio_indirizzo = value; }
        });

        const domicilioIndirizzoGroup = FormGroup({
            label: 'Indirizzo Domicilio',
            for: 'casa_domicilio_indirizzo',
            component: domicilioIndirizzoInput
        });

        // Situazione attuale
        const situazioneSelect = Select({
            id: 'casa_situazione',
            name: 'casa_situazione',
            options: [
                { value: '', label: 'Seleziona una situazione' },
                { value: 'Proprietà', label: 'Proprietà' },
                { value: 'Affitto', label: 'Affitto' },
                { value: 'Comodato', label: 'Comodato d\'uso' },
                { value: 'Occupazione', label: 'Occupazione abusiva' },
                { value: 'Ospite', label: 'Ospite presso altri' },
                { value: 'Senzatetto', label: 'Senza fissa dimora' }
            ],
            value: formData.casa_situazione,
            onChange: (value) => { formData.casa_situazione = value; }
        });

        const situazioneGroup = FormGroup({
            label: 'Situazione attuale',
            for: 'casa_situazione',
            component: situazioneSelect
        });

        // Add components to grid
        formGrid.appendChild(problematicheCheckbox.getElement());
        formGrid.appendChild(sfdCheckbox.getElement());
        formGrid.appendChild(situazioneGroup.getElement());
        formGrid.appendChild(residenzaComuneGroup.getElement());
        formGrid.appendChild(residenzaCapGroup.getElement());
        formGrid.appendChild(residenzaIndirizzoGroup.getElement());
        formGrid.appendChild(domicilioComuneGroup.getElement());
        formGrid.appendChild(domicilioCapGroup.getElement());
        formGrid.appendChild(domicilioIndirizzoGroup.getElement());

        // Store components for validation
        formComponents.casaProblematiche = problematicheCheckbox;
        formComponents.casaSfd = sfdCheckbox;
        formComponents.casaSituazione = situazioneSelect;

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Lavoro step
    function setupLavoroStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Lavoro/Occupazione</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Titolo di studio
        const titoloStudioInput = Input({
            type: 'text',
            id: 'lavoro_titolo_studio',
            name: 'lavoro_titolo_studio',
            value: formData.lavoro_titolo_studio,
            onChange: (value) => { formData.lavoro_titolo_studio = value; }
        });

        const titoloStudioGroup = FormGroup({
            label: 'Titolo di Studio',
            for: 'lavoro_titolo_studio',
            component: titoloStudioInput
        });

        // Attestati di formazione
        const attestatiInput = Input({
            type: 'text',
            id: 'lavoro_attestati',
            name: 'lavoro_attestati',
            value: formData.lavoro_attestati,
            onChange: (value) => { formData.lavoro_attestati = value; }
        });

        const attestatiGroup = FormGroup({
            label: 'Attestati di Formazione',
            for: 'lavoro_attestati',
            component: attestatiInput
        });

        // Patente di guida
        const patenteInput = Input({
            type: 'text',
            id: 'lavoro_patente',
            name: 'lavoro_patente',
            value: formData.lavoro_patente,
            onChange: (value) => { formData.lavoro_patente = value; }
        });

        const patenteGroup = FormGroup({
            label: 'Patente di Guida',
            for: 'lavoro_patente',
            component: patenteInput
        });

        // Possesso auto
        const possessoAutoCheckbox = Checkbox({
            id: 'lavoro_possesso_auto',
            name: 'lavoro_possesso_auto',
            label: 'Possesso Auto',
            checked: formData.lavoro_possesso_auto,
            onChange: (value) => { formData.lavoro_possesso_auto = value; }
        });

        // Conoscenza PC
        const conoscenzaPcCheckbox = Checkbox({
            id: 'lavoro_conoscenza_pc',
            name: 'lavoro_conoscenza_pc',
            label: 'Conoscenza base PC e Office',
            checked: formData.lavoro_conoscenza_pc,
            onChange: (value) => { formData.lavoro_conoscenza_pc = value; }
        });

        // Conoscenza lingue
        const conoscenzaLingueInput = Input({
            type: 'text',
            id: 'lavoro_conoscenza_lingue',
            name: 'lavoro_conoscenza_lingue',
            value: formData.lavoro_conoscenza_lingue,
            onChange: (value) => { formData.lavoro_conoscenza_lingue = value; }
        });

        const conoscenzaLingueGroup = FormGroup({
            label: 'Conoscenza Lingue',
            for: 'lavoro_conoscenza_lingue',
            component: conoscenzaLingueInput
        });

        // Occupazione
        const occupazioneSelect = Select({
            id: 'lavoro_occupazione',
            name: 'lavoro_occupazione',
            options: [
                { value: 'Si', label: 'Sì' },
                { value: 'No', label: 'No' },
                { value: '?', label: 'Non specificato' }
            ],
            value: formData.lavoro_occupazione,
            onChange: (value) => {
                formData.lavoro_occupazione = value;
                // Show/hide relevant fields based on occupation
                if (value === 'Si') {
                    lavoro_svoltoGroup.getElement().style.display = '';
                    oreLavoroGroup.getElement().style.display = '';
                } else {
                    lavoro_svoltoGroup.getElement().style.display = 'none';
                    oreLavoroGroup.getElement().style.display = 'none';
                }
            }
        });

        const occupazioneGroup = FormGroup({
            label: 'Occupazione',
            for: 'lavoro_occupazione',
            component: occupazioneSelect
        });

        // Copertura previdenziale
        const coperturaSelect = Select({
            id: 'lavoro_copertura_previdenziale',
            name: 'lavoro_copertura_previdenziale',
            options: [
                { value: 'Si', label: 'Sì' },
                { value: 'No', label: 'No' },
                { value: '?', label: 'Non specificato' }
            ],
            value: formData.lavoro_copertura_previdenziale,
            onChange: (value) => { formData.lavoro_copertura_previdenziale = value; }
        });

        const coperturaGroup = FormGroup({
            label: 'Copertura Previdenziale',
            for: 'lavoro_copertura_previdenziale',
            component: coperturaSelect
        });

        // Lavoro svolto
        const lavoro_svoltoInput = Input({
            type: 'text',
            id: 'lavoro_svolto',
            name: 'lavoro_svolto',
            value: formData.lavoro_svolto,
            onChange: (value) => { formData.lavoro_svolto = value; }
        });

        const lavoro_svoltoGroup = FormGroup({
            label: 'Lavoro Svolto Attualmente',
            for: 'lavoro_svolto',
            component: lavoro_svoltoInput
        });

        // Ore settimanali
        const oreLavoroSelect = Select({
            id: 'lavoro_ore_settimanali',
            name: 'lavoro_ore_settimanali',
            options: [
                { value: '', label: 'Seleziona ore' },
                { value: '0-10', label: '0-10 ore' },
                { value: '11-20', label: '11-20 ore' },
                { value: '21-30', label: '21-30 ore' },
                { value: '31-40', label: '31-40 ore' },
                { value: '40+', label: 'Più di 40 ore' }
            ],
            value: formData.lavoro_ore_settimanali,
            onChange: (value) => { formData.lavoro_ore_settimanali = value; }
        });

        const oreLavoroGroup = FormGroup({
            label: 'Ore Lavoro Settimanali',
            for: 'lavoro_ore_settimanali',
            component: oreLavoroSelect
        });

        // Note
        const noteInput = Input({
            type: 'textarea',
            id: 'lavoro_note',
            name: 'lavoro_note',
            value: formData.lavoro_note,
            onChange: (value) => { formData.lavoro_note = value; }
        });

        const noteGroup = FormGroup({
            label: 'Note Lavoro',
            for: 'lavoro_note',
            component: noteInput
        });

        // Add components to grid
        formGrid.appendChild(titoloStudioGroup.getElement());
        formGrid.appendChild(attestatiGroup.getElement());
        formGrid.appendChild(patenteGroup.getElement());
        formGrid.appendChild(possessoAutoCheckbox.getElement());
        formGrid.appendChild(conoscenzaPcCheckbox.getElement());
        formGrid.appendChild(conoscenzaLingueGroup.getElement());
        formGrid.appendChild(occupazioneGroup.getElement());
        formGrid.appendChild(coperturaGroup.getElement());
        formGrid.appendChild(lavoro_svoltoGroup.getElement());
        formGrid.appendChild(oreLavoroGroup.getElement());

        // Create a full-width container for notes
        const noteContainer = document.createElement('div');
        noteContainer.className = 'form-grid-full';
        noteContainer.appendChild(noteGroup.getElement());
        formGrid.appendChild(noteContainer);

        // Hide/show fields based on occupation
        if (formData.lavoro_occupazione !== 'Si') {
            lavoro_svoltoGroup.getElement().style.display = 'none';
            oreLavoroGroup.getElement().style.display = 'none';
        }

        // Store components for validation
        formComponents.lavoroOccupazione = occupazioneSelect;
        formComponents.lavoroSvolto = lavoro_svoltoInput;

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Alimentazione step
    function setupAlimentazioneStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Cibo/Alimentazione</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Spese vitto
        const speseVittoInput = Input({
            type: 'text',
            id: 'alimentazione_spese_vitto',
            name: 'alimentazione_spese_vitto',
            value: formData.alimentazione_spese_vitto,
            onChange: (value) => { formData.alimentazione_spese_vitto = value; }
        });

        const speseVittoGroup = FormGroup({
            label: 'Spese Mensili Vitto',
            for: 'alimentazione_spese_vitto',
            component: speseVittoInput,
            helpText: 'Es. €350'
        });

        // Note alimentazione
        const noteAlimentazioneInput = Input({
            type: 'textarea',
            id: 'alimentazione_note',
            name: 'alimentazione_note',
            value: formData.alimentazione_note,
            onChange: (value) => { formData.alimentazione_note = value; }
        });

        const noteAlimentazioneGroup = FormGroup({
            label: 'Note Alimentazione',
            for: 'alimentazione_note',
            component: noteAlimentazioneInput,
            helpText: 'Indicare eventuali intolleranze, diete particolari, ecc.'
        });

        // Add components to grid
        formGrid.appendChild(speseVittoGroup.getElement());

        // Create a full-width container for notes
        const noteContainer = document.createElement('div');
        noteContainer.className = 'form-grid-full';
        noteContainer.appendChild(noteAlimentazioneGroup.getElement());
        formGrid.appendChild(noteContainer);

        // Store components for validation
        formComponents.speseVitto = speseVittoInput;
        formComponents.noteAlimentazione = noteAlimentazioneInput;

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Riepilogo step
    function setupRiepilogoStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Riepilogo Informazioni</h3>';

        // Create summary
        const summary = document.createElement('div');
        summary.className = 'guest-summary';

        // Create sections
        const sections = [
            {
                title: 'Anagrafica',
                icon: '🧑‍💼',
                fields: [
                    { label: 'Nome', value: formData.guest_first_name },
                    { label: 'Cognome', value: formData.guest_last_name },
                    { label: 'Data di Nascita', value: formData.guest_birth_date },
                    { label: 'Luogo di Nascita', value: formData.guest_birth_place },
                    { label: 'Genere', value: formData.guest_sex === 'M' ? 'Maschile' : 'Femminile' },
                    { label: 'Codice Fiscale', value: formData.guest_fiscal_code },
                    { label: 'Nazionalità', value: formData.guest_nationality },
                    { label: 'Telefono', value: formData.guest_phone_number },
                    { label: 'Email', value: formData.guest_email }
                ]
            },
            {
                title: 'Casa/Abitazione',
                icon: '🏠',
                fields: [
                    { label: 'Problematiche Abitative', value: formData.casa_problematiche ? 'Sì' : 'No' },
                    { label: 'Senza Fissa Dimora', value: formData.casa_sfd ? 'Sì' : 'No' },
                    { label: 'Situazione Attuale', value: formData.casa_situazione || 'Non specificata' },
                    { label: 'Comune Residenza', value: formData.casa_residenza_comune },
                    { label: 'Indirizzo Residenza', value: formData.casa_residenza_indirizzo }
                ]
            },
            {
                title: 'Lavoro/Occupazione',
                icon: '💼',
                fields: [
                    { label: 'Titolo di Studio', value: formData.lavoro_titolo_studio },
                    { label: 'Occupazione', value: formData.lavoro_occupazione },
                    { label: 'Lavoro Svolto', value: formData.lavoro_svolto },
                    { label: 'Ore Settimanali', value: formData.lavoro_ore_settimanali },
                    { label: 'Copertura Previdenziale', value: formData.lavoro_copertura_previdenziale }
                ]
            },
            {
                title: 'Alimentazione',
                icon: '🍽️',
                fields: [
                    { label: 'Spese Mensili Vitto', value: formData.alimentazione_spese_vitto },
                    { label: 'Note Alimentazione', value: formData.alimentazione_note }
                ]
            }
        ];

        // Create summary content
        sections.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'summary-section';
            sectionEl.innerHTML = `
                <h4>${section.icon} ${section.title}</h4>
                <div class="summary-grid">
                    ${section.fields.map(field => `
                        <div class="summary-field">
                            <div class="summary-label">${field.label}:</div>
                            <div class="summary-value">${field.value || 'Non specificato'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            summary.appendChild(sectionEl);
        });

        container.appendChild(summary);
        stepContent.appendChild(container);
    }

    // Handle form submission
    async function handleSubmit(e) {
        if (e) e.preventDefault();

        // Validate all steps
        let isValid = true;
        for (let i = 0; i < steps.length - 1; i++) { // Skip summary step
            if (!completedSteps.has(i)) {
                goToStep(i);
                isValid = validateCurrentStep();
                if (!isValid) {
                    return;
                }
            }
        }

        try {
            // Set loading state
            submitButton.setLoading(true);

            // Format data for API
            const submitData = {};

            // Map form data to API format
            Object.keys(formData).forEach(key => {
                // For now, just include all fields directly
                submitData[key] = formData[key];
            });

            // Submit data
            let result;
            if (guest) {
                result = await guestService.updateGuest(guest.id, submitData);
            } else {
                result = await guestService.createGuest(submitData);
            }

            // Call success callback
            onSubmit(result);

        } catch (error) {
            console.error('Form submission error:', error);

            // Show error
            onError(error.message || 'Failed to save guest');

        } finally {
            // Reset loading state
            submitButton.setLoading(false);
        }
    }

    // Initialize form
    init();

    // Public API
    return {
        getElement: () => formContainer,
        getFormData: () => ({ ...formData }),

        // New methods to control the form externally
        goToStep: (stepIndex) => {
            if (stepIndex >= 0 && stepIndex < steps.length) {
                goToStep(stepIndex);
            }
        },

        getCurrentStep: () => currentStep
    };
};

module.exports = GuestForm;