// guestSearch.js
"use strict";

const Input = require('../ui/Input');
const Button = require('../ui/Button');
const FormGroup = require('../ui/FormGroup');

/**
 * Creates a guest search component
 */
const GuestSearch = (config = {}) => {
    // State
    const state = {
        isLoading: false,
        searchResults: []
    };

    // Callbacks
    const callbacks = {
        onSearch: typeof config.onSearch === 'function' ? config.onSearch : () => {},
        onView: typeof config.onView === 'function' ? config.onView : () => {},
        onEdit: typeof config.onEdit === 'function' ? config.onEdit : () => {}
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'guest-search-container';

    // Create search form
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form';
    searchForm.addEventListener('submit', handleSearch);

    // Create search input
    const searchInput = Input({
        type: 'text',
        id: 'guest-search',
        name: 'guest-search',
        placeholder: 'Search by Guest ID or Fiscal Code',
        required: true
    });

    // Create search button
    const searchButton = Button({
        text: 'Search',
        type: 'submit',
        variant: 'primary',
        icon: `<svg class="icon" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>`
    });

    // Create search form group
    const searchGroup = FormGroup({
        label: 'Search for Guest',
        for: 'guest-search',
        component: searchInput,
        helpText: 'Enter Guest ID or Fiscal Code'
    });

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.style.marginTop = '20px';

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
            renderResults();

            // Call search callback
            const results = await callbacks.onSearch(searchTerm);

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
     * Render search results
     * @param {string} errorMessage - Optional error message
     */
    function renderResults(errorMessage = null) {
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Show loading indicator
        if (state.isLoading) {
            resultsContainer.innerHTML = `
                <div class="loading-indicator" style="padding: 20px; text-align: center;">
                    <div class="spinner"></div>
                    <p>Searching...</p>
                </div>
            `;
            return;
        }

        // Show error if any
        if (errorMessage) {
            resultsContainer.innerHTML = `
                <div class="error-message" style="padding: 10px; color: var(--danger-color); text-align: center;">
                    ${errorMessage}
                </div>
            `;
            return;
        }

        // Show no results message
        if (state.searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results" style="padding: 20px; text-align: center; color: var(--text-color);">
                    <p>No guests found. Please check the ID or Fiscal Code and try again.</p>
                </div>
            `;
            return;
        }

        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';

        state.searchResults.forEach(guest => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.style.padding = '10px';
            resultItem.style.borderBottom = '1px solid var(--border-color)';
            resultItem.style.marginBottom = '10px';

            // Format guest name
            const name = `${guest.guest_first_name || ''} ${guest.guest_last_name || ''}`;

            resultItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold;">${name}</div>
                        <div style="font-size: 0.9em; color: var(--text-color);">
                            ID: ${guest.guest_code || guest.id} | Fiscal Code: ${guest.guest_fiscal_code || 'N/A'}
                        </div>
                        <div style="font-size: 0.9em; color: var(--text-color);">
                            ${guest.guest_address || 'No address'} | ${guest.guest_phone_number || 'No phone'}
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="icon-btn view-btn" data-id="${guest.id}" title="View Guest">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                        <button class="icon-btn edit-btn" data-id="${guest.id}" title="Edit Guest">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Add event listeners
            const viewBtn = resultItem.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => callbacks.onView(guest.id));

            const editBtn = resultItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => callbacks.onEdit(guest.id));

            resultsList.appendChild(resultItem);
        });

        resultsContainer.appendChild(resultsList);
    }

    // Build form
    const searchButtonContainer = document.createElement('div');
    searchButtonContainer.style.marginLeft = '10px';
    searchButtonContainer.appendChild(searchButton.getElement());

    // Create a flex container for the search input and button
    const searchFlexContainer = document.createElement('div');
    searchFlexContainer.style.display = 'flex';
    searchFlexContainer.style.alignItems = 'flex-end';
    searchFlexContainer.appendChild(searchGroup.getElement());
    searchFlexContainer.appendChild(searchButtonContainer);

    searchForm.appendChild(searchFlexContainer);
    container.appendChild(searchForm);
    container.appendChild(resultsContainer);

    // Initialize
    renderResults();

    // Public API
    return {
        getElement: () => container,

        clearSearch: () => {
            searchInput.setValue('');
            state.searchResults = [];
            renderResults();
        },

        setResults: (results) => {
            state.searchResults = Array.isArray(results) ? [...results] : [];
            state.isLoading = false;
            renderResults();
        },

        setLoading: (loading) => {
            state.isLoading = loading;
            renderResults();
        }
    };
};

module.exports = GuestSearch;