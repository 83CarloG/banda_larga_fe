// guestView.js - Updated with 70/30 split and improved tab layout
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

    // Category definitions with filled black icons
    const categories = {
        anagrafica: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
            title: 'Anagrafica'
        },
        casa: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
            title: 'Casa/Abitazione'
        },
        lavoro: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>',
            title: 'Lavoro/Occupazione'
        },
        alimentazione: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
            title: 'Alimentazione'
        },
        economica: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
            title: 'Situazione Economica'
        },
        relazioni: {
            icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
            title: 'Rete e Relazioni'
        }
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
                    <svg class="icon" viewBox="0 0 24 24" fill="black">
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
                    <svg class="icon" viewBox="0 0 24 24" fill="black">
                        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                    </svg>
                    Go Back
                </button>
            `;

            // Add event listener
            container.querySelector('#back-btn').addEventListener('click', onBack);

            return;
        }

        // Full guest view with 70/30 split layout
        renderSplitView();
    }

    /**
     * Renders the split view with guest details and history
     */
    function renderSplitView() {
        // Set up the layout with header
        container.innerHTML = `
            <div class="guest-header">
                <div class="guest-info">
                    <h2>${state.guest.guest_first_name} ${state.guest.guest_last_name}</h2>
                    <div class="guest-meta">
                        <span>ID: ${state.guest.guest_code || state.guest.id}</span>
                        <span>CF: ${state.guest.guest_fiscal_code || 'N/A'}</span>
                    </div>
                </div>
                <div class="guest-actions">
                    <button id="edit-guest-btn" class="primary-btn">
                        <svg class="icon" viewBox="0 0 24 24" fill="white">
                            <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"/>
                        </svg>
                        Edit Guest
                    </button>
                </div>
            </div>
            
            <!-- 70/30 split view layout -->
            <div class="guest-split-view">
                <!-- Left panel for guest details (70%) -->
                <div class="guest-left-panel">
                    <!-- Tabs that span across data section only -->
                    <div class="guest-tabs">
                        ${Object.entries(categories).map(([key, cat]) => `
                            <button id="tab-${key}" class="tab-button ${state.activeTab === key ? 'active' : ''}">
                                <span class="tab-icon">${cat.icon}</span>
                                <span class="tab-text">${cat.title}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="tab-content" class="tab-content"></div>
                </div>
                
                <!-- Right panel for history (30%) -->
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
                                        ${cat.title}
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
            
            <!-- Custom styling for 70/30 split -->
            <style>
                .guest-split-view {
                    display: flex;
                    height: calc(100vh - 12rem);
                    min-height: 500px;
                }
                
                .guest-left-panel {
                    width: 70%;
                    overflow-y: auto;
                    border-right: 1px solid var(--border-color);
                }
                
                .guest-right-panel {
                    width: 30%;
                    overflow-y: auto;
                    background-color: var(--background-light);
                    display: flex;
                    flex-direction: column;
                }
                
                .tab-button {
                    padding: 0.875rem 1rem;
                    background: none;
                    border: none;
                    font-weight: 500;
                    color: #4b5563;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap;
                    border-bottom: 3px solid transparent;
                }
                
                .tab-button.active {
                    color: black;
                    border-bottom-color: black;
                    background-color: white;
                    font-weight: 600;
                }
                
                .tab-button:hover:not(.active) {
                    background-color: rgba(0, 0, 0, 0.03);
                }
                
                @media (max-width: 768px) {
                    .guest-split-view {
                        flex-direction: column;
                        height: auto;
                    }
                    
                    .guest-left-panel, .guest-right-panel {
                        width: 100%;
                        height: auto;
                        max-height: none;
                    }
                    
                    .guest-left-panel {
                        min-height: 60vh;
                    }
                    
                    .guest-right-panel {
                        min-height: 40vh;
                    }
                }
            </style>
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
     * Renders the Anagrafica tab content with all fields
     * @param {HTMLElement} container - Tab content container
     */
    function renderAnagraficaTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Anagrafica</h3>
            
            <div class="field-row">
                <div class="field-label">Centro di Ascolto</div>
                <div class="field-value">${guest.centro_ascolto || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Data e Operatore</div>
                <div class="field-value">${guest.data_operatore || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Nominativo</div>
                <div class="field-value">${guest.guest_first_name} ${guest.guest_last_name}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Codice Fiscale</div>
                <div class="field-value">${guest.guest_fiscal_code || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Genere</div>
                <div class="field-value">${guest.guest_sex === 'M' ? 'Maschile' : 'Femminile'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Data di nascita</div>
                <div class="field-value">${formatDate(guest.guest_birth_date) || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Luogo di nascita</div>
                <div class="field-value">${guest.guest_birth_place || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Provincia</div>
                <div class="field-value">${guest.guest_provincia || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Nazionalità</div>
                <div class="field-value">${guest.guest_nationality || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Documento Identità</div>
                <div class="field-value">${guest.guest_documento_identita || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Numero documento</div>
                <div class="field-value">${guest.guest_numero_documento || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Telefono</div>
                <div class="field-value">${guest.guest_phone_number || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Altro telefono</div>
                <div class="field-value">${guest.guest_altro_telefono || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Email</div>
                <div class="field-value">${guest.guest_email || 'Non specificato'}</div>
            </div>

            <div class="field-row">
                <div class="field-label">Contatto di emergenza</div>
                <div class="field-value">${guest.guest_emergency_contact || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Stato civile</div>
                <div class="field-value">${guest.guest_stato_civile || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Famiglia monocomponente</div>
                <div class="field-value">${guest.guest_famiglia_mono || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Numero componenti</div>
                <div class="field-value">${guest.guest_num_componenti || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">di cui numero minori</div>
                <div class="field-value">${guest.guest_num_minori || 'Non specificato'}</div>
            </div>
            
            <h4 class="sub-title" style="margin-top: 1rem; font-weight: 600;">Problematiche</h4>
            
            <div class="field-row">
                <div class="field-label">Detenzione e giustizia</div>
                <div class="field-value">${guest.guest_detenzione ? 'Sì' : 'No'}</div>
            </div>
             <div class="field-row">
                <div class="field-label">Dipendenze</div>
                <div class="field-value">${guest.guest_dipendenze ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Problemi familiari</div>
                <div class="field-value">${guest.guest_problemi_familiari ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Handicap/Disabilità</div>
                <div class="field-value">${guest.guest_handicap ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Bisogni di migrazione/immigrazione</div>
                <div class="field-value">${guest.guest_migrazione ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Problemi di istruzione</div>
                <div class="field-value">${guest.guest_istruzione ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Povertà/problemi economici</div>
                <div class="field-value">${guest.guest_poverta ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Problemi di salute</div>
                <div class="field-value">${guest.guest_salute ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Presa in carico ai servizi sociali</div>
                <div class="field-value">${guest.guest_servizi_sociali ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Altri problemi</div>
                <div class="field-value">${guest.guest_altri_problemi ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Note</div>
                <div class="field-value">${guest.guest_note || 'Nessuna nota'}</div>
            </div>
            
            <div class="field-row note-row">
                <div class="field-label">Annotazioni di carattere generale</div>
                <div class="field-value note-value">${guest.guest_annotazioni || 'Nessuna annotazione'}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Renders the Situazione Economica tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderEconomicaTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Situazione Economica e Salute</h3>
            
            <div class="field-row">
                <div class="field-label">Tipologia di reddito</div>
                <div class="field-value">${guest.eco_tipo_reddito || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Importo reddito €</div>
                <div class="field-value">${guest.eco_importo_reddito || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">A chi si riferisce il reddito</div>
                <div class="field-value">${guest.eco_reddito_riferimento || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Interventi di welfare</div>
                <div class="field-value">${Array.isArray(guest.eco_interventi_welfare) && guest.eco_interventi_welfare.length > 0 ?
            guest.eco_interventi_welfare.join(', ') : 'Nessuno'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Stato interventi welfare</div>
                <div class="field-value">${guest.eco_stato_welfare || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Disabilità documentata titolare</div>
                <div class="field-value">${guest.eco_disabilita || 'No'}</div>
            </div>
            
            ${guest.eco_disabilita === 'Si' ? `
                <div class="field-row">
                    <div class="field-label">% invalidità</div>
                    <div class="field-value">${guest.eco_percentuale_invalidita || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">Domanda di aggravamento</div>
                    <div class="field-value">${guest.eco_domanda_aggravamento || 'No'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">Indennità di accompagnamento</div>
                    <div class="field-value">${guest.eco_indennita || 'No'}</div>
                </div>
            ` : ''}
            
            <div class="field-row">
                <div class="field-label">Ulteriori annotazioni salute</div>
                <div class="field-value">${guest.eco_annotazioni_salute || 'Nessuna annotazione'}</div>
            </div>
            
            <h4 class="sub-title" style="margin-top: 1rem; font-weight: 600;">Problematiche specifiche e documentate</h4>
            
            <div class="field-row">
                <div class="field-label">Problematiche</div>
                <div class="field-value">${Array.isArray(guest.eco_problematiche) && guest.eco_problematiche.length > 0 ?
            guest.eco_problematiche.join(', ') : 'Nessuna'}</div>
            </div>
            
            <h4 class="sub-title" style="margin-top: 1rem; font-weight: 600;">Voci di spesa</h4>
            
            <div class="field-row">
                <div class="field-label">Scuola</div>
                <div class="field-value">${guest.eco_spese_scuola || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Spese straordinarie</div>
                <div class="field-value">${guest.eco_spese_straordinarie || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Spese riguardanti la salute</div>
                <div class="field-value">${guest.eco_spese_salute || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Rate mensili</div>
                <div class="field-value">${guest.eco_rate_mensili || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Quinto dello stipendio</div>
                <div class="field-value">${guest.eco_quinto_stipendio || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Altre spese</div>
                <div class="field-value">${guest.eco_altre_spese || 'Non specificato'}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Renders the Relazioni tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderRelazioniTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Rete e Relazioni</h3>
            
            <div class="field-row">
                <div class="field-label">Relazioni tra i familiari conviventi</div>
                <div class="field-value">${guest.rel_familiari || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Annotazioni relazioni</div>
                <div class="field-value">${guest.rel_annotazioni || 'Nessuna annotazione'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Relazioni amicali</div>
                <div class="field-value">${guest.rel_amicali || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">In famiglia si frequentano gruppi di socializzazione</div>
                <div class="field-value">${guest.rel_gruppi || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Relazioni con la famiglia di origine</div>
                <div class="field-value">${guest.rel_famiglia_origine || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">La famiglia di origine interviene economicamente in aiuto?</div>
                <div class="field-value">${guest.rel_aiuto_economico || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">La famiglia di origine dà supporto nella vita quotidiana?</div>
                <div class="field-value">${guest.rel_supporto_quotidiano || 'No'}</div>
            </div>
            
            <h4 class="sub-title" style="margin-top: 1rem; font-weight: 600;">Reti di servizi</h4>
            
            <div class="field-row">
                <div class="field-label">Servizi pubblici</div>
                <div class="field-value">${renderServiceArray(guest.rel_servizi_pubblici)}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Servizi privato sociale</div>
                <div class="field-value">${renderServiceArray(guest.rel_servizi_privati)}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Progetti di accompagnamento</div>
                <div class="field-value">${renderServiceArray(guest.rel_progetti)}</div>
            </div>
        `;

        container.appendChild(content);
    }

    /**
     * Render service array as formatted HTML
     * @param {Array} services - Array of service objects
     * @returns {string} - HTML string
     */
    function renderServiceArray(services) {
        if (!Array.isArray(services) || services.length === 0) {
            return 'Nessun servizio';
        }

        return `
            <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left;">Nome</th>
                        <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left;">Referente</th>
                        <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left;">Contatto</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(service => `
                        <tr>
                            <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">${service.name || ''}</td>
                            <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">${service.referent || ''}</td>
                            <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">${service.contact || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    /**
     * Renders the Casa tab content
     * @param {HTMLElement} container - Tab content container
     */
    function renderCasaTab(container) {
        const guest = state.guest;

        const content = document.createElement('div');
        content.className = 'tab-section';

        content.innerHTML = `
            <h3 class="tab-title">Casa/Abitazione</h3>
            
            <div class="field-row">
                <div class="field-label">Problematiche abitative</div>
                <div class="field-value">${guest.casa_problematiche ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Senza Fissa Dimora</div>
                <div class="field-value">${guest.casa_sfd ? 'Sì' : 'No'}</div>
            </div>
            
            ${!guest.casa_sfd ? `
                <div class="field-row">
                    <div class="field-label">RESIDENZA Comune</div>
                    <div class="field-value">${guest.casa_residenza_comune || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">CAP urbano residenza</div>
                    <div class="field-value">${guest.casa_residenza_cap || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">Indirizzo residenza</div>
                    <div class="field-value">${guest.casa_residenza_indirizzo || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">DOMICILIO Comune</div>
                    <div class="field-value">${guest.casa_domicilio_comune || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">CAP urbano domicilio</div>
                    <div class="field-value">${guest.casa_domicilio_cap || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">Indirizzo domicilio</div>
                    <div class="field-value">${guest.casa_domicilio_indirizzo || 'Non specificato'}</div>
                </div>
            ` : ''}
            
            <div class="field-row">
                <div class="field-label">Vive in casa</div>
                <div class="field-value">${guest.casa_vive_in_casa || 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Situazione attuale alloggiativa</div>
                <div class="field-value">${guest.casa_situazione || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Altri particolari abitazione</div>
                <div class="field-value">${Array.isArray(guest.casa_particolari) && guest.casa_particolari.length > 0 ?
            guest.casa_particolari.join(', ') : 'Nessuno'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Annotazioni alloggiative</div>
                <div class="field-value">${guest.casa_annotazioni || 'Nessuna annotazione'}</div>
            </div>
            
            <h4 class="sub-title" style="margin-top: 1rem; font-weight: 600;">Spese abitative</h4>
            
            <div class="field-row">
                <div class="field-label">Affitto/Mutuo</div>
                <div class="field-value">${guest.casa_affitto || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Spese condominiali</div>
                <div class="field-value">${guest.casa_spese_cond || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Utenze (luce, gas, cell, TV, rifiuti, acqua)</div>
                <div class="field-value">${guest.casa_utenze || 'Non specificato'}</div>
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
                <div class="field-label">Titolo di studio</div>
                <div class="field-value">${guest.lavoro_titolo_studio || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Attestati di formazione</div>
                <div class="field-value">${guest.lavoro_attestati || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Patente di guida</div>
                <div class="field-value">${guest.lavoro_patente || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Possesso auto</div>
                <div class="field-value">${guest.lavoro_possesso_auto ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Conoscenza base PC e Office</div>
                <div class="field-value">${guest.lavoro_conoscenza_pc ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Conoscenza lingue</div>
                <div class="field-value">${guest.lavoro_conoscenza_lingue || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Altre abilità</div>
                <div class="field-value">${guest.lavoro_altre_abilita || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Problemi di occupazione/lavoro</div>
                <div class="field-value">${guest.lavoro_problemi ? 'Sì' : 'No'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Occupazione</div>
                <div class="field-value">${guest.lavoro_occupazione || 'No'}</div>
            </div>
            
            ${guest.lavoro_occupazione === 'Si' ? `
                <div class="field-row">
                    <div class="field-label">Lavoro svolto attualmente</div>
                    <div class="field-value">${guest.lavoro_svolto || 'Non specificato'}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">Ore lavoro settimanali</div>
                    <div class="field-value">${guest.lavoro_ore_settimanali || 'Non specificato'}</div>
                </div>
            ` : ''}
            
            <div class="field-row">
                <div class="field-label">Copertura previdenziale</div>
                <div class="field-value">${guest.lavoro_copertura_previdenziale || 'No'}</div>
            </div>
            
            <div class="field-row note-row">
                <div class="field-label">Note lavoro</div>
                <div class="field-value note-value">${guest.lavoro_note || 'Nessuna nota'}</div>
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
                <div class="field-label">Vitto</div>
                <div class="field-value">${guest.alimentazione_vitto || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Spese alimentari</div>
                <div class="field-value">${guest.alimentazione_spese || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Intolleranze</div>
                <div class="field-value">${guest.alimentazione_intolleranze || 'Non specificato'}</div>
            </div>
            
            <div class="field-row">
                <div class="field-label">Tipo alimentazione</div>
                <div class="field-value">${Array.isArray(guest.alimentazione_tipo) && guest.alimentazione_tipo.length > 0 ?
            guest.alimentazione_tipo.join(', ') : 'Non specificato'}</div>
            </div>
            
            <div class="field-row note-row">
                <div class="field-label">Note Alimentazione</div>
                <div class="field-value note-value">${guest.alimentazione_note || 'Nessuna nota'}</div>
            </div>
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