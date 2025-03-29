// components/CentersPage/index.js
"use strict";

const StatefulComponent = require('../base/StateFullComponent');
const centerService = require('./centersService');
const CenterForm = require('./centerForm');
const CentersGrid = require('./centersGrid');
const { createPageTemplate } = require('./template');
const validators = require('../../utils/validators');
const { sanitizeObject } = require('../../utils/security');
const { EVENTS } = require('../../utils/constants');

class CentersPageElement extends StatefulComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize state
        this.initState({
            centers: [],
            isLoading: true,
            error: null,
            editingCenter: null
        });

        // Bind methods to maintain context
        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
        this.handleSubmitError = this.handleSubmitError.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormEvent = this.handleFormEvent.bind(this);
        this.handleAddNew = this.handleAddNew.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        // Initial render
        this.render();

        // Fetch data
        this.fetchCenters();

        // Add event listeners for form events
        this.shadowRoot.addEventListener(EVENTS.FORM.SUBMIT, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.ERROR, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.VALIDATE, this.handleFormEvent);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Remove event listeners
        this.shadowRoot.removeEventListener(EVENTS.FORM.SUBMIT, this.handleFormEvent);
        this.shadowRoot.removeEventListener(EVENTS.FORM.ERROR, this.handleFormEvent);
        this.shadowRoot.removeEventListener(EVENTS.FORM.VALIDATE, this.handleFormEvent);
    }

    handleFormEvent(event) {
        // Log form events for debugging
        if (event.type === EVENTS.FORM.ERROR) {
            console.error('Form Error:', event.detail.message);
        } else if (event.type === EVENTS.FORM.SUBMIT) {
            console.log('Form Submit:', event.detail.formData);
        } else if (event.type === EVENTS.FORM.VALIDATE) {
            if (!event.detail.isValid) {
                console.warn('Form Validation Failed:', event.detail.errors);
            }
        }
    }

    async fetchCenters() {
        try {
            this.setState({ isLoading: true, error: null });
            const centers = await centerService.fetchCenters();

            // Sanitize center data
            const sanitizedCenters = Array.isArray(centers)
                ? centers.map(center => sanitizeObject(center))
                : [];

            this.setState({ centers: sanitizedCenters, isLoading: false });
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to fetch centers',
                isLoading: false
            });
            console.error("Error fetching centers:", error);
        }
    }

    handleSubmitSuccess(response) {
        // Reset editing state and refresh centers
        this.setState({ editingCenter: null });
        this.fetchCenters();
    }

    handleSubmitError(error) {
        this.setState({
            error: error.message || 'Failed to save center'
        });
    }

    handleEdit(centerId) {
        const { centers } = this.getState();
        const center = centers.find(c => c.id === centerId);

        if (center) {
            // Validate center manually before editing
            let isValid = true;
            const errors = {};

            // Basic validation
            if (!center.name) {
                isValid = false;
                errors.name = 'Center name is required';
            }

            if (!center.type || center.type.length === 0) {
                isValid = false;
                errors.type = 'At least one center type is required';
            }

            if (!isValid) {
                this.setState({
                    error: 'Cannot edit center: Invalid center data'
                });
                return;
            }

            this.setState({ editingCenter: center });
        }
    }

    async handleDelete(centerId) {
        if (!confirm('Are you sure you want to delete this center?')) {
            return;
        }

        try {
            this.setState({ isLoading: true, error: null });
            await centerService.deleteCenter(centerId);
            await this.fetchCenters();
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to delete center',
                isLoading: false
            });
            console.error("Error deleting center:", error);
        }
    }

    handleCancel() {
        this.setState({ editingCenter: null });
    }

    handleAddNew() {
        this.setState({ editingCenter: {} });
    }

    render() {
        const state = this.getState();

        // Use template to create HTML
        this.shadowRoot.innerHTML = createPageTemplate(state);

        // Setup components after DOM is updated
        this.setupComponents();
    }

    setupComponents() {
        const { centers, editingCenter, isLoading } = this.getState();

        // Get container elements
        const formContainer = this.shadowRoot.querySelector('#form-container');
        const gridContainer = this.shadowRoot.querySelector('#grid-container');
        const addButton = this.shadowRoot.querySelector('#add-center-btn');

        if (!formContainer || !gridContainer) return;

        // Add event listener to add button
        if (addButton) {
            addButton.addEventListener('click', this.handleAddNew);
        }

        // Create or update form component
        const centerForm = CenterForm({
            center: editingCenter,
            onSubmit: this.handleSubmitSuccess,
            onCancel: () => this.handleCancel(),
            onError: this.handleSubmitError
        });

        // Create or update grid component
        const centersGrid = CentersGrid({
            centers,
            editingCenter,
            isLoading,
            onEdit: this.handleEdit,
            onDelete: this.handleDelete
        });

        // Clear and append to containers
        formContainer.innerHTML = '';
        if (editingCenter) {
            formContainer.appendChild(centerForm.getElement());
        }

        gridContainer.innerHTML = '';
        gridContainer.appendChild(centersGrid.getElement());
    }
}

// Register component
if (!window.customElements.get('centers-page')) {
    window.customElements.define('centers-page', CentersPageElement);
}

module.exports = CentersPageElement;