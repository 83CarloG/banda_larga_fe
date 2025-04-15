// guestView.js
"use strict";

const guestService = require('./guestService');

/**
 * Creates a component for viewing guest details with tabs
 */
const GuestView = (config = {}) => {
    // Default configuration
    const {
        guest = null,
        onEdit = () => {},
        onBack = () => {}
    } = config;

    // Component state
    const state = {
        guest: guest,
        activeTab: 'anagrafica',
        isLoading: !guest,
        history: [],
        historyFilters: {
            category: 'all',
            timeframe: 'all',
            field: null
        },
        error: null,
        isEditing: false
    };

    // Category definitions
    const categories = {
        anagrafica: { icon: '👤', color: 'bg-blue-100 text-blue-800', title: 'Anagrafica' },
        casa: { icon: '🏠', color: 'bg-green-100 text-green-800', title: 'Casa/Abitazione' },
        lavoro: { icon: '💼', color: 'bg-amber-100 text-amber-800', title: 'Lavoro/Occupazione' },
        alimentazione: { icon: '🍽️', color: 'bg-red-100 text-red-800', title: 'Alimentazione' },
        economica: { icon: '💰', color: 'bg-purple-100 text-purple-800', title: 'Situazione Economica' },
        relazioni: { icon: '👥', color: 'bg-teal-100 text-teal-800', title: 'Rete e Relazioni' }
    };

    // Create container
    const container = document.createElement('div');
    container.className = 'guest-view-container';

    /**
     * Fetches guest data and history
     * @param {number} guestId - Guest ID
     */
    async function fetchGuestData(guestId) {
        if (!guestId) return;

        try {
            state.isLoading = true;
            render();

            // Fetch guest data
            const { guest } = await guestService.getGuest(guestId);
            state.guest = guest;

            // Fetch guest history
            const history = await guestService.getGuestHistory(guestId);
            state.history = history;

            state.isLoading = false;
            render();
        } catch (error) {
            state.error = error.message || 'Failed to load guest data';
            state.isLoading = false;
            render();
        }
    }

    /**
     * Renders the component
     */
    function render() {
        container.innerHTML = '';

        if (state.isLoading) {
            container.innerHTML = `
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>Loading guest data...</p>
                </div>
            `;
            return;
        }

        if (state.error) {
            container.innerHTML = `
                <div class="error-banner" role="alert">
                    <svg class="error-icon" viewBox="0 0 24 24">
                        <path d="M13 13H11V7H13M11 15H13V17H11M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 6.47715 17.5228 2 12 2Z"/>
                    </svg>
                    <span>${state.error}</span>
                </div>
                <button id="back-btn" class="cancel-btn">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                    </svg>
                    Go Back
                </button>
            `;

            // Add event listener
            container.querySelector('#back-btn').addEventListener('click', onBack);

            return;
        }

        if (!state.guest) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No guest selected</p>
                </div>
                <button id="back-btn" class="cancel-btn">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                    </svg>
                    Go Back
                </button>
            `;

            // Add event listener
            container.querySelector('#back-btn').addEventListener('click', onBack);

            return;
        }

        // Full guest view with split layout
        renderSplitView();
    }

    /**
     * Renders the split view with guest details and history
     */
    function renderSplitView() {
        // Set up the split layout with tabs at the top
        container.innerHTML = `
            <div class="guest-header">
                <div class="guest-info">
                    <h2>${state.guest.guest_first_name} ${state.guest.guest_last_name}</h2>
                    <div class="guest-meta">
                        <span>ID: ${state.guest.guest_code || state.guest.id}</span>
                        <span>Fiscal Code: ${state.guest.guest_fiscal_code || 'N/A'}</span>
                    </div>
                </div>
                <div class="guest-actions">
                    <button id="edit-guest-btn" class="primary-btn">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                        </svg>
                        Edit Guest
                    </button>
                </div>
            </div>
            
            <!-- Tabs that span the full width -->
            <div class="guest-tabs">
                <button id="tab-anagrafica" class="tab-button ${state.activeTab === 'anagrafica' ? 'active' : ''}">
                    <span class="tab-icon">👤</span>
                    <span class="tab-text">Anagrafica</span>
                </button>
                <button id="tab-casa" class="tab-button ${state.activeTab === 'casa' ? 'active' : ''}">
                    <span class="tab-icon">🏠</span>
                    <span class="tab-text">Casa/Abitazione</span>
                </button>
                <button id="tab-lavoro" class="tab-button ${state.activeTab === 'lavoro' ? 'active' : ''}">
                    <span class="tab-icon">💼</span>
                    <span class="tab-text">Lavoro/Occupazione</span>
                </button>
                <button id="tab-alimentazione" class="tab-button ${state.activeTab === 'alimentazione' ? 'active' : ''}">
                    <span class="tab-icon">🍽️</span>
                    <span class="tab-text">Alimentazione</span>
                </button>
                <button id="tab-economica" class="tab-button ${state.activeTab === 'economica' ? 'active' : ''}">
                    <span class="tab-icon">💰</span>
                    <span class="tab-text">Situazione Economica</span>
                </button>
                <button id="tab-relazioni" class="tab-button ${state.activeTab === 'relazioni' ? 'active' : ''}">
                    <span class="tab-icon">👥</span>
                    <span class="tab-text">Rete e Relazioni</span>
                </button>
            </div>
            
            <!-- Split content area below tabs -->
            <div class="guest-split-view">
                <!-- Left panel for guest details -->
                <div class="guest-left-panel">
                    <div id="tab-content" class="tab-content"></div>
                </div>
                
                <!-- Right panel for history -->
                <div class="guest-right-panel">
                    <div class="history-header">
                        <h2>Cronologia Modifiche</h2>
                    </div>
                    <div class="history-filters">
                        <div class="filter-group">
                            <div class="filter-label">Categoria</div>
                            <select id="category-filter" class="filter-select">
                                <option value="all" ${state.historyFilters.category === 'all' ? 'selected' : ''}>Tutte</option>
                                ${Object.entries(categories).map(([key, cat]) => `
                                    <option value="${key}" ${state.historyFilters.category === key ? 'selected' : ''}>
                                        ${cat.icon} ${cat.title}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <div class="filter-label">Periodo</div>
                            <select id="time-filter" class="filter-select">
                                <option value="all" ${state.historyFilters.timeframe === 'all' ? 'selected' : ''}>Tutto</option>
                                <option value="week" ${state.historyFilters.timeframe === 'week' ? 'selected' : ''}>Ultima settimana</option>
                                <option value="month" ${state.historyFilters.timeframe === 'month' ? 'selected' : ''}>Ultimo mese</option>
                                <option value="quarter" ${state.historyFilters.timeframe === 'quarter' ? 'selected' : ''}>Ultimi 3 mesi</option>
                            </select>
                        </div>
                    </div>
                    <div id="history-content" class="history-content"></div>
                    
                    <!-- Legend at bottom of history panel -->
                    <div class="history-legend">
                        <div class="legend-item">
                            <span class="legend-dot addition"></span>
                            <span>Aggiunta</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot removal"></span>
                            <span>Rimozione</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot modification"></span>
                            <span>Modifica</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot creation"></span>
                            <span>Creazione iniziale</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render tab content
        renderTabContent(container.querySelector('#tab-content'));

        // Render history content
        renderHistoryContent(container.querySelector('#history-content'));

        // Add event listeners
        container.querySelector('#edit-guest-btn').addEventListener('click', () => onEdit(state.guest.id));

        // Add tab event listeners
        const tabButtons = container.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.id.replace('tab-', '');
                switchTab(tabId);
            });
        });

        // Add history filter event listeners
        container.querySelector('#category-filter').addEventListener('change', (e) => {
            state.historyFilters.category = e.target.value;
            renderHistoryContent(container.querySelector('#history-content'));
        });

        container.querySelector('#time-filter').addEventListener('change', (e) => {
            state.historyFilters.timeframe = e.target.value;
            renderHistoryContent(container.querySelector('#history-content'));
        });
    }

    /**
     * Renders the content for the active tab
     * @param {HTMLElement} tabContent - Tab content container
     */
    function renderTabContent(tabContent) {
        tabContent.innerHTML = '';

        switch(state.activeTab) {
            case 'anagrafica':
                renderAnagraficaTab(tabContent);
                break;
            case 'economica':
                renderEconomicaTab(tabContent);
                break;
            case 'relazioni':
                renderRelazioniTab(tabContent);
                break;
            case 'casa':
                renderCasaTab(tabContent);
                break;
            case 'lavoro':
                renderLavoroTab(tabContent);
                break;
            case 'alimentazione':
                renderAlimentazioneTab(tabContent);
                break;
        }
    }

    /**
     * Renders the Anagrafica tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderAnagraficaTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Anagrafica</h3>
            
            <div class="field-row">
                <div class="field-label">Nominativo</div>
                <div class="field-value">${guest.guest_first_name} ${guest.guest_last_name}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Codice Fiscale</div>
                <div class="field-value">${guest.guest_fiscal_code || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Data di Nascita</div>
                <div class="field-value">${formatDate(guest.guest_birth_date) || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Genere</div>
                <div class="field-value">${guest.guest_sex === 'M' ? 'Maschile' : 'Femminile'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Stato Civile</div>
                <div class="field-value">${guest.guest_state_civil || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Nazionalità</div>
                <div class="field-value">${guest.guest_nationality || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Telefono</div>
                <div class="field-value">${guest.guest_phone_number || 'Non specificato'}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Renders the Casa tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderCasaTab(container) {
        const guest = state.guest;

        // Get housing data from guest object
        const housingData = {
            problematiche: guest.casa_problematiche || false,
            sfd: guest.casa_sfd || false,
            residenza_comune: guest.casa_residenza_comune || guest.guest_address?.split(',')[1]?.trim() || 'Non specificato',
            residenza_cap: guest.casa_residenza_cap || guest.guest_address?.split(',')[0]?.trim() || 'Non specificato',
            residenza_indirizzo: guest.casa_residenza_indirizzo || guest.guest_address || 'Non specificato',
            domicilio_comune: guest.casa_domicilio_comune || 'Non specificato',
            domicilio_cap: guest.casa_domicilio_cap || 'Non specificato',
            domicilio_indirizzo: guest.casa_domicilio_indirizzo || 'Non specificato',
            situazione: guest.casa_situazione || 'Non specificata'
        };

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Casa/Abitazione</h3>
            
            <div class="field-row">
                <div class="field-label">Problematiche abitative</div>
                <div class="field-value">${housingData.problematiche ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Senza Fissa Dimora</div>
                <div class="field-value">${housingData.sfd ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Situazione attuale</div>
                <div class="field-value">${housingData.situazione}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Indirizzo domicilio</div>
                <div class="field-value">${housingData.domicilio_indirizzo}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">CAP domicilio</div>
                <div class="field-value">${housingData.domicilio_cap}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Comune domicilio</div>
                <div class="field-value">${housingData.domicilio_comune}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Renders the Lavoro tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderLavoroTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Lavoro/Occupazione</h3>
            
            <div class="field-row">
                <div class="field-label">Occupazione</div>
                <div class="field-value">${guest.lavoro_occupazione || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Lavoro svolto attualmente</div>
                <div class="field-value">${guest.lavoro_svolto || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Ore lavoro settimanali</div>
                <div class="field-value">${guest.lavoro_ore_settimanali || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Copertura previdenziale</div>
                <div class="field-value">${guest.lavoro_copertura_previdenziale || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Note</div>
                <div class="field-value">${guest.lavoro_note || 'Nessuna nota'}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Renders the Alimentazione tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderAlimentazioneTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Cibo/Alimentazione</h3>
            
            <div class="field-row">
                <div class="field-label">Spese Mensili Vitto</div>
                <div class="field-value">${guest.alimentazione_spese_vitto || 'Non specificato'}</div>
            </div>
            
            <div class="field-row note-row">
                <div class="field-label">Note Alimentazione</div>
                <div class="field-value note-value">${guest.alimentazione_note || 'Nessuna nota'}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Simplified placeholders for other tabs
     */
    function renderEconomicaTab(container) {
        const content = document.createElement('div');
        content.className = 'tab-section';
        content.innerHTML = `
            <h3 class="tab-title">Situazione Economica e Salute</h3>
            <div class="placeholder-message">Questa sezione è in fase di implementazione.</div>
        `;
        container.appendChild(content);
    }

    function renderRelazioniTab(container) {
        const content = document.createElement('div');
        content.className = 'tab-section';
        content.innerHTML = `
            <h3 class="tab-title">Rete e Relazioni</h3>
            <div class="placeholder-message">Questa sezione è in fase di implementazione.</div>
        `;
        container.appendChild(content);
    }

    /**
     * Switches to a different tab
     * @param {string} tabId - Tab identifier
     */
    function switchTab(tabId) {
        state.activeTab = tabId;

        // Update tab buttons
        const tabButtons = container.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `tab-${tabId}`) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        const tabContent = container.querySelector('.tab-content');
        renderTabContent(tabContent);
    }

    /**
     * Renders the history content in the right panel
     * @param {HTMLElement} historyContent - History content container
     */
    function renderHistoryContent(historyContent) {
        const filteredHistory = getFilteredHistory();
        const groupedHistory = groupHistoryByDate(filteredHistory);

        if (Object.keys(groupedHistory).length === 0) {
            historyContent.innerHTML = `
                <div class="empty-history">
                    <p>Nessuna modifica trovata con i filtri selezionati</p>
                </div>
            `;
            return;
        }

        // Sort dates in descending order
        const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a));

        // Clear the container
        historyContent.innerHTML = '';

        // Create entries for each date
        sortedDates.forEach(date => {
            const dateEntries = groupedHistory[date];

            const dateSection = document.createElement('div');
            dateSection.className = 'history-date-section';

            dateSection.innerHTML = `
                <div class="history-date-header">${formatDate(date)}</div>
            `;

            const entriesList = document.createElement('div');
            entriesList.className = 'history-entries';

            dateEntries.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'history-entry';
                entryElement.dataset.field = entry.field;

                // Category icon and time
                const categoryIcon = categories[entry.category]?.icon || '📋';
                const categoryName = categories[entry.category]?.title || 'Altro';

                entryElement.innerHTML = `
                    <div class="entry-header">
                        <div class="entry-category">
                            <span class="category-icon">${categoryIcon}</span>
                            <span class="category-name">${categoryName}</span>
                        </div>
                        <div class="entry-time">${entry.time} - ${entry.operator}</div>
                    </div>
                    <div class="entry-content ${entry.type}">
                        <div class="entry-field">${entry.field}</div>
                        ${renderHistoryChangeSimple(entry)}
                    </div>
                `;

                entriesList.appendChild(entryElement);

                // Add click event to filter by this field
                entryElement.addEventListener('click', () => {
                    if (state.historyFilters.field === entry.field) {
                        state.historyFilters.field = null;
                    } else {
                        state.historyFilters.field = entry.field;
                    }
                    renderHistoryContent(historyContent);
                });
            });

            dateSection.appendChild(entriesList);
            historyContent.appendChild(dateSection);
        });
    }

    /**
     * Renders a history change in a simplified manner
     * @param {Object} entry - History entry
     * @returns {string} - HTML for the change
     */
    function renderHistoryChangeSimple(entry) {
        switch(entry.type) {
            case 'modified':
                return `
                    <div class="entry-values">
                        <div class="old-value">${entry.oldValue || '(vuoto)'}</div>
                        <div class="new-value">${entry.newValue || '(vuoto)'}</div>
                    </div>
                `;
            case 'added':
                return `<div class="entry-value added-value">+ ${entry.newValue}</div>`;
            case 'removed':
                return `<div class="entry-value removed-value">- ${entry.oldValue}</div>`;
            case 'creation':
                return `<div class="entry-value creation-value">${entry.newValue}</div>`;
            default:
                return `<div class="entry-value">Modifica</div>`;
        }
    }

    /**
     * Filters history based on current filters
     * @returns {Array} - Filtered history entries
     */
    function getFilteredHistory() {
        return state.history.filter(entry => {
            // Filter by category
            if (state.historyFilters.category !== 'all' &&
                entry.category !== state.historyFilters.category) {
                return false;
            }

            // Filter by timeframe
            if (state.historyFilters.timeframe !== 'all') {
                const entryDate = new Date(entry.date);
                const now = new Date();
                const diffDays = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));

                if (state.historyFilters.timeframe === 'week' && diffDays > 7) return false;
                if (state.historyFilters.timeframe === 'month' && diffDays > 30) return false;
                if (state.historyFilters.timeframe === 'quarter' && diffDays > 90) return false;
            }

            // Filter by field
            if (state.historyFilters.field && entry.field !== state.historyFilters.field) {
                return false;
            }

            return true;
        });
    }

    /**
     * Groups history entries by date
     * @param {Array} history - History entries
     * @returns {Object} - Grouped history
     */
    function groupHistoryByDate(history) {
        const grouped = {};

        history.forEach(entry => {
            if (!grouped[entry.date]) {
                grouped[entry.date] = [];
            }
            grouped[entry.date].push(entry);
        });

        return grouped;
    }

    /**
     * Formats a date string
     * @param {string} dateString - Date string
     * @returns {string} - Formatted date
     */
    function formatDate(dateString) {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        setGuest: (guestId) => {
            if (guestId) {
                fetchGuestData(guestId);
            } else {
                state.guest = null;
                state.history = [];
                render();
            }
        },

        getGuest: () => state.guest,

        getActiveTab: () => state.activeTab,

        refresh: () => {
            if (state.guest) {
                fetchGuestData(state.guest.id);
            }
        },

        setEditMode: (isEditing) => {
            state.isEditing = isEditing;
            render();
        }
    };
};

module.exports = GuestView;