// guestForm.js
"use strict";

const { TabIcon } = require('./guestView');
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
        { id: 'anagrafica', title: 'Anagrafica', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'},
        { id: 'casa', title: 'Casa/Abitazione', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' },
        { id: 'lavoro', title: 'Lavoro/Occupazione', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>' },
        { id: 'alimentazione', title: 'Cibo/Alimentazione', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>️' },
        { id: 'economica', title: 'Situazione Economica', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>'},
        { id: 'relazioni', title: 'Rete e Relazioni',icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>'},
        { id: 'riepilogo', title: 'Riepilogo', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' }
    ];

    // Form data state
    const formData = {
        // Anagrafica
        centro_ascolto: guest?.centro_ascolto || '',
        data_operatore: guest?.data_operatore || '',
        guest_code: guest?.guest_code || '',
        guest_first_name: guest?.guest_first_name || '',
        guest_last_name: guest?.guest_last_name || '',
        guest_birth_date: guest?.guest_birth_date || '',
        guest_birth_place: guest?.guest_birth_place || '',
        guest_provincia: guest?.guest_provincia || '',
        guest_sex: guest?.guest_sex || 'M',
        guest_fiscal_code: guest?.guest_fiscal_code || '',
        guest_nationality: guest?.guest_nationality || 'Italiana',
        guest_documento_identita: guest?.guest_documento_identita || '',
        guest_numero_documento: guest?.guest_numero_documento || '',
        guest_phone_number: guest?.guest_phone_number || '',
        guest_altro_telefono: guest?.guest_altro_telefono || '',
        guest_email: guest?.guest_email || '',
        guest_emergency_contact: guest?.guest_emergency_contact || '',
        guest_detenzione: guest?.guest_detenzione || false,
        guest_dipendenze: guest?.guest_dipendenze || false,
        guest_problemi_familiari: guest?.guest_problemi_familiari || false,
        guest_handicap: guest?.guest_handicap || false,
        guest_migrazione: guest?.guest_migrazione || false,
        guest_istruzione: guest?.guest_istruzione || false,
        guest_poverta: guest?.guest_poverta || false,
        guest_salute: guest?.guest_salute || false,
        guest_servizi_sociali: guest?.guest_servizi_sociali || false,
        guest_altri_problemi: guest?.guest_altri_problemi || false,
        guest_note: guest?.guest_note || '',
        guest_annotazioni: guest?.guest_annotazioni || '',
        guest_stato_civile: guest?.guest_stato_civile || '',
        guest_famiglia_mono: guest?.guest_famiglia_mono || 'No',
        guest_num_componenti: guest?.guest_num_componenti || '',
        guest_num_minori: guest?.guest_num_minori || '',

        // Situazione Economica
        eco_tipo_reddito: guest?.eco_tipo_reddito || '',
        eco_importo_reddito: guest?.eco_importo_reddito || '',
        eco_reddito_riferimento: guest?.eco_reddito_riferimento || '',
        eco_interventi_welfare: guest?.eco_interventi_welfare || [],
        eco_stato_welfare: guest?.eco_stato_welfare || '',
        eco_disabilita: guest?.eco_disabilita || 'No',
        eco_percentuale_invalidita: guest?.eco_percentuale_invalidita || '',
        eco_domanda_aggravamento: guest?.eco_domanda_aggravamento || 'No',
        eco_indennita: guest?.eco_indennita || 'No',
        eco_annotazioni_salute: guest?.eco_annotazioni_salute || '',
        eco_problematiche: guest?.eco_problematiche || [],
        eco_spese_scuola: guest?.eco_spese_scuola || '',
        eco_spese_straordinarie: guest?.eco_spese_straordinarie || '',
        eco_spese_salute: guest?.eco_spese_salute || '',
        eco_rate_mensili: guest?.eco_rate_mensili || '',
        eco_quinto_stipendio: guest?.eco_quinto_stipendio || '',
        eco_altre_spese: guest?.eco_altre_spese || '',

        // Rete e Relazioni
        rel_familiari: guest?.rel_familiari || '',
        rel_annotazioni: guest?.rel_annotazioni || '',
        rel_amicali: guest?.rel_amicali || '',
        rel_gruppi: guest?.rel_gruppi || 'No',
        rel_famiglia_origine: guest?.rel_famiglia_origine || '',
        rel_aiuto_economico: guest?.rel_aiuto_economico || 'No',
        rel_supporto_quotidiano: guest?.rel_supporto_quotidiano || 'No',
        rel_servizi_pubblici: guest?.rel_servizi_pubblici || [],
        rel_servizi_privati: guest?.rel_servizi_privati || [],
        rel_progetti: guest?.rel_progetti || [],

        // Casa/Abitazione
        casa_problematiche: guest?.casa_problematiche || false,
        casa_sfd: guest?.casa_sfd || false, // Senza Fissa Dimora
        casa_residenza_comune: guest?.casa_residenza_comune || '',
        casa_residenza_cap: guest?.casa_residenza_cap || '',
        casa_residenza_indirizzo: guest?.casa_residenza_indirizzo || '',
        casa_domicilio_comune: guest?.casa_domicilio_comune || '',
        casa_domicilio_cap: guest?.casa_domicilio_cap || '',
        casa_domicilio_indirizzo: guest?.casa_domicilio_indirizzo || '',
        casa_vive_in_casa: guest?.casa_vive_in_casa || 'Si',
        casa_situazione: guest?.casa_situazione || '',
        casa_particolari: guest?.casa_particolari || [],
        casa_annotazioni: guest?.casa_annotazioni || '',
        casa_affitto: guest?.casa_affitto || '',
        casa_spese_cond: guest?.casa_spese_cond || '',
        casa_utenze: guest?.casa_utenze || '',

        // Lavoro/Occupazione
        lavoro_titolo_studio: guest?.lavoro_titolo_studio || '',
        lavoro_attestati: guest?.lavoro_attestati || '',
        lavoro_patente: guest?.lavoro_patente || '',
        lavoro_possesso_auto: guest?.lavoro_possesso_auto || false,
        lavoro_conoscenza_pc: guest?.lavoro_conoscenza_pc || false,
        lavoro_conoscenza_lingue: guest?.lavoro_conoscenza_lingue || '',
        lavoro_altre_abilita: guest?.lavoro_altre_abilita || '',
        lavoro_problemi: guest?.lavoro_problemi || false,
        lavoro_occupazione: guest?.lavoro_occupazione || 'No',
        lavoro_copertura_previdenziale: guest?.lavoro_copertura_previdenziale || 'No',
        lavoro_svolto: guest?.lavoro_svolto || '',
        lavoro_note: guest?.lavoro_note || '',
        lavoro_ore_settimanali: guest?.lavoro_ore_settimanali || '',

        // Alimentazione
        alimentazione_vitto: guest?.alimentazione_vitto || '',
        alimentazione_spese: guest?.alimentazione_spese || '',
        alimentazione_intolleranze: guest?.alimentazione_intolleranze || '',
        alimentazione_tipo: guest?.alimentazione_tipo || [],
        alimentazione_note: guest?.alimentazione_note || ''
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

    // Setup Anagrafica step
    function setupAnagraficaStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Anagrafica</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Centro di Ascolto
        const centroInput = Input({
            type: 'text',
            id: 'centro_ascolto',
            name: 'centro_ascolto',
            value: formData.centro_ascolto,
            onChange: (value) => { formData.centro_ascolto = value; }
        });

        const centroGroup = FormGroup({
            label: 'Centro di Ascolto',
            for: 'centro_ascolto',
            component: centroInput
        });

        // Data e Operatore
        const dataOperatoreInput = Input({
            type: 'text',
            id: 'data_operatore',
            name: 'data_operatore',
            value: formData.data_operatore,
            onChange: (value) => { formData.data_operatore = value; }
        });

        const dataOperatoreGroup = FormGroup({
            label: 'Data e Operatore',
            for: 'data_operatore',
            component: dataOperatoreInput
        });

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

        // Sex/Gender
        const sexRadio = createRadioGroup({
            name: 'guest_sex',
            options: [
                { value: 'M', label: 'Maschile' },
                { value: 'F', label: 'Femminile' }
            ],
            selected: formData.guest_sex,
            onChange: (value) => { formData.guest_sex = value; }
        });

        const sexGroup = FormGroup({
            label: 'Genere',
            for: 'guest_sex',
            component: sexRadio
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

        // Provincia
        const provinciaInput = Input({
            type: 'text',
            id: 'guest_provincia',
            name: 'guest_provincia',
            value: formData.guest_provincia,
            onChange: (value) => { formData.guest_provincia = value; }
        });

        const provinciaGroup = FormGroup({
            label: 'Provincia',
            for: 'guest_provincia',
            component: provinciaInput
        });

        // Fiscal code
        const fiscalCodeInput = Input({
            type: 'text',
            id: 'guest_fiscal_code',
            name: 'guest_fiscal_code',
            value: formData.guest_fiscal_code,
            onChange: (value) => { formData.guest_fiscal_code = value; }
        });

        const fiscalCodeGroup = FormGroup({
            label: 'Codice Fiscale',
            for: 'guest_fiscal_code',
            component: fiscalCodeInput
        });

        // Nationality
        const nationalitySelect = Select({
            id: 'guest_nationality',
            name: 'guest_nationality',
            options: [
                { value: 'Italiana', label: 'Italiana' },
                { value: 'Straniera UE', label: 'Straniera UE' },
                { value: 'Straniera non UE', label: 'Straniera non UE' }
            ],
            value: formData.guest_nationality,
            onChange: (value) => { formData.guest_nationality = value; }
        });

        const nationalityGroup = FormGroup({
            label: 'Nazionalità',
            for: 'guest_nationality',
            component: nationalitySelect
        });

        // Documento Identità
        const documentoSelect = Select({
            id: 'guest_documento_identita',
            name: 'guest_documento_identita',
            options: [
                { value: '', label: 'Seleziona documento' },
                { value: 'Carta d\'identità', label: 'Carta d\'identità' },
                { value: 'Passaporto', label: 'Passaporto' },
                { value: 'Patente', label: 'Patente' },
                { value: 'Permesso di soggiorno', label: 'Permesso di soggiorno' }
            ],
            value: formData.guest_documento_identita,
            onChange: (value) => { formData.guest_documento_identita = value; }
        });

        const documentoGroup = FormGroup({
            label: 'Documento Identità',
            for: 'guest_documento_identita',
            component: documentoSelect
        });

        // Numero documento
        const numeroDocumentoInput = Input({
            type: 'text',
            id: 'guest_numero_documento',
            name: 'guest_numero_documento',
            value: formData.guest_numero_documento,
            onChange: (value) => { formData.guest_numero_documento = value; }
        });

        const numeroDocumentoGroup = FormGroup({
            label: 'Numero documento',
            for: 'guest_numero_documento',
            component: numeroDocumentoInput
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

        // Altro telefono
        const altroTelefonoInput = Input({
            type: 'tel',
            id: 'guest_altro_telefono',
            name: 'guest_altro_telefono',
            value: formData.guest_altro_telefono,
            onChange: (value) => { formData.guest_altro_telefono = value; }
        });

        const altroTelefonoGroup = FormGroup({
            label: 'Altro',
            for: 'guest_altro_telefono',
            component: altroTelefonoInput
        });

        // Email
        const emailInput = Input({
            type: 'email',
            id: 'guest_email',
            name: 'guest_email',
            value: formData.guest_email,
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

        // Checkboxes for problems
        const problemsContainer = document.createElement('div');
        problemsContainer.className = 'form-grid-full';

        const problemsTitle = document.createElement('h4');
        problemsTitle.textContent = 'Problematiche';
        problemsTitle.style.marginBottom = '1rem';
        problemsContainer.appendChild(problemsTitle);

        const problemsGrid = document.createElement('div');
        problemsGrid.className = 'form-grid';
        problemsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        problemsContainer.appendChild(problemsGrid);

        // Detenzione e giustizia
        const detenzioneCheckbox = Checkbox({
            id: 'guest_detenzione',
            name: 'guest_detenzione',
            label: 'Detenzione e giustizia',
            checked: formData.guest_detenzione,
            onChange: (value) => { formData.guest_detenzione = value; }
        });
        problemsGrid.appendChild(detenzioneCheckbox.getElement());

        // Dipendenze
        const dipendenzeCheckbox = Checkbox({
            id: 'guest_dipendenze',
            name: 'guest_dipendenze',
            label: 'Dipendenze',
            checked: formData.guest_dipendenze,
            onChange: (value) => { formData.guest_dipendenze = value; }
        });
        problemsGrid.appendChild(dipendenzeCheckbox.getElement());

        // Problemi familiari
        const problemiFamiliariCheckbox = Checkbox({
            id: 'guest_problemi_familiari',
            name: 'guest_problemi_familiari',
            label: 'Problemi familiari',
            checked: formData.guest_problemi_familiari,
            onChange: (value) => { formData.guest_problemi_familiari = value; }
        });
        problemsGrid.appendChild(problemiFamiliariCheckbox.getElement());

        // Handicap/Disabilità
        const handicapCheckbox = Checkbox({
            id: 'guest_handicap',
            name: 'guest_handicap',
            label: 'Handicap/Disabilità',
            checked: formData.guest_handicap,
            onChange: (value) => { formData.guest_handicap = value; }
        });
        problemsGrid.appendChild(handicapCheckbox.getElement());

        // Bisogni di migrazione/immigrazione
        const migrazioneCheckbox = Checkbox({
            id: 'guest_migrazione',
            name: 'guest_migrazione',
            label: 'Bisogni di migrazione/immigrazione',
            checked: formData.guest_migrazione,
            onChange: (value) => { formData.guest_migrazione = value; }
        });
        problemsGrid.appendChild(migrazioneCheckbox.getElement());

        // Problemi di istruzione
        const istruzioneCheckbox = Checkbox({
            id: 'guest_istruzione',
            name: 'guest_istruzione',
            label: 'Problemi di istruzione',
            checked: formData.guest_istruzione,
            onChange: (value) => { formData.guest_istruzione = value; }
        });
        problemsGrid.appendChild(istruzioneCheckbox.getElement());

        // Povertà/problemi economici
        const povertaCheckbox = Checkbox({
            id: 'guest_poverta',
            name: 'guest_poverta',
            label: 'Povertà/problemi economici',
            checked: formData.guest_poverta,
            onChange: (value) => { formData.guest_poverta = value; }
        });
        problemsGrid.appendChild(povertaCheckbox.getElement());

        // Problemi di salute
        const saluteCheckbox = Checkbox({
            id: 'guest_salute',
            name: 'guest_salute',
            label: 'Problemi di salute',
            checked: formData.guest_salute,
            onChange: (value) => { formData.guest_salute = value; }
        });
        problemsGrid.appendChild(saluteCheckbox.getElement());

        // Presa in carico ai servizi sociali
        const serviziSocialiCheckbox = Checkbox({
            id: 'guest_servizi_sociali',
            name: 'guest_servizi_sociali',
            label: 'Presa in carico ai servizi sociali',
            checked: formData.guest_servizi_sociali,
            onChange: (value) => { formData.guest_servizi_sociali = value; }
        });
        problemsGrid.appendChild(serviziSocialiCheckbox.getElement());

        // Altri problemi
        const altriProblemiCheckbox = Checkbox({
            id: 'guest_altri_problemi',
            name: 'guest_altri_problemi',
            label: 'Altri problemi',
            checked: formData.guest_altri_problemi,
            onChange: (value) => { formData.guest_altri_problemi = value; }
        });
        problemsGrid.appendChild(altriProblemiCheckbox.getElement());

        // Notes field
        const noteInput = createTextarea({
            id: 'guest_note',
            value: formData.guest_note,
            onChange: (value) => { formData.guest_note = value; }
        });

        const noteGroup = FormGroup({
            label: 'Note',
            for: 'guest_note',
            component: noteInput
        });

        // Annotazioni
        const annotazioniInput = createTextarea({
            id: 'guest_annotazioni',
            value: formData.guest_annotazioni,
            onChange: (value) => { formData.guest_annotazioni = value; }
        });

        const annotazioniGroup = FormGroup({
            label: 'Annotazioni di carattere generale sulla persona o sulla famiglia',
            for: 'guest_annotazioni',
            component: annotazioniInput
        });

        // Stato civile
        const statoCivileSelect = Select({
            id: 'guest_stato_civile',
            name: 'guest_stato_civile',
            options: [
                { value: '', label: 'Seleziona stato civile' },
                { value: 'Celibe/Nubile', label: 'Celibe/Nubile' },
                { value: 'Coniugato/a', label: 'Coniugato/a' },
                { value: 'Separato/a', label: 'Separato/a' },
                { value: 'Divorziato/a', label: 'Divorziato/a' },
                { value: 'Vedovo/a', label: 'Vedovo/a' },
                { value: 'Convivente', label: 'Convivente' }
            ],
            value: formData.guest_stato_civile,
            onChange: (value) => { formData.guest_stato_civile = value; }
        });

        const statoCivileGroup = FormGroup({
            label: 'Stato civile',
            for: 'guest_stato_civile',
            component: statoCivileSelect
        });
        // Famiglia monocomponente
        const famigliaMono = createRadioGroup({
            name: 'guest_famiglia_mono',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.guest_famiglia_mono,
            onChange: (value) => { formData.guest_famiglia_mono = value; }
        });

        const famigliaMonoGroup = FormGroup({
            label: 'Famiglia monocomponente',
            for: 'guest_famiglia_mono',
            component: famigliaMono
        });

        // Numero componenti
        const numComponentiInput = Input({
            type: 'number',
            id: 'guest_num_componenti',
            name: 'guest_num_componenti',
            value: formData.guest_num_componenti,
            onChange: (value) => { formData.guest_num_componenti = value; }
        });

        const numComponentiGroup = FormGroup({
            label: 'Numero componenti',
            for: 'guest_num_componenti',
            component: numComponentiInput
        });

        // Numero minori
        const numMinoriInput = Input({
            type: 'number',
            id: 'guest_num_minori',
            name: 'guest_num_minori',
            value: formData.guest_num_minori,
            onChange: (value) => { formData.guest_num_minori = value; }
        });

        const numMinoriGroup = FormGroup({
            label: 'di cui numero minori',
            for: 'guest_num_minori',
            component: numMinoriInput
        });

        // Add components to grid
        formGrid.appendChild(centroGroup.getElement());
        formGrid.appendChild(dataOperatoreGroup.getElement());
        formGrid.appendChild(guestCodeGroup.getElement());
        formGrid.appendChild(firstNameGroup.getElement());
        formGrid.appendChild(lastNameGroup.getElement());
        formGrid.appendChild(sexGroup.getElement());
        formGrid.appendChild(birthDateGroup.getElement());
        formGrid.appendChild(birthPlaceGroup.getElement());
        formGrid.appendChild(provinciaGroup.getElement());
        formGrid.appendChild(fiscalCodeGroup.getElement());
        formGrid.appendChild(nationalityGroup.getElement());
        formGrid.appendChild(documentoGroup.getElement());
        formGrid.appendChild(numeroDocumentoGroup.getElement());
        formGrid.appendChild(phoneGroup.getElement());
        formGrid.appendChild(altroTelefonoGroup.getElement());
        formGrid.appendChild(emailGroup.getElement());
        formGrid.appendChild(emergencyContactGroup.getElement());
        formGrid.appendChild(statoCivileGroup.getElement());
        formGrid.appendChild(famigliaMonoGroup.getElement());
        formGrid.appendChild(numComponentiGroup.getElement());
        formGrid.appendChild(numMinoriGroup.getElement());

        // Add problems section
        formGrid.appendChild(problemsContainer);

        // Create full-width containers for notes and annotations
        const noteContainer = document.createElement('div');
        noteContainer.className = 'form-grid-full';
        noteContainer.appendChild(noteGroup.getElement());
        formGrid.appendChild(noteContainer);

        const annotazioniContainer = document.createElement('div');
        annotazioniContainer.className = 'form-grid-full';
        annotazioniContainer.appendChild(annotazioniGroup.getElement());
        formGrid.appendChild(annotazioniContainer);

        // Store components for validation
        formComponents.firstName = firstNameInput;
        formComponents.lastName = lastNameInput;
        formComponents.fiscalCode = fiscalCodeInput;
        formComponents.email = emailInput;

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Economica step (placeholder)
    function setupEconomicaStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Situazione Economica</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Tipologia di reddito
        const tipoRedditoSelect = Select({
            id: 'eco_tipo_reddito',
            name: 'eco_tipo_reddito',
            options: [
                { value: '', label: 'Seleziona tipo' },
                { value: 'Nessuno', label: 'Nessuno' },
                { value: 'Lavoro dipendente', label: 'Lavoro dipendente' },
                { value: 'Lavoro autonomo', label: 'Lavoro autonomo' },
                { value: 'Pensione', label: 'Pensione' },
                { value: 'Cassa integrazione', label: 'Cassa integrazione' },
                { value: 'Disoccupazione', label: 'Disoccupazione' },
                { value: 'Altro', label: 'Altro' }
            ],
            value: formData.eco_tipo_reddito,
            onChange: (value) => { formData.eco_tipo_reddito = value; }
        });

        const tipoRedditoGroup = FormGroup({
            label: 'Tipologia di reddito',
            for: 'eco_tipo_reddito',
            component: tipoRedditoSelect
        });

        // Importo reddito
        const importoRedditoInput = Input({
            type: 'text',
            id: 'eco_importo_reddito',
            name: 'eco_importo_reddito',
            value: formData.eco_importo_reddito,
            placeholder: 'Es. 1200',
            onChange: (value) => { formData.eco_importo_reddito = value; }
        });

        const importoRedditoGroup = FormGroup({
            label: 'Importo reddito €',
            for: 'eco_importo_reddito',
            component: importoRedditoInput
        });

        // A chi si riferisce il reddito
        const riferimentoRedditoSelect = Select({
            id: 'eco_reddito_riferimento',
            name: 'eco_reddito_riferimento',
            options: [
                { value: '', label: 'Seleziona' },
                { value: 'Ospite', label: 'Ospite' },
                { value: 'Coniuge/Partner', label: 'Coniuge/Partner' },
                { value: 'Familiare', label: 'Familiare' },
                { value: 'Nucleo familiare', label: 'Nucleo familiare' }
            ],
            value: formData.eco_reddito_riferimento,
            onChange: (value) => { formData.eco_reddito_riferimento = value; }
        });

        const riferimentoRedditoGroup = FormGroup({
            label: 'A chi si riferisce il reddito',
            for: 'eco_reddito_riferimento',
            component: riferimentoRedditoSelect
        });

        // Interventi di welfare - Checkboxes
        const interventiWelfareContainer = document.createElement('div');
        interventiWelfareContainer.className = 'form-grid-full';

        const interventiTitle = document.createElement('h4');
        interventiTitle.textContent = 'Interventi di welfare';
        interventiTitle.style.marginBottom = '1rem';
        interventiWelfareContainer.appendChild(interventiTitle);

        const interventiGrid = document.createElement('div');
        interventiGrid.className = 'form-grid';
        interventiGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        interventiWelfareContainer.appendChild(interventiGrid);

        // ADI Checkbox
        const adiCheckbox = Checkbox({
            id: 'eco_welfare_adi',
            name: 'eco_welfare_adi',
            label: 'ADI',
            checked: formData.eco_interventi_welfare.includes('ADI'),
            onChange: (value) => {
                if (value) {
                    if (!formData.eco_interventi_welfare.includes('ADI')) {
                        formData.eco_interventi_welfare.push('ADI');
                    }
                } else {
                    formData.eco_interventi_welfare = formData.eco_interventi_welfare.filter(item => item !== 'ADI');
                }
            }
        });
        interventiGrid.appendChild(adiCheckbox.getElement());

        // Reddito di cittadinanza Checkbox
        const redditoCittadinanzaCheckbox = Checkbox({
            id: 'eco_welfare_reddito',
            name: 'eco_welfare_reddito',
            label: 'Reddito di cittadinanza',
            checked: formData.eco_interventi_welfare.includes('Reddito di cittadinanza'),
            onChange: (value) => {
                if (value) {
                    if (!formData.eco_interventi_welfare.includes('Reddito di cittadinanza')) {
                        formData.eco_interventi_welfare.push('Reddito di cittadinanza');
                    }
                } else {
                    formData.eco_interventi_welfare = formData.eco_interventi_welfare.filter(item => item !== 'Reddito di cittadinanza');
                }
            }
        });
        interventiGrid.appendChild(redditoCittadinanzaCheckbox.getElement());

        // Assegno unico Checkbox
        const assegnoUnicoCheckbox = Checkbox({
            id: 'eco_welfare_assegno',
            name: 'eco_welfare_assegno',
            label: 'Assegno unico',
            checked: formData.eco_interventi_welfare.includes('Assegno unico'),
            onChange: (value) => {
                if (value) {
                    if (!formData.eco_interventi_welfare.includes('Assegno unico')) {
                        formData.eco_interventi_welfare.push('Assegno unico');
                    }
                } else {
                    formData.eco_interventi_welfare = formData.eco_interventi_welfare.filter(item => item !== 'Assegno unico');
                }
            }
        });
        interventiGrid.appendChild(assegnoUnicoCheckbox.getElement());

        // Stato interventi welfare
        const statoWelfareRadio = createRadioGroup({
            name: 'eco_stato_welfare',
            options: [
                { value: 'Attivo', label: 'Attivo' },
                { value: 'In sospeso', label: 'In sospeso' },
                { value: 'Rifiutato', label: 'Rifiutato' }
            ],
            selected: formData.eco_stato_welfare,
            onChange: (value) => { formData.eco_stato_welfare = value; }
        });

        const statoWelfareGroup = FormGroup({
            label: 'Stato interventi welfare',
            for: 'eco_stato_welfare',
            component: statoWelfareRadio
        });

        // Disabilità documentata titolare
        const disabilitaRadio = createRadioGroup({
            name: 'eco_disabilita',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.eco_disabilita,
            onChange: (value) => {
                formData.eco_disabilita = value;
                // Show/hide percentage field based on selection
                if (value === 'Si') {
                    percentualeGroup.getElement().style.display = '';
                    domandaGroup.getElement().style.display = '';
                    indennitaGroup.getElement().style.display = '';
                } else {
                    percentualeGroup.getElement().style.display = 'none';
                    domandaGroup.getElement().style.display = 'none';
                    indennitaGroup.getElement().style.display = 'none';
                }
            }
        });

        const disabilitaGroup = FormGroup({
            label: 'Disabilità documentata titolare',
            for: 'eco_disabilita',
            component: disabilitaRadio
        });

        // % invalidità
        const percentualeInput = Input({
            type: 'text',
            id: 'eco_percentuale_invalidita',
            name: 'eco_percentuale_invalidita',
            value: formData.eco_percentuale_invalidita,
            onChange: (value) => { formData.eco_percentuale_invalidita = value; }
        });

        const percentualeGroup = FormGroup({
            label: '% invalidità',
            for: 'eco_percentuale_invalidita',
            component: percentualeInput
        });

        // Domanda di aggravamento
        const domandaRadio = createRadioGroup({
            name: 'eco_domanda_aggravamento',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.eco_domanda_aggravamento,
            onChange: (value) => { formData.eco_domanda_aggravamento = value; }
        });

        const domandaGroup = FormGroup({
            label: 'Domanda di aggravamento',
            for: 'eco_domanda_aggravamento',
            component: domandaRadio
        });

        // Indennità di accompagnamento
        const indennitaRadio = createRadioGroup({
            name: 'eco_indennita',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.eco_indennita,
            onChange: (value) => { formData.eco_indennita = value; }
        });

        const indennitaGroup = FormGroup({
            label: 'Indennità di accompagnamento',
            for: 'eco_indennita',
            component: indennitaRadio
        });

        // Ulteriori annotazioni salute
        const annotazioniSaluteInput = createTextarea({
            id: 'eco_annotazioni_salute',
            value: formData.eco_annotazioni_salute,
            onChange: (value) => { formData.eco_annotazioni_salute = value; }
        });

        const annotazioniSaluteGroup = FormGroup({
            label: 'Ulteriori annotazioni salute',
            for: 'eco_annotazioni_salute',
            component: annotazioniSaluteInput
        });

        // Problematiche specifiche e documentate - Checkboxes
        const problematicheContainer = document.createElement('div');
        problematicheContainer.className = 'form-grid-full';

        const problematicheTitle = document.createElement('h4');
        problematicheTitle.textContent = 'Problematiche specifiche e documentate';
        problematicheTitle.style.marginBottom = '1rem';
        problematicheContainer.appendChild(problematicheTitle);

        const problematicheGrid = document.createElement('div');
        problematicheGrid.className = 'form-grid';
        problematicheGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        problematicheContainer.appendChild(problematicheGrid);

        // Problematiche mentali Checkbox
        const mentaliCheckbox = Checkbox({
            id: 'eco_problematiche_mentali',
            name: 'eco_problematiche_mentali',
            label: 'Problematiche mentali',
            checked: formData.eco_problematiche.includes('Problematiche mentali'),
            onChange: (value) => {
                if (value) {
                    if (!formData.eco_problematiche.includes('Problematiche mentali')) {
                        formData.eco_problematiche.push('Problematiche mentali');
                    }
                } else {
                    formData.eco_problematiche = formData.eco_problematiche.filter(item => item !== 'Problematiche mentali');
                }
            }
        });
        problematicheGrid.appendChild(mentaliCheckbox.getElement());

        // Problematiche fisiche Checkbox
        const fisicheCheckbox = Checkbox({
            id: 'eco_problematiche_fisiche',
            name: 'eco_problematiche_fisiche',
            label: 'Problematiche fisiche',
            checked: formData.eco_problematiche.includes('Problematiche fisiche'),
            onChange: (value) => {
                if (value) {
                    if (!formData.eco_problematiche.includes('Problematiche fisiche')) {
                        formData.eco_problematiche.push('Problematiche fisiche');
                    }
                } else {
                    formData.eco_problematiche = formData.eco_problematiche.filter(item => item !== 'Problematiche fisiche');
                }
            }
        });
        problematicheGrid.appendChild(fisicheCheckbox.getElement());

        // Spese section
        const speseContainer = document.createElement('div');
        speseContainer.className = 'form-grid-full';

        const speseTitle = document.createElement('h4');
        speseTitle.textContent = 'Voci di spesa';
        speseTitle.style.marginBottom = '1rem';
        speseContainer.appendChild(speseTitle);

        const speseGrid = document.createElement('div');
        speseGrid.className = 'form-grid';
        speseGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        speseContainer.appendChild(speseGrid);

        // Scuola
        const scuolaInput = Input({
            type: 'text',
            id: 'eco_spese_scuola',
            name: 'eco_spese_scuola',
            value: formData.eco_spese_scuola,
            placeholder: '€',
            onChange: (value) => { formData.eco_spese_scuola = value; }
        });

        const scuolaGroup = FormGroup({
            label: 'Scuola',
            for: 'eco_spese_scuola',
            component: scuolaInput
        });
        speseGrid.appendChild(scuolaGroup.getElement());

        // Spese straordinarie
        const speseStrInput = Input({
            type: 'text',
            id: 'eco_spese_straordinarie',
            name: 'eco_spese_straordinarie',
            value: formData.eco_spese_straordinarie,
            placeholder: '€',
            onChange: (value) => { formData.eco_spese_straordinarie = value; }
        });

        const speseStrGroup = FormGroup({
            label: 'Spese straordinarie',
            for: 'eco_spese_straordinarie',
            component: speseStrInput
        });
        speseGrid.appendChild(speseStrGroup.getElement());

        // Spese riguardanti la salute
        const speseSaluteInput = Input({
            type: 'text',
            id: 'eco_spese_salute',
            name: 'eco_spese_salute',
            value: formData.eco_spese_salute,
            placeholder: '€',
            onChange: (value) => { formData.eco_spese_salute = value; }
        });

        const speseSaluteGroup = FormGroup({
            label: 'Spese riguardanti la salute',
            for: 'eco_spese_salute',
            component: speseSaluteInput
        });
        speseGrid.appendChild(speseSaluteGroup.getElement());

        // Rate mensili
        const rateMensiliInput = Input({
            type: 'text',
            id: 'eco_rate_mensili',
            name: 'eco_rate_mensili',
            value: formData.eco_rate_mensili,
            placeholder: '€',
            onChange: (value) => { formData.eco_rate_mensili = value; }
        });

        const rateMensiliGroup = FormGroup({
            label: 'Rate mensili',
            for: 'eco_rate_mensili',
            component: rateMensiliInput
        });
        speseGrid.appendChild(rateMensiliGroup.getElement());

        // Quinto dello stipendio
        const quintoStipendioInput = Input({
            type: 'text',
            id: 'eco_quinto_stipendio',
            name: 'eco_quinto_stipendio',
            value: formData.eco_quinto_stipendio,
            placeholder: '€',
            onChange: (value) => { formData.eco_quinto_stipendio = value; }
        });

        const quintoStipendioGroup = FormGroup({
            label: 'Quinto dello stipendio',
            for: 'eco_quinto_stipendio',
            component: quintoStipendioInput
        });
        speseGrid.appendChild(quintoStipendioGroup.getElement());

        // Altre spese
        const altreSpesesInput = Input({
            type: 'text',
            id: 'eco_altre_spese',
            name: 'eco_altre_spese',
            value: formData.eco_altre_spese,
            placeholder: '€',
            onChange: (value) => { formData.eco_altre_spese = value; }
        });

        const altreSpesesGroup = FormGroup({
            label: 'Altre spese',
            for: 'eco_altre_spese',
            component: altreSpesesInput
        });
        speseGrid.appendChild(altreSpesesGroup.getElement());

        // Add components to grid
        formGrid.appendChild(tipoRedditoGroup.getElement());
        formGrid.appendChild(importoRedditoGroup.getElement());
        formGrid.appendChild(riferimentoRedditoGroup.getElement());
        formGrid.appendChild(interventiWelfareContainer);
        formGrid.appendChild(statoWelfareGroup.getElement());
        formGrid.appendChild(disabilitaGroup.getElement());
        formGrid.appendChild(percentualeGroup.getElement());
        formGrid.appendChild(domandaGroup.getElement());
        formGrid.appendChild(indennitaGroup.getElement());
        formGrid.appendChild(problematicheContainer);
        formGrid.appendChild(speseContainer);

        // Add full-width container for annotations
        const annotazioniContainer = document.createElement('div');
        annotazioniContainer.className = 'form-grid-full';
        annotazioniContainer.appendChild(annotazioniSaluteGroup.getElement());
        formGrid.appendChild(annotazioniContainer);

        // Hide conditional fields initially if needed
        if (formData.eco_disabilita !== 'Si') {
            percentualeGroup.getElement().style.display = 'none';
            domandaGroup.getElement().style.display = 'none';
            indennitaGroup.getElement().style.display = 'none';
        }

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    function setupRelazioniStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Rete e Relazioni</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Relazioni tra i familiari conviventi
        const relFamiliariSelect = Select({
            id: 'rel_familiari',
            name: 'rel_familiari',
            options: [
                { value: '', label: 'Seleziona' },
                { value: 'Buone', label: 'Buone' },
                { value: 'Normali', label: 'Normali' },
                { value: 'Problematiche', label: 'Problematiche' },
                { value: 'Conflittuali', label: 'Conflittuali' },
                { value: 'Assenti', label: 'Assenti' }
            ],
            value: formData.rel_familiari,
            onChange: (value) => { formData.rel_familiari = value; }
        });

        const relFamiliariGroup = FormGroup({
            label: 'Relazioni tra i familiari conviventi',
            for: 'rel_familiari',
            component: relFamiliariSelect
        });

        // Annotazioni relazioni
        const relAnnotazioniInput = createTextarea({
            id: 'rel_annotazioni',
            value: formData.rel_annotazioni,
            onChange: (value) => { formData.rel_annotazioni = value; }
        });

        const relAnnotazioniGroup = FormGroup({
            label: 'Annotazioni relazioni',
            for: 'rel_annotazioni',
            component: relAnnotazioniInput
        });

        // Relazioni amicali
        const relAmicaliSelect = Select({
            id: 'rel_amicali',
            name: 'rel_amicali',
            options: [
                { value: '', label: 'Seleziona' },
                { value: 'Buone', label: 'Buone' },
                { value: 'Normali', label: 'Normali' },
                { value: 'Problematiche', label: 'Problematiche' },
                { value: 'Conflittuali', label: 'Conflittuali' },
                { value: 'Assenti', label: 'Assenti' }
            ],
            value: formData.rel_amicali,
            onChange: (value) => { formData.rel_amicali = value; }
        });

        const relAmicaliGroup = FormGroup({
            label: 'Relazioni amicali',
            for: 'rel_amicali',
            component: relAmicaliSelect
        });

        // In famiglia si frequentano gruppi di socializzazione
        const relGruppiRadio = createRadioGroup({
            name: 'rel_gruppi',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.rel_gruppi,
            onChange: (value) => { formData.rel_gruppi = value; }
        });

        const relGruppiGroup = FormGroup({
            label: 'In famiglia si frequentano gruppi di socializzazione',
            for: 'rel_gruppi',
            component: relGruppiRadio
        });

        // Relazioni con la famiglia di origine
        const relFamigliaOrigineSelect = Select({
            id: 'rel_famiglia_origine',
            name: 'rel_famiglia_origine',
            options: [
                { value: '', label: 'Seleziona' },
                { value: 'Buone', label: 'Buone' },
                { value: 'Normali', label: 'Normali' },
                { value: 'Problematiche', label: 'Problematiche' },
                { value: 'Conflittuali', label: 'Conflittuali' },
                { value: 'Assenti', label: 'Assenti' }
            ],
            value: formData.rel_famiglia_origine,
            onChange: (value) => { formData.rel_famiglia_origine = value; }
        });

        const relFamigliaOrigineGroup = FormGroup({
            label: 'Relazioni con la famiglia di origine',
            for: 'rel_famiglia_origine',
            component: relFamigliaOrigineSelect
        });

        // La famiglia di origine interviene economicamente in aiuto?
        const relAiutoEconomicoRadio = createRadioGroup({
            name: 'rel_aiuto_economico',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.rel_aiuto_economico,
            onChange: (value) => { formData.rel_aiuto_economico = value; }
        });

        const relAiutoEconomicoGroup = FormGroup({
            label: 'La famiglia di origine interviene economicamente in aiuto?',
            for: 'rel_aiuto_economico',
            component: relAiutoEconomicoRadio
        });

        // La famiglia di origine dà supporto nella vita quotidiana?
        const relSupportoQuotidianoRadio = createRadioGroup({
            name: 'rel_supporto_quotidiano',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.rel_supporto_quotidiano,
            onChange: (value) => { formData.rel_supporto_quotidiano = value; }
        });

        const relSupportoQuotidianoGroup = FormGroup({
            label: 'La famiglia di origine dà supporto nella vita quotidiana?',
            for: 'rel_supporto_quotidiano',
            component: relSupportoQuotidianoRadio
        });

        // Create service sections with tables
        const createServiceTable = (title, serviceType) => {
            const container = document.createElement('div');
            container.className = 'form-grid-full';

            const tableTitle = document.createElement('h4');
            tableTitle.textContent = title;
            tableTitle.style.marginBottom = '1rem';
            container.appendChild(tableTitle);

            // Create a simple table for services
            // In a real implementation, this would be more interactive
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.style.marginBottom = '1.5rem';
            tableContainer.style.overflowX = 'auto';

            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th style="border: 1px solid #e2e8f0; padding: 0.5rem;">Nome servizio</th>
                    <th style="border: 1px solid #e2e8f0; padding: 0.5rem;">Referente</th>
                    <th style="border: 1px solid #e2e8f0; padding: 0.5rem;">Contatto</th>
                    <th style="border: 1px solid #e2e8f0; padding: 0.5rem;">Note</th>
                </tr>
            `;

            const tbody = document.createElement('tbody');
            // Add a few empty rows for manual input
            for (let i = 0; i < 3; i++) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">
                        <input type="text" style="width: 100%; border: none; padding: 0.25rem;" 
                               data-field="${serviceType}_name_${i}" />
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">
                        <input type="text" style="width: 100%; border: none; padding: 0.25rem;" 
                               data-field="${serviceType}_ref_${i}" />
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">
                        <input type="text" style="width: 100%; border: none; padding: 0.25rem;" 
                               data-field="${serviceType}_contact_${i}" />
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">
                        <input type="text" style="width: 100%; border: none; padding: 0.25rem;" 
                               data-field="${serviceType}_notes_${i}" />
                    </td>
                `;
                tbody.appendChild(tr);

                // Add event listeners to capture input
                tr.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        const field = e.target.dataset.field;
                        // Handle the input values - in a real implementation,
                        // this would update a structured array in formData
                    });
                });
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);

            return container;
        };

        // Create service tables
        const servPublici = createServiceTable('Rete di SERVIZI PUBBLICI', 'servizi_pubblici');
        const servPrivati = createServiceTable('Rete di SERVIZI PRIVATO SOCIALE', 'servizi_privati');
        const progetti = createServiceTable('Coinvolgimento in PROGETTI DI ACCOMPAGNAMENTO', 'progetti');

        // Add components to form grid
        formGrid.appendChild(relFamiliariGroup.getElement());

        // Add annotation in full width
        const annotContainer = document.createElement('div');
        annotContainer.className = 'form-grid-full';
        annotContainer.appendChild(relAnnotazioniGroup.getElement());
        formGrid.appendChild(annotContainer);

        formGrid.appendChild(relAmicaliGroup.getElement());
        formGrid.appendChild(relGruppiGroup.getElement());
        formGrid.appendChild(relFamigliaOrigineGroup.getElement());
        formGrid.appendChild(relAiutoEconomicoGroup.getElement());
        formGrid.appendChild(relSupportoQuotidianoGroup.getElement());

        // Add service tables
        formGrid.appendChild(servPublici);
        formGrid.appendChild(servPrivati);
        formGrid.appendChild(progetti);

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

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
            onChange: (value) => {
                formData.casa_sfd = value;
                // Hide/show address fields based on SFD status
                if (value) {
                    // Hide address fields if SFD
                    residenzaComuneGroup.getElement().style.display = 'none';
                    residenzaCapGroup.getElement().style.display = 'none';
                    residenzaIndirizzoGroup.getElement().style.display = 'none';
                    domicilioComuneGroup.getElement().style.display = 'none';
                    domicilioCapGroup.getElement().style.display = 'none';
                    domicilioIndirizzoGroup.getElement().style.display = 'none';
                } else {
                    // Show address fields
                    residenzaComuneGroup.getElement().style.display = '';
                    residenzaCapGroup.getElement().style.display = '';
                    residenzaIndirizzoGroup.getElement().style.display = '';
                    domicilioComuneGroup.getElement().style.display = '';
                    domicilioCapGroup.getElement().style.display = '';
                    domicilioIndirizzoGroup.getElement().style.display = '';
                }
            }
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
            label: 'RESIDENZA Comune',
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
            label: 'CAP urbano residenza',
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
            label: 'Indirizzo residenza',
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
            label: 'DOMICILIO Comune',
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
            label: 'CAP urbano domicilio',
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
            label: 'Indirizzo domicilio',
            for: 'casa_domicilio_indirizzo',
            component: domicilioIndirizzoInput
        });

        // Vive in casa
        const viveInCasaRadio = createRadioGroup({
            name: 'casa_vive_in_casa',
            options: [
                { value: 'Si', label: 'Si' },
                { value: 'No', label: 'No' }
            ],
            selected: formData.casa_vive_in_casa,
            onChange: (value) => { formData.casa_vive_in_casa = value; }
        });

        const viveInCasaGroup = FormGroup({
            label: 'Vive in casa',
            for: 'casa_vive_in_casa',
            component: viveInCasaRadio
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
            label: 'Situazione attuale alloggiativa',
            for: 'casa_situazione',
            component: situazioneSelect
        });

        // Altri particolari abitazione - Checkboxes
        const particolariContainer = document.createElement('div');
        particolariContainer.className = 'form-grid-full';

        const particolariTitle = document.createElement('h4');
        particolariTitle.textContent = 'Altri particolari abitazione';
        particolariTitle.style.marginBottom = '1rem';
        particolariContainer.appendChild(particolariTitle);

        const particolariGrid = document.createElement('div');
        particolariGrid.className = 'form-grid';
        particolariGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        particolariContainer.appendChild(particolariGrid);

        // Sovraffollamento Checkbox
        const sovraffollamentoCheckbox = Checkbox({
            id: 'casa_sovraffollamento',
            name: 'casa_sovraffollamento',
            label: 'Sovraffollamento',
            checked: formData.casa_particolari.includes('Sovraffollamento'),
            onChange: (value) => {
                if (value) {
                    if (!formData.casa_particolari.includes('Sovraffollamento')) {
                        formData.casa_particolari.push('Sovraffollamento');
                    }
                } else {
                    formData.casa_particolari = formData.casa_particolari.filter(item => item !== 'Sovraffollamento');
                }
            }
        });
        particolariGrid.appendChild(sovraffollamentoCheckbox.getElement());

        // Mancanza servizi Checkbox
        const mancanzaServiziCheckbox = Checkbox({
            id: 'casa_mancanza_servizi',
            name: 'casa_mancanza_servizi',
            label: 'Mancanza servizi essenziali',
            checked: formData.casa_particolari.includes('Mancanza servizi essenziali'),
            onChange: (value) => {
                if (value) {
                    if (!formData.casa_particolari.includes('Mancanza servizi essenziali')) {
                        formData.casa_particolari.push('Mancanza servizi essenziali');
                    }
                } else {
                    formData.casa_particolari = formData.casa_particolari.filter(item => item !== 'Mancanza servizi essenziali');
                }
            }
        });
        particolariGrid.appendChild(mancanzaServiziCheckbox.getElement());

        // Barriere architettoniche Checkbox
        const barriereCheckbox = Checkbox({
            id: 'casa_barriere',
            name: 'casa_barriere',
            label: 'Barriere architettoniche',
            checked: formData.casa_particolari.includes('Barriere architettoniche'),
            onChange: (value) => {
                if (value) {
                    if (!formData.casa_particolari.includes('Barriere architettoniche')) {
                        formData.casa_particolari.push('Barriere architettoniche');
                    }
                } else {
                    formData.casa_particolari = formData.casa_particolari.filter(item => item !== 'Barriere architettoniche');
                }
            }
        });
        particolariGrid.appendChild(barriereCheckbox.getElement());

        // Annotazioni alloggiative
        const annotazioniAlloggiativeInput = createTextarea({
            id: 'casa_annotazioni',
            value: formData.casa_annotazioni,
            onChange: (value) => { formData.casa_annotazioni = value; }
        });

        const annotazioniAlloggiativeGroup = FormGroup({
            label: 'Annotazioni alloggiative',
            for: 'casa_annotazioni',
            component: annotazioniAlloggiativeInput
        });

        // Spese section
        const speseContainer = document.createElement('div');
        speseContainer.className = 'form-grid-full';

        const speseTitle = document.createElement('h4');
        speseTitle.textContent = 'Spese Abitative';
        speseTitle.style.marginBottom = '1rem';
        speseContainer.appendChild(speseTitle);

        const speseGrid = document.createElement('div');
        speseGrid.className = 'form-grid';
        speseGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        speseContainer.appendChild(speseGrid);

        // Affitto/Mutuo
        const affittoInput = Input({
            type: 'text',
            id: 'casa_affitto',
            name: 'casa_affitto',
            value: formData.casa_affitto,
            placeholder: '€',
            onChange: (value) => { formData.casa_affitto = value; }
        });

        const affittoGroup = FormGroup({
            label: 'Affitto/Mutuo',
            for: 'casa_affitto',
            component: affittoInput
        });
        speseGrid.appendChild(affittoGroup.getElement());

        // Spese condominiali
        const speseCondInput = Input({
            type: 'text',
            id: 'casa_spese_cond',
            name: 'casa_spese_cond',
            value: formData.casa_spese_cond,
            placeholder: '€',
            onChange: (value) => { formData.casa_spese_cond = value; }
        });

        const speseCondGroup = FormGroup({
            label: 'Spese condominiali',
            for: 'casa_spese_cond',
            component: speseCondInput
        });
        speseGrid.appendChild(speseCondGroup.getElement());

        // Utenze
        const utenzeInput = Input({
            type: 'text',
            id: 'casa_utenze',
            name: 'casa_utenze',
            value: formData.casa_utenze,
            placeholder: '€',
            onChange: (value) => { formData.casa_utenze = value; }
        });

        const utenzeGroup = FormGroup({
            label: 'Utenze (luce, gas, cell, TV, rifiuti, acqua)',
            for: 'casa_utenze',
            component: utenzeInput
        });
        speseGrid.appendChild(utenzeGroup.getElement());

        // Add components to grid
        formGrid.appendChild(problematicheCheckbox.getElement());
        formGrid.appendChild(sfdCheckbox.getElement());
        formGrid.appendChild(residenzaComuneGroup.getElement());
        formGrid.appendChild(residenzaCapGroup.getElement());
        formGrid.appendChild(residenzaIndirizzoGroup.getElement());
        formGrid.appendChild(domicilioComuneGroup.getElement());
        formGrid.appendChild(domicilioCapGroup.getElement());
        formGrid.appendChild(domicilioIndirizzoGroup.getElement());
        formGrid.appendChild(viveInCasaGroup.getElement());
        formGrid.appendChild(situazioneGroup.getElement());
        formGrid.appendChild(particolariContainer);
        formGrid.appendChild(speseContainer);

        // Add annotations container
        const annotazioniContainer = document.createElement('div');
        annotazioniContainer.className = 'form-grid-full';
        annotazioniContainer.appendChild(annotazioniAlloggiativeGroup.getElement());
        formGrid.appendChild(annotazioniContainer);

        // Hide address fields if SFD is checked
        if (formData.casa_sfd) {
            residenzaComuneGroup.getElement().style.display = 'none';
            residenzaCapGroup.getElement().style.display = 'none';
            residenzaIndirizzoGroup.getElement().style.display = 'none';
            domicilioComuneGroup.getElement().style.display = 'none';
            domicilioCapGroup.getElement().style.display = 'none';
            domicilioIndirizzoGroup.getElement().style.display = 'none';
        }

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

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

        // Altre abilità
        const altreAbilitaInput = Input({
            type: 'text',
            id: 'lavoro_altre_abilita',
            name: 'lavoro_altre_abilita',
            value: formData.lavoro_altre_abilita,
            onChange: (value) => { formData.lavoro_altre_abilita = value; }
        });

        const altreAbilitaGroup = FormGroup({
            label: 'Altre abilità',
            for: 'lavoro_altre_abilita',
            component: altreAbilitaInput
        });

        // Problemi di occupazione/lavoro
        const problemiLavoroCheckbox = Checkbox({
            id: 'lavoro_problemi',
            name: 'lavoro_problemi',
            label: 'Problemi di occupazione/lavoro',
            checked: formData.lavoro_problemi,
            onChange: (value) => { formData.lavoro_problemi = value; }
        });

        // Occupazione
        const occupazioneRadio = createRadioGroup({
            name: 'lavoro_occupazione',
            options: [
                { value: 'Si', label: 'Sì' },
                { value: 'No', label: 'No' },
                { value: '?', label: 'Non specificato' }
            ],
            selected: formData.lavoro_occupazione,
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
            component: occupazioneRadio
        });

        // Copertura previdenziale
        const coperturaRadio = createRadioGroup({
            name: 'lavoro_copertura_previdenziale',
            options: [
                { value: 'Si', label: 'Sì' },
                { value: 'No', label: 'No' },
                { value: '?', label: 'Non specificato' }
            ],
            selected: formData.lavoro_copertura_previdenziale,
            onChange: (value) => { formData.lavoro_copertura_previdenziale = value; }
        });

        const coperturaGroup = FormGroup({
            label: 'Copertura Previdenziale',
            for: 'lavoro_copertura_previdenziale',
            component: coperturaRadio
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
        const noteInput = createTextarea({
            id: 'lavoro_note',
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
        formGrid.appendChild(altreAbilitaGroup.getElement());
        formGrid.appendChild(problemiLavoroCheckbox.getElement());
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

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }

    // Setup Alimentazione step
    function setupAlimentazioneStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Cibo/Alimentazione</h3>';

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Vitto
        const vittoInput = Input({
            type: 'text',
            id: 'alimentazione_vitto',
            name: 'alimentazione_vitto',
            value: formData.alimentazione_vitto,
            placeholder: '€',
            onChange: (value) => { formData.alimentazione_vitto = value; }
        });

        const vittoGroup = FormGroup({
            label: 'Vitto',
            for: 'alimentazione_vitto',
            component: vittoInput
        });

        // Spese alimentari
        const speseInput = Input({
            type: 'text',
            id: 'alimentazione_spese',
            name: 'alimentazione_spese',
            value: formData.alimentazione_spese,
            placeholder: '€',
            onChange: (value) => { formData.alimentazione_spese = value; }
        });

        const speseGroup = FormGroup({
            label: 'Spese alimentari',
            for: 'alimentazione_spese',
            component: speseInput
        });

        // Intolleranze
        const intolleranzeInput = Input({
            type: 'text',
            id: 'alimentazione_intolleranze',
            name: 'alimentazione_intolleranze',
            value: formData.alimentazione_intolleranze,
            onChange: (value) => { formData.alimentazione_intolleranze = value; }
        });

        const intolleranzeGroup = FormGroup({
            label: 'Intolleranze',
            for: 'alimentazione_intolleranze',
            component: intolleranzeInput
        });

        // Tipo alimentazione - Checkboxes
        const tipoContainer = document.createElement('div');
        tipoContainer.className = 'form-grid-full';

        const tipoTitle = document.createElement('h4');
        tipoTitle.textContent = 'Tipo alimentazione';
        tipoTitle.style.marginBottom = '1rem';
        tipoContainer.appendChild(tipoTitle);

        const tipoGrid = document.createElement('div');
        tipoGrid.className = 'checkbox-group';
        tipoContainer.appendChild(tipoGrid);

        // Mensa Checkbox
        const mensaCheckbox = Checkbox({
            id: 'alimentazione_mensa',
            name: 'alimentazione_mensa',
            label: 'Mensa',
            checked: formData.alimentazione_tipo.includes('Mensa'),
            onChange: (value) => {
                if (value) {
                    if (!formData.alimentazione_tipo.includes('Mensa')) {
                        formData.alimentazione_tipo.push('Mensa');
                    }
                } else {
                    formData.alimentazione_tipo = formData.alimentazione_tipo.filter(item => item !== 'Mensa');
                }
            }
        });
        tipoGrid.appendChild(mensaCheckbox.getElement());


        // Borsa alimentare Checkbox
        const borsaCheckbox = Checkbox({
            id: 'alimentazione_borsa',
            name: 'alimentazione_borsa',
            label: 'Borsa alimentare',
            checked: formData.alimentazione_tipo.includes('Borsa alimentare'),
            onChange: (value) => {
                if (value) {
                    if (!formData.alimentazione_tipo.includes('Borsa alimentare')) {
                        formData.alimentazione_tipo.push('Borsa alimentare');
                    }
                } else {
                    formData.alimentazione_tipo = formData.alimentazione_tipo.filter(item => item !== 'Borsa alimentare');
                }
            }
        });
        tipoGrid.appendChild(borsaCheckbox.getElement());

        // Autonomo Checkbox
        const autonomoCheckbox = Checkbox({
            id: 'alimentazione_autonomo',
            name: 'alimentazione_autonomo',
            label: 'Autonomo',
            checked: formData.alimentazione_tipo.includes('Autonomo'),
            onChange: (value) => {
                if (value) {
                    if (!formData.alimentazione_tipo.includes('Autonomo')) {
                        formData.alimentazione_tipo.push('Autonomo');
                    }
                } else {
                    formData.alimentazione_tipo = formData.alimentazione_tipo.filter(item => item !== 'Autonomo');
                }
            }
        });
        tipoGrid.appendChild(autonomoCheckbox.getElement());

        // Note alimentazione
        const noteAlimentazioneInput = createTextarea({
            id: 'alimentazione_note',
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
        formGrid.appendChild(vittoGroup.getElement());
        formGrid.appendChild(speseGroup.getElement());
        formGrid.appendChild(intolleranzeGroup.getElement());
        formGrid.appendChild(tipoContainer);

        // Create a full-width container for notes
        const noteContainer = document.createElement('div');
        noteContainer.className = 'form-grid-full';
        noteContainer.appendChild(noteAlimentazioneGroup.getElement());
        formGrid.appendChild(noteContainer);

        container.appendChild(formGrid);
        stepContent.appendChild(container);
    }
    // Setup Riepilogo step
    // Setup summary step showing all provided information
    function setupRiepilogoStep() {
        const container = document.createElement('div');
        container.innerHTML = '<h3>Riepilogo Informazioni</h3>';

        // Create summary
        const summary = document.createElement('div');
        summary.className = 'guest-summary';

        // Create sections
        const sections = [
            {
                title: steps[0].title,
                icon: steps[0].icon,
                fields: [
                    { label: 'Centro di Ascolto', value: formData.centro_ascolto },
                    { label: 'Data e Operatore', value: formData.data_operatore },
                    { label: 'Nominativo', value: `${formData.guest_first_name} ${formData.guest_last_name}` },
                    { label: 'Codice Fiscale', value: formData.guest_fiscal_code },
                    { label: 'Genere', value: formData.guest_sex === 'M' ? 'Maschile' : 'Femminile' },
                    { label: 'Data di Nascita', value: formData.guest_birth_date },
                    { label: 'Luogo di Nascita', value: formData.guest_birth_place },
                    { label: 'Provincia', value: formData.guest_provincia },
                    { label: 'Nazionalità', value: formData.guest_nationality },
                    { label: 'Documento Identità', value: formData.guest_documento_identita },
                    { label: 'Telefono', value: formData.guest_phone_number }
                ]
            },
            {
                title: steps[1].title,
                icon: steps[1].icon,
                fields: [
                    { label: 'Tipologia di reddito', value: formData.eco_tipo_reddito },
                    { label: 'Importo reddito', value: formData.eco_importo_reddito },
                    { label: 'Interventi di welfare', value: formData.eco_interventi_welfare.join(', ') },
                    { label: 'Disabilità documentata', value: formData.eco_disabilita },
                    { label: '% invalidità', value: formData.eco_percentuale_invalidita }
                ]
            },
            {
                title: steps[2].title,
                icon: steps[2].icon,
                fields: [
                    { label: 'Problematiche Abitative', value: formData.casa_problematiche ? 'Sì' : 'No' },
                    { label: 'Senza Fissa Dimora', value: formData.casa_sfd ? 'Sì' : 'No' },
                    { label: 'Comune Residenza', value: formData.casa_residenza_comune },
                    { label: 'Indirizzo Residenza', value: formData.casa_residenza_indirizzo },
                    { label: 'Situazione attuale', value: formData.casa_situazione }
                ]
            },
            {
                title: steps[3].title,
                icon: steps[3].icon,
                fields: [
                    { label: 'Titolo di Studio', value: formData.lavoro_titolo_studio },
                    { label: 'Occupazione', value: formData.lavoro_occupazione },
                    { label: 'Lavoro Svolto', value: formData.lavoro_svolto },
                    { label: 'Ore Settimanali', value: formData.lavoro_ore_settimanali },
                    { label: 'Copertura Previdenziale', value: formData.lavoro_copertura_previdenziale }
                ]
            },
            {
                title: steps[4].title,
                icon: steps[4].icon,
                fields: [
                    { label: 'Vitto', value: formData.alimentazione_vitto },
                    { label: 'Spese alimentari', value: formData.alimentazione_spese },
                    { label: 'Intolleranze', value: formData.alimentazione_intolleranze },
                    { label: 'Tipo alimentazione', value: formData.alimentazione_tipo.join(', ') }
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

                // Optional additional validations as needed
                break;

            // Add validation for other steps as needed
            case 'economica':
            case 'relazioni':
            case 'casa':
            case 'lavoro':
            case 'alimentazione':
                // No strict validation for these steps
                break;
        }

        return isValid;
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

            // Submit data
            let result;
            if (guest) {
                result = await guestService.updateGuest(guest.id, formData);
            } else {
                result = await guestService.createGuest(formData);
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

    // Helper function to create a textarea
    function createTextarea(config = {}) {
        const {
            id,
            value = '',
            onChange = () => {}
        } = config;

        const wrapper = document.createElement('div');
        wrapper.className = 'textarea-wrapper';

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.className = 'form-textarea';
        textarea.value = value;

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
    }

    // Function to create a radio button group
    function createRadioGroup(config = {}) {
        const {
            name,
            options = [],
            selected = '',
            onChange = () => {}
        } = config;

        const container = document.createElement('div');
        container.className = 'radio-group';
        container.style.display = 'flex';
        container.style.gap = '1rem';

        options.forEach(option => {
            const radioContainer = document.createElement('div');
            radioContainer.className = 'radio-option';
            radioContainer.style.display = 'flex';
            radioContainer.style.alignItems = 'center';
            radioContainer.style.gap = '0.5rem';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `${name}_${option.value}`;
            radio.name = name;
            radio.value = option.value;
            radio.checked = selected === option.value;

            const label = document.createElement('label');
            label.htmlFor = `${name}_${option.value}`;
            label.textContent = option.label;

            radio.addEventListener('change', () => {
                if (radio.checked) {
                    onChange(option.value);
                }
            });

            radioContainer.appendChild(radio);
            radioContainer.appendChild(label);
            container.appendChild(radioContainer);
        });

        return {
            getElement: () => container,
            getValue: () => {
                const checkedRadio = container.querySelector(`input[name="${name}"]:checked`);
                return checkedRadio ? checkedRadio.value : '';
            },
            setValue: (value) => {
                const radio = container.querySelector(`input[value="${value}"]`);
                if (radio) {
                    radio.checked = true;
                }
            }
        };
    }

    // Initialize form
    init();

    // Public API
    return {
        getElement: () => formContainer,
        getFormData: () => ({ ...formData }),
        goToStep: (stepIndex) => {
            if (stepIndex >= 0 && stepIndex < steps.length) {
                goToStep(stepIndex);
            }
        },
        getCurrentStep: () => currentStep
    };
};

module.exports = GuestForm;