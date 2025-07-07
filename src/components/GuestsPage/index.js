// src/components/GuestsPage/index.js
"use strict";

const StatefulComponent = require('../base/StateFullComponent');
const guestService = require('./guestService');
const GuestsTable = require('./guestsTable');
const GuestSearch = require('./guestSearch');
const GuestForm = require('./guestForm');
const GuestView = require('./guestView');
const { createPageTemplate } = require('./guestTemplate');
const { sanitizeObject } = require('../../utils/security');
const { EVENTS } = require('../../utils/constants');
const auth = require('../../modules/auth');

class GuestsPageElement extends StatefulComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Determine if user is data entry role
        const userRole = auth.getAuthState().role?.role_name || '';
        const isDataEntry = userRole === 'data_entry';

        // Initialize state
        this.initState({
            guests: [],
            isLoading: true,
            error: null,
            isDataEntry,
            isCreating: false,
            isEditing: false,
            isViewing: false,
            currentGuest: null
        });

        // Bind methods to maintain context
        this.handleCreateGuest = this.handleCreateGuest.bind(this);
        this.handleViewGuest = this.handleViewGuest.bind(this);
        this.handleEditGuest = this.handleEditGuest.bind(this);
        this.handleDeleteGuest = this.handleDeleteGuest.bind(this);
        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
        this.handleSubmitError = this.handleSubmitError.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFormEvent = this.handleFormEvent.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        // Initial render
        this.render();

        // Setup event listeners
        this.setupEventListeners();

        // Fetch data if not data entry role
        if (!this.getState().isDataEntry) {
            this.fetchGuests();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Remove event listeners
        this.removeEventListeners();
    }

    setupEventListeners() {
        // Form events
        this.shadowRoot.addEventListener(EVENTS.FORM.SUBMIT, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.ERROR, this.handleFormEvent);
        this.shadowRoot.addEventListener(EVENTS.FORM.VALIDATE, this.handleFormEvent);

        // Add action button click handlers
        const createBtn = this.shadowRoot.querySelector('#create-guest-btn');
        if (createBtn) {
            createBtn.addEventListener('click', this.handleCreateGuest);
        }
    }

    removeEventListeners() {
        // Form events
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

    async fetchGuests() {
        try {
            this.setState({ isLoading: true, error: null });
            const guests = await guestService.fetchGuests();

            // Sanitize guest data
            const sanitizedGuests = Array.isArray(guests)
                ? guests.map(guest => sanitizeObject(guest))
                : [];

            this.setState({ guests: sanitizedGuests, isLoading: false });
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to fetch guests',
                isLoading: false
            });
            console.error("Error fetching guests:", error);
        }
    }

    async handleSearch(searchTerm) {
        try {
            this.setState({ isLoading: true, error: null });
            const results = await guestService.searchGuest(searchTerm);
            return results;
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to search for guests',
                isLoading: false
            });
            console.error("Error searching for guests:", error);
            throw error;
        } finally {
            this.setState({ isLoading: false });
        }
    }

    handleViewGuest(guestId) {
        this.setState({
            isViewing: true,
            isCreating: false,
            isEditing: false,
            currentGuest: guestId
        });
    }

    handleCreateGuest() {
        this.setState({
            isCreating: true,
            isEditing: false,
            isViewing: false,
            currentGuest: null
        });
    }

    handleEditGuest(guestId) {
        const { guests, isViewing } = this.getState();

        // Store the current active tab if we're viewing the guest
        let activeTab = null;
        if (isViewing && this.getState().currentGuest === guestId) {
            // Get reference to the GuestView component
            const viewContainer = this.shadowRoot.querySelector('#view-container');
            if (viewContainer && viewContainer.firstChild) {
                const guestViewComponent = viewContainer.firstChild;
                // Get the active tab if the component exposes this method
                if (typeof guestViewComponent.getActiveTab === 'function') {
                    activeTab = guestViewComponent.getActiveTab();
                }
            }

            this.setState({
                isEditing: true,
                isCreating: false,
                isViewing: false,
                activeTab: activeTab  // Store the active tab in state
            });
            return;
        }

        // Find the guest to edit
        const guest = guests.find(g => g.id === guestId);

        if (guest) {
            this.setState({
                isEditing: true,
                isCreating: false,
                isViewing: false,
                currentGuest: guestId,
                activeTab: null  // Reset active tab when directly editing
            });
        }
    }

    async handleDeleteGuest(guestId) {
        if (!confirm('Are you sure you want to delete this guest?')) {
            return;
        }

        try {
            this.setState({ isLoading: true, error: null });
            await guestService.deleteGuest(guestId);

            // Reset state if we were viewing or editing this guest
            if (this.getState().currentGuest === guestId) {
                this.setState({
                    isViewing: false,
                    isEditing: false,
                    currentGuest: null
                });
            }

            // Refresh the guests list
            await this.fetchGuests();
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to delete guest',
                isLoading: false
            });
            console.error("Error deleting guest:", error);
        }
    }

    handleSubmitSuccess(response) {
        // Reset state and refresh guests
        this.setState({
            isCreating: false,
            isEditing: false,
            isViewing: true,
            currentGuest: response.id
        });

        // Refresh the guests list
        this.fetchGuests();
    }

    handleSubmitError(error) {
        this.setState({
            error: error.message || 'Failed to save guest'
        });
    }

    handleCancel() {
        const { currentGuest, isCreating, isEditing } = this.getState();

        // If editing, go back to viewing
        if (isEditing && currentGuest) {
            this.setState({
                isEditing: false,
                isViewing: true
            });
        } else {
            // Otherwise, go back to the list
            this.setState({
                isCreating: false,
                isEditing: false,
                isViewing: false,
                currentGuest: null
            });
        }
    }

    render() {
        const state = this.getState();

        // Use template to create HTML
        this.shadowRoot.innerHTML = createPageTemplate(state);

        // Setup components after DOM is updated
        this.setupComponents();
    }

    setupComponents() {
        const state = this.getState();
        const {
            guests,
            isLoading,
            isDataEntry,
            isCreating,
            isEditing,
            isViewing,
            currentGuest,
            activeTab
        } = state;

        // Create or edit form
        if (isCreating || isEditing) {
            const formContainer = this.shadowRoot.querySelector('#form-container');
            if (!formContainer) return;

            let guestToEdit = null;

            if (isEditing && currentGuest) {
                guestToEdit = guests.find(g => g.id === currentGuest);
            }

            // Map the tab name to the form step index
            let initialStep = 0;
            if (activeTab) {
                const tabToStepMap = {
                    'anagrafica': 0,
                    'economica': 1,
                    'relazioni': 2,
                    'casa': 3,
                    'lavoro': 4,
                    'alimentazione': 5
                };
                initialStep = tabToStepMap[activeTab] || 0;
            }

            const guestForm = GuestForm({
                guest: guestToEdit,
                onSubmit: this.handleSubmitSuccess,
                onCancel: this.handleCancel,
                onError: this.handleSubmitError,
                initialStep: initialStep // Pass the initial step based on active tab
            });

            formContainer.innerHTML = '';
            formContainer.appendChild(guestForm.getElement());
            return;
        }

        // View guest
        if (isViewing && currentGuest) {
            const viewContainer = this.shadowRoot.querySelector('#view-container');
            if (!viewContainer) return;

            const guestView = GuestView({
                onEdit: this.handleEditGuest,
                onBack: this.handleCancel
            });

            viewContainer.innerHTML = '';
            viewContainer.appendChild(guestView.getElement());

            // Load guest data
            guestView.setGuest(currentGuest);
            return;
        }

        // For Data Entry users, show search
        if (isDataEntry) {
            const searchContainer = this.shadowRoot.querySelector('#search-container');
            if (!searchContainer) return;

            const guestSearch = GuestSearch({
                onSearch: this.handleSearch,
                onView: this.handleViewGuest,
                onEdit: this.handleEditGuest
            });

            searchContainer.innerHTML = '';
            searchContainer.appendChild(guestSearch.getElement());
            return;
        }

        // For non-Data Entry users, show table
        const tableContainer = this.shadowRoot.querySelector('#table-container');
        if (!tableContainer) return;

        console.log(guests)
        const guestsTable = GuestsTable({
            guests,
            isLoading,
            onView: this.handleViewGuest,
            onEdit: this.handleEditGuest,
            onDelete: this.handleDeleteGuest
        });

        tableContainer.innerHTML = '';
        tableContainer.appendChild(guestsTable.getElement());
    }
}

// Register component
if (!window.customElements.get('guests-page')) {
    window.customElements.define('guests-page', GuestsPageElement);
}

module.exports = GuestsPageElement;