"use strict";

const Input = require('../ui/Input');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');
const Select = require('../ui/Select');

/**
 * Creates an enhanced guest search component with better filtering
 */
const GuestSearch = (config = {}) => {
    // State
    const state = {
        isLoading: false,
        searchResults: [],
        searchTerm: '',
        filters: {
            type: 'all'  // 'all', 'name', 'fiscal', 'id'
        },
        resultsVisible: false
    };

    // Callbacks
    const callbacks = {
        onSearch: typeof config.onSearch === 'function' ? config.onSearch : () => {},
        onView: typeof config.onView === 'function' ? config.onView : () => {},
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {},
        onSelect: typeof config.onSelect === 'function' ? config.onSelect : null
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'guest-search-container';

    // Create search section
    const searchSection = document.createElement('div');
    searchSection.className = 'search-section';
    container.appendChild(searchSection);

    // Create search form
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form';
    searchForm.addEventListener('submit', handleSearch);
    searchSection.appendChild(searchForm);

    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchForm.appendChild(searchContainer);

    // Create search field container
    const searchFieldContainer = document.createElement('div');
    searchFieldContainer.className = 'search-field';
    searchContainer.appendChild(searchFieldContainer);

    // Create search type select
    const searchTypeOptions = [
        { value: 'all', label: 'Tutti i campi' },
        { value: 'name', label: 'Nome' },
        { value: 'fiscal', label: 'Codice Fiscale' },
        { value: 'id', label: 'ID Ospite' }
    ];

    const searchTypeSelect = Select({
        id: 'search-type',
        name: 'search-type',
        options: searchTypeOptions,
        value: state.filters.type,
        onChange: (value) => {
            state.filters.type = value;
            updateSearchPlaceholder();
        }
    });

    const searchTypeGroup = FormGroup({
        label: 'Cerca per',
        for: 'search-type',
        component: searchTypeSelect
    });

    // Create search input
    const searchInput = Input({
        type: 'text',
        id: 'guest-search',
        name: 'guest-search',
        placeholder: 'Cerca per Nome, Codice Fiscale o ID',
        required: true,
        onChange: (value) => {
            state.searchTerm = value;
        }
    });

    const searchGroup = FormGroup({
        label: 'Cerca Ospite',
        for: 'guest-search',
        component: searchInput
    });

    searchFieldContainer.appendChild(searchTypeGroup.getElement());
    searchFieldContainer.appendChild(searchGroup.getElement());

    // Create search actions
    const searchActions = document.createElement('div');
    searchActions.className = 'search-actions';
    searchContainer.appendChild(searchActions);

    // Create search button
    const searchButton = Button({
        text: 'Cerca',
        type: 'submit',
        variant: 'primary',
        icon: `<svg class="icon" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>`
    });

    searchActions.appendChild(searchButton.getElement());

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    container.appendChild(resultsContainer);

    /**
     * Update search input placeholder based on selected search type
     */
    function updateSearchPlaceholder() {
        let placeholder = '';

        switch(state.filters.type) {
            case 'name':
                placeholder = 'Cerca per Nome e Cognome';
                break;
            case 'fiscal':
                placeholder = 'Cerca per Codice Fiscale';
                break;
            case 'id':
                placeholder = 'Cerca per ID Ospite';
                break;
            default:
                placeholder = 'Cerca per Nome, Codice Fiscale o ID';
        }

        searchInput.setPlaceholder(placeholder);
    }

    /**
     * Handle search form submission
     * @param {Event} e - Form submit event
     */
    async function handleSearch(e) {
        e.preventDefault();

        const searchTerm = searchInput.getValue().trim();
        if (!searchTerm) return;

        try {
            // Set loading state
            state.isLoading = true;
            state.resultsVisible = true;
            renderResults();

            // Call search callback with filters
            const results = await callbacks.onSearch(searchTerm, state.filters);

            // Update state
            state.isLoading = false;
            state.searchResults = results;

            renderResults();
        } catch (error) {
            console.error('Search error:', error);
            state.isLoading = false;
            state.searchResults = [];
            renderResults(error.message);
        }
    }

    /**
     * Render search results with enhanced guest information
     * @param {string} errorMessage - Optional error message
     */
    function renderResults(errorMessage = null) {
        // Clear previous results
        resultsContainer.innerHTML = '';

        // If results are not visible, don't show anything
        if (!state.resultsVisible) {
            return;
        }

        // Create results container with header
        const resultsWrapper = document.createElement('div');
        resultsWrapper.className = 'search-results-container';

        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'search-results-header';

        const resultsTitle = document.createElement('h4');
        resultsTitle.className = 'search-results-title';

        // Create clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
            Azzera ricerca
        `;
        clearButton.addEventListener('click', clearSearch);

        resultsHeader.appendChild(resultsTitle);
        resultsHeader.appendChild(clearButton);
        resultsWrapper.appendChild(resultsHeader);

        // Show loading indicator
        if (state.isLoading) {
            resultsTitle.textContent = 'Ricerca in corso...';

            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = `
                <div class="spinner"></div>
                <p>Ricerca in corso...</p>
            `;

            resultsWrapper.appendChild(loadingIndicator);
            resultsContainer.appendChild(resultsWrapper);
            return;
        }

        // Show error if any
        if (errorMessage) {
            resultsTitle.textContent = 'Errore';

            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.padding = '10px';
            errorMessage.style.color = 'var(--danger-color)';
            errorMessage.style.textAlign = 'center';
            errorMessage.textContent = errorMessage;

            resultsWrapper.appendChild(errorMessage);
            resultsContainer.appendChild(resultsWrapper);
            return;
        }

        // Show no results message
        if (state.searchResults.length === 0) {
            resultsTitle.textContent = 'Nessun risultato trovato';

            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.padding = '20px';
            noResults.style.textAlign = 'center';
            noResults.style.color = 'var(--text-color)';
            noResults.innerHTML = `
                <p>Nessun ospite trovato. Controlla i termini di ricerca e riprova.</p>
            `;

            resultsWrapper.appendChild(noResults);
            resultsContainer.appendChild(resultsWrapper);
            return;
        }

        // Show results
        resultsTitle.textContent = `${state.searchResults.length} risultati trovati`;

        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';

        state.searchResults.forEach(guest => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.dataset.id = guest.id;

            // Format guest name
            const name = `${guest.guest_first_name || ''} ${guest.guest_last_name || ''}`;

            // Create enhanced layout for better visual hierarchy
            resultItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex-grow: 1;">
                        <div class="guest-header">
                            <span class="guest-id">${guest.guest_code || guest.id}</span>
                            <span class="guest-name">${name}</span>
                        </div>
                        <div style="color: #4b5563; margin-bottom: 4px;">
                            ${guest.guest_fiscal_code || 'No Fiscal Code'}
                        </div>
                        <div class="guest-meta">
                            ${guest.guest_address ?
                `<div class="meta-item">
                                <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                ${guest.guest_address}
                            </div>` : ''}
                            ${guest.guest_phone_number ?
                `<div class="meta-item">
                                <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                                ${guest.guest_phone_number}
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="icon-btn view-btn" data-id="${guest.id}" title="View Guest">
                            <svg class="icon" viewBox="0 0 24 24" fill="black">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                        <button class="icon-btn edit-btn" data-id="${guest.id}" title="Edit Guest">
                            <svg class="icon" viewBox="0 0 24 24" fill="black">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Add click event for the entire item if onSelect is provided
            if (callbacks.onSelect) {
                resultItem.addEventListener('click', () => callbacks.onSelect(guest.id));
            }

            // Add event listeners for buttons
            const viewBtn = resultItem.querySelector('.view-btn');
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                callbacks.onView(guest.id);
            });

            const editBtn = resultItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                callbacks.onEdit(guest.id);
            });

            resultsList.appendChild(resultItem);
        });

        resultsWrapper.appendChild(resultsList);
        resultsContainer.appendChild(resultsWrapper);
    }

    /**
     * Clear search results and input
     */
    function clearSearch() {
        searchInput.setValue('');
        state.searchResults = [];
        state.resultsVisible = false;
        renderResults();
    }

    // Initialize
    updateSearchPlaceholder();

    // Public API
    return {
        getElement: () => container,

        clearSearch: () => {
            clearSearch();
        },

        setResults: (results) => {
            state.searchResults = Array.isArray(results) ? [...results] : [];
            state.isLoading = false;
            state.resultsVisible = state.searchResults.length > 0;
            renderResults();
        },

        setLoading: (loading) => {
            state.isLoading = loading;
            renderResults();
        },

        getSearchTerm: () => state.searchTerm,

        getSearchFilters: () => ({ ...state.filters })
    };
};

module.exports = GuestSearch;