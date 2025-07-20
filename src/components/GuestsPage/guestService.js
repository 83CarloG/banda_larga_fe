// Enhanced mock data for GuestService.js
"use strict";

const api = require('../../modules/api');

/**
 * Mock data for guests with all the new fields
 */
const MOCK_GUESTS = [
    {
        id: 1,
        guest_code: 'G001',
        centro_ascolto: 'Centro San Giovanni',
        data_operatore: '2025-01-15 - Mario Rossi',
        guest_first_name: 'Mario',
        guest_last_name: 'Rossi',
        guest_birth_date: '1980-01-01',
        guest_birth_place: 'Roma',
        guest_provincia: 'RM',
        guest_sex: 'M',
        guest_fiscal_code: 'RSSMRA80A01H501Z',
        guest_nationality: 'Italiana',
        guest_documento_identita: 'Carta d\'identità',
        guest_numero_documento: 'AS3456789',
        guest_phone_number: '3331234567',
        guest_altro_telefono: '3339876543',
        guest_email: 'mario.rossi@example.com',
        guest_emergency_contact: '3339876543',
        guest_detenzione: false,
        guest_dipendenze: false,
        guest_problemi_familiari: true,
        guest_handicap: false,
        guest_migrazione: false,
        guest_istruzione: false,
        guest_poverta: true,
        guest_salute: false,
        guest_servizi_sociali: true,
        guest_altri_problemi: false,
        guest_note: 'Ha perso il lavoro recentemente.',
        guest_annotazioni: 'La persona è molto collaborativa e disponibile.',
        guest_stato_civile: 'Coniugato/a',
        guest_famiglia_mono: 'No',
        guest_num_componenti: '4',
        guest_num_minori: '2',

        // Situazione Economica
        eco_tipo_reddito: 'Disoccupazione',
        eco_importo_reddito: '580',
        eco_reddito_riferimento: 'Ospite',
        eco_interventi_welfare: ['Reddito di cittadinanza'],
        eco_stato_welfare: 'Attivo',
        eco_disabilita: 'No',
        eco_percentuale_invalidita: '',
        eco_domanda_aggravamento: 'No',
        eco_indennita: 'No',
        eco_annotazioni_salute: '',
        eco_problematiche: [],
        eco_spese_scuola: '100',
        eco_spese_straordinarie: '',
        eco_spese_salute: '50',
        eco_rate_mensili: '200',
        eco_quinto_stipendio: '',
        eco_altre_spese: '',

        // Rete e Relazioni
        rel_familiari: 'Normali',
        rel_annotazioni: 'Buoni rapporti con i figli',
        rel_amicali: 'Buone',
        rel_gruppi: 'No',
        rel_famiglia_origine: 'Buone',
        rel_aiuto_economico: 'Si',
        rel_supporto_quotidiano: 'No',
        rel_servizi_pubblici: [
            { name: 'Servizi sociali comunali', referent: 'Dott.ssa Bianchi', contact: '0987654321' }
        ],
        rel_servizi_privati: [],
        rel_progetti: [],

        // Casa/Abitazione
        casa_problematiche: true,
        casa_sfd: false,
        casa_residenza_comune: 'Roma',
        casa_residenza_cap: '00100',
        casa_residenza_indirizzo: 'Via Roma 123',
        casa_domicilio_comune: 'Roma',
        casa_domicilio_cap: '00100',
        casa_domicilio_indirizzo: 'Via Roma 123',
        casa_vive_in_casa: 'Si',
        casa_situazione: 'Affitto',
        casa_particolari: ['Sovraffollamento'],
        casa_annotazioni: 'Appartamento piccolo per una famiglia di 4 persone',
        casa_affitto: '650',
        casa_spese_cond: '50',
        casa_utenze: '120',

        // Lavoro/Occupazione
        lavoro_titolo_studio: 'Diploma superiore',
        lavoro_attestati: 'Attestato di sicurezza sul lavoro',
        lavoro_patente: 'B',
        lavoro_possesso_auto: true,
        lavoro_conoscenza_pc: false,
        lavoro_conoscenza_lingue: '',
        lavoro_altre_abilita: 'Esperienza nel settore edile',
        lavoro_problemi: true,
        lavoro_occupazione: 'No',
        lavoro_copertura_previdenziale: 'No',
        lavoro_svolto: '',
        lavoro_note: 'Ha perso il lavoro come operaio edile 3 mesi fa. Sta cercando un nuovo impiego.',
        lavoro_ore_settimanali: '',

        // Alimentazione
        alimentazione_vitto: '450',
        alimentazione_spese: '450',
        alimentazione_intolleranze: '',
        alimentazione_tipo: ['Borsa alimentare'],
        alimentazione_note: 'Riceve supporto alimentare una volta al mese',

        active: true,
        created_at: '2025-01-01T09:00:00.000Z',
        updated_at: '2025-01-01T09:00:00.000Z'
    },
    {
        id: 2,
        guest_code: 'G002',
        centro_ascolto: 'Centro Santa Maria',
        data_operatore: '2025-01-20 - Laura Verdi',
        guest_first_name: 'Anna',
        guest_last_name: 'Verdi',
        guest_birth_date: '1985-05-15',
        guest_birth_place: 'Milano',
        guest_provincia: 'MI',
        guest_sex: 'F',
        guest_fiscal_code: 'VRDNNA85E55F205Z',
        guest_nationality: 'Italiana',
        guest_documento_identita: 'Carta d\'identità',
        guest_numero_documento: 'CA8765432',
        guest_phone_number: '3387654321',
        guest_altro_telefono: '',
        guest_email: 'anna.verdi@example.com',
        guest_emergency_contact: '3381122334',
        guest_detenzione: false,
        guest_dipendenze: false,
        guest_problemi_familiari: false,
        guest_handicap: false,
        guest_migrazione: false,
        guest_istruzione: false,
        guest_poverta: true,
        guest_salute: true,
        guest_servizi_sociali: false,
        guest_altri_problemi: false,
        guest_note: 'Allergie alimentari',
        guest_annotazioni: 'Richiede dieta speciale',
        guest_stato_civile: 'Separato/a',
        guest_famiglia_mono: 'Si',
        guest_num_componenti: '2',
        guest_num_minori: '1',

        // Situazione Economica
        eco_tipo_reddito: 'Lavoro dipendente',
        eco_importo_reddito: '1200',
        eco_reddito_riferimento: 'Ospite',
        eco_interventi_welfare: ['Assegno unico'],
        eco_stato_welfare: 'Attivo',
        eco_disabilita: 'Si',
        eco_percentuale_invalidita: '35',
        eco_domanda_aggravamento: 'No',
        eco_indennita: 'No',
        eco_annotazioni_salute: 'Patologia cronica in cura presso ospedale',
        eco_problematiche: ['Problematiche fisiche'],
        eco_spese_scuola: '80',
        eco_spese_straordinarie: '',
        eco_spese_salute: '150',
        eco_rate_mensili: '',
        eco_quinto_stipendio: '',
        eco_altre_spese: '',

        // Rete e Relazioni
        rel_familiari: 'Buone',
        rel_annotazioni: 'Buon rapporto con il figlio',
        rel_amicali: 'Normali',
        rel_gruppi: 'Si',
        rel_famiglia_origine: 'Problematiche',
        rel_aiuto_economico: 'No',
        rel_supporto_quotidiano: 'No',
        rel_servizi_pubblici: [],
        rel_servizi_privati: [
            { name: 'Caritas parrocchiale', referent: 'Don Paolo', contact: '0123456789' }
        ],
        rel_progetti: [],

        // Casa/Abitazione
        casa_problematiche: false,
        casa_sfd: false,
        casa_residenza_comune: 'Milano',
        casa_residenza_cap: '20100',
        casa_residenza_indirizzo: 'Via Milano 456',
        casa_domicilio_comune: 'Milano',
        casa_domicilio_cap: '20100',
        casa_domicilio_indirizzo: 'Via Milano 456',
        casa_vive_in_casa: 'Si',
        casa_situazione: 'Affitto',
        casa_particolari: [],
        casa_annotazioni: '',
        casa_affitto: '750',
        casa_spese_cond: '80',
        casa_utenze: '180',

        // Lavoro/Occupazione
        lavoro_titolo_studio: 'Laurea',
        lavoro_attestati: '',
        lavoro_patente: 'B',
        lavoro_possesso_auto: true,
        lavoro_conoscenza_pc: true,
        lavoro_conoscenza_lingue: 'Inglese (B1)',
        lavoro_altre_abilita: '',
        lavoro_problemi: false,
        lavoro_occupazione: 'Si',
        lavoro_copertura_previdenziale: 'Si',
        lavoro_svolto: 'Impiegata amministrativa',
        lavoro_note: 'Lavoro part-time a tempo indeterminato',
        lavoro_ore_settimanali: '21-30',

        // Alimentazione
        alimentazione_vitto: '400',
        alimentazione_spese: '400',
        alimentazione_intolleranze: 'Lattosio, glutine',
        alimentazione_tipo: ['Autonomo'],
        alimentazione_note: 'Necessità di dieta speciale per intolleranze',

        active: true,
        created_at: '2025-01-15T10:30:00.000Z',
        updated_at: '2025-02-01T14:45:00.000Z'
    },
    {
        id: 3,
        guest_code: 'G003',
        centro_ascolto: 'Centro San Giuseppe',
        data_operatore: '2025-02-05 - Paolo Bianchi',
        guest_first_name: 'Ahmed',
        guest_last_name: 'Khan',
        guest_birth_date: '1975-08-22',
        guest_birth_place: 'Cairo',
        guest_provincia: 'Estero',
        guest_sex: 'M',
        guest_fiscal_code: 'KHNHMD75M22Z336Y',
        guest_nationality: 'Egiziana',
        guest_documento_identita: 'Permesso di soggiorno',
        guest_numero_documento: 'PS12345678',
        guest_phone_number: '3335556677',
        guest_altro_telefono: '',
        guest_email: 'ahmed.khan@example.com',
        guest_emergency_contact: '3332211000',
        guest_detenzione: false,
        guest_dipendenze: false,
        guest_problemi_familiari: false,
        guest_handicap: false,
        guest_migrazione: true,
        guest_istruzione: false,
        guest_poverta: true,
        guest_salute: false,
        guest_servizi_sociali: false,
        guest_altri_problemi: false,
        guest_note: 'Parla italiano, inglese e arabo',
        guest_annotazioni: 'Permesso di soggiorno in scadenza tra 6 mesi',
        guest_stato_civile: 'Coniugato/a',
        guest_famiglia_mono: 'No',
        guest_num_componenti: '1',
        guest_num_minori: '0',

        // Situazione Economica
        eco_tipo_reddito: 'Lavoro autonomo',
        eco_importo_reddito: '800',
        eco_reddito_riferimento: 'Ospite',
        eco_interventi_welfare: [],
        eco_stato_welfare: '',
        eco_disabilita: 'No',
        eco_percentuale_invalidita: '',
        eco_domanda_aggravamento: 'No',
        eco_indennita: 'No',
        eco_annotazioni_salute: '',
        eco_problematiche: [],
        eco_spese_scuola: '',
        eco_spese_straordinarie: '',
        eco_spese_salute: '80',
        eco_rate_mensili: '',
        eco_quinto_stipendio: '',
        eco_altre_spese: '',

        // Rete e Relazioni
        rel_familiari: 'Assenti',
        rel_annotazioni: 'Famiglia d\'origine vive in Egitto',
        rel_amicali: 'Normali',
        rel_gruppi: 'No',
        rel_famiglia_origine: 'Normali',
        rel_aiuto_economico: 'No',
        rel_supporto_quotidiano: 'No',
        rel_servizi_pubblici: [],
        rel_servizi_privati: [],
        rel_progetti: [
            { name: 'Progetto integrazione lavoro', referent: 'Dott. Neri', contact: '0112233445' }
        ],

        // Casa/Abitazione
        casa_problematiche: true,
        casa_sfd: false,
        casa_residenza_comune: 'Napoli',
        casa_residenza_cap: '80100',
        casa_residenza_indirizzo: 'Via Napoli 789',
        casa_domicilio_comune: 'Napoli',
        casa_domicilio_cap: '80100',
        casa_domicilio_indirizzo: 'Via Napoli 789',
        casa_vive_in_casa: 'Si',
        casa_situazione: 'Ospite',
        casa_particolari: ['Sovraffollamento'],
        casa_annotazioni: 'Condivide appartamento con altri 5 connazionali',
        casa_affitto: '200',
        casa_spese_cond: '40',
        casa_utenze: '60',

        // Lavoro/Occupazione
        lavoro_titolo_studio: 'Diploma nel paese d\'origine',
        lavoro_attestati: '',
        lavoro_patente: '',
        lavoro_possesso_auto: false,
        lavoro_conoscenza_pc: false,
        lavoro_conoscenza_lingue: 'Arabo (madrelingua), Italiano (B1), Inglese (B2)',
        lavoro_altre_abilita: 'Esperienza ristorazione',
        lavoro_problemi: true,
        lavoro_occupazione: 'Si',
        lavoro_copertura_previdenziale: 'No',
        lavoro_svolto: 'Aiuto cuoco (occasionale)',
        lavoro_note: 'In cerca di lavoro stabile nel settore ristorazione',
        lavoro_ore_settimanali: '0-10',

        // Alimentazione
        alimentazione_vitto: '250',
        alimentazione_spese: '250',
        alimentazione_intolleranze: '',
        alimentazione_tipo: ['Mensa', 'Autonomo'],
        alimentazione_note: '',

        active: true,
        created_at: '2025-02-10T08:15:00.000Z',
        updated_at: '2025-03-05T11:20:00.000Z'
    },
    {
        id: 4,
        guest_code: 'G004',
        centro_ascolto: 'Centro Sant\'Antonio',
        data_operatore: '2025-01-10 - Giuseppe Verdi',
        guest_first_name: 'Sofia',
        guest_last_name: 'Bianchi',
        guest_birth_date: '1990-11-30',
        guest_birth_place: 'Torino',
        guest_provincia: 'TO',
        guest_sex: 'F',
        guest_fiscal_code: 'BNCSFO90S70L219Z',
        guest_nationality: 'Italiana',
        guest_documento_identita: 'Carta d\'identità',
        guest_numero_documento: 'CA1122334',
        guest_phone_number: '3399887766',
        guest_altro_telefono: '',
        guest_email: 'sofia.bianchi@example.com',
        guest_emergency_contact: '3399887755',
        guest_detenzione: false,
        guest_dipendenze: false,
        guest_problemi_familiari: true,
        guest_handicap: false,
        guest_migrazione: false,
        guest_istruzione: true,
        guest_poverta: true,
        guest_salute: false,
        guest_servizi_sociali: true,
        guest_altri_problemi: false,
        guest_note: 'Laurea in scienze dell\'educazione',
        guest_annotazioni: 'Si è trasferita recentemente in cerca di lavoro',
        guest_stato_civile: 'Celibe/Nubile',
        guest_famiglia_mono: 'Si',
        guest_num_componenti: '1',
        guest_num_minori: '0',

        // Situazione Economica
        eco_tipo_reddito: 'Nessuno',
        eco_importo_reddito: '',
        eco_reddito_riferimento: '',
        eco_interventi_welfare: [],
        eco_stato_welfare: '',
        eco_disabilita: 'No',
        eco_percentuale_invalidita: '',
        eco_domanda_aggravamento: 'No',
        eco_indennita: 'No',
        eco_annotazioni_salute: '',
        eco_problematiche: [],
        eco_spese_scuola: '',
        eco_spese_straordinarie: '',
        eco_spese_salute: '30',
        eco_rate_mensili: '',
        eco_quinto_stipendio: '',
        eco_altre_spese: '',

        // Rete e Relazioni
        rel_familiari: 'Assenti',
        rel_annotazioni: 'Vive da sola',
        rel_amicali: 'Normali',
        rel_gruppi: 'No',
        rel_famiglia_origine: 'Buone',
        rel_aiuto_economico: 'Si',
        rel_supporto_quotidiano: 'No',
        rel_servizi_pubblici: [
            { name: 'Servizi sociali', referent: 'Dott.ssa Neri', contact: '0556677889' }
        ],
        rel_servizi_privati: [],
        rel_progetti: [],

        // Casa/Abitazione
        casa_problematiche: true,
        casa_sfd: false,
        casa_residenza_comune: 'Torino',
        casa_residenza_cap: '10100',
        casa_residenza_indirizzo: 'Via Torino 321',
        casa_domicilio_comune: 'Torino',
        casa_domicilio_cap: '10100',
        casa_domicilio_indirizzo: 'Via Torino 321',
        casa_vive_in_casa: 'Si',
        casa_situazione: 'Ospite',
        casa_particolari: [],
        casa_annotazioni: 'In cerca di soluzione abitativa più stabile',
        casa_affitto: '',
        casa_spese_cond: '',
        casa_utenze: '90',

        // Lavoro/Occupazione
        lavoro_titolo_studio: 'Laurea in Scienze dell\'Educazione',
        lavoro_attestati: '',
        lavoro_patente: 'B',
        lavoro_possesso_auto: false,
        lavoro_conoscenza_pc: true,
        lavoro_conoscenza_lingue: 'Inglese (B2), Francese (A2)',
        lavoro_altre_abilita: 'Esperienza come educatrice',
        lavoro_problemi: true,
        lavoro_occupazione: 'No',
        lavoro_copertura_previdenziale: 'No',
        lavoro_svolto: '',
        lavoro_note: 'In cerca di lavoro come educatrice',
        lavoro_ore_settimanali: '',

        // Alimentazione
        alimentazione_vitto: '200',
        alimentazione_spese: '200',
        alimentazione_intolleranze: '',
        alimentazione_tipo: ['Borsa alimentare'],
        alimentazione_note: '',

        active: false,
        created_at: '2025-01-20T13:45:00.000Z',
        updated_at: '2025-03-10T09:30:00.000Z'
    }
];

/**
 * Enhanced mock change history for guests
 */
const MOCK_HISTORY = {
    1: [
        {
            id: 1,
            date: '2025-01-01',
            time: '09:00',
            operator: 'Mario Rossi',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 2,
            date: '2025-02-15',
            time: '10:15',
            operator: 'Operatore2',
            category: 'casa',
            field: 'Indirizzo domicilio',
            oldValue: 'Via Roma 100, Roma',
            newValue: 'Via Roma 123, 00100, Roma',
            type: 'modified'
        },
        {
            id: 3,
            date: '2025-03-01',
            time: '14:30',
            operator: 'Laura Bianchi',
            category: 'economica',
            field: 'Importo reddito',
            oldValue: '800',
            newValue: '580',
            type: 'modified'
        },
        {
            id: 4,
            date: '2025-03-01',
            time: '14:35',
            operator: 'Laura Bianchi',
            category: 'lavoro',
            field: 'Occupazione',
            oldValue: 'Si',
            newValue: 'No',
            type: 'modified'
        },
        {
            id: 5,
            date: '2025-03-01',
            time: '14:40',
            operator: 'Laura Bianchi',
            category: 'lavoro',
            field: 'Note lavoro',
            oldValue: 'Occupato come operaio edile',
            newValue: 'Ha perso il lavoro come operaio edile 3 mesi fa. Sta cercando un nuovo impiego.',
            type: 'modified'
        }
    ],
    2: [
        {
            id: 6,
            date: '2025-01-15',
            time: '10:30',
            operator: 'Laura Verdi',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 7,
            date: '2025-02-01',
            time: '14:45',
            operator: 'Mario Rossi',
            category: 'alimentazione',
            field: 'Note alimentazione',
            oldValue: null,
            newValue: 'Necessità di dieta speciale per intolleranze',
            type: 'added'
        },
        {
            id: 8,
            date: '2025-02-01',
            time: '14:50',
            operator: 'Mario Rossi',
            category: 'alimentazione',
            field: 'Intolleranze',
            oldValue: null,
            newValue: 'Lattosio, glutine',
            type: 'added'
        },
        {
            id: 9,
            date: '2025-02-15',
            time: '09:30',
            operator: 'Laura Verdi',
            category: 'economica',
            field: 'Disabilità documentata',
            oldValue: 'No',
            newValue: 'Si',
            type: 'modified'
        },
        {
            id: 10,
            date: '2025-02-15',
            time: '09:35',
            operator: 'Laura Verdi',
            category: 'economica',
            field: '% invalidità',
            oldValue: null,
            newValue: '35',
            type: 'added'
        }
    ],
    3: [
        {
            id: 11,
            date: '2025-02-10',
            time: '08:15',
            operator: 'Paolo Bianchi',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 12,
            date: '2025-03-05',
            time: '11:20',
            operator: 'Maria Verdi',
            category: 'lavoro',
            field: 'Note lavoro',
            oldValue: null,
            newValue: 'In cerca di lavoro nel settore ristorazione',
            type: 'added'
        },
        {
            id: 13,
            date: '2025-03-05',
            time: '11:25',
            operator: 'Maria Verdi',
            category: 'casa',
            field: 'Annotazioni alloggiative',
            oldValue: null,
            newValue: 'Condivide appartamento con altri 5 connazionali',
            type: 'added'
        },
        {
            id: 14,
            date: '2025-03-10',
            time: '15:45',
            operator: 'Paolo Bianchi',
            category: 'relazioni',
            field: 'Progetti di accompagnamento',
            oldValue: null,
            newValue: 'Progetto integrazione lavoro',
            type: 'added'
        }
    ],
    4: [
        {
            id: 15,
            date: '2025-01-20',
            time: '13:45',
            operator: 'Giuseppe Verdi',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 16,
            date: '2025-02-20',
            time: '10:30',
            operator: 'Luigi Rossi',
            category: 'casa',
            field: 'Situazione attuale',
            oldValue: 'Affitto',
            newValue: 'Ospite',
            type: 'modified'
        },
        {
            id: 17,
            date: '2025-03-10',
            time: '09:30',
            operator: 'Giuseppe Verdi',
            category: 'anagrafica',
            field: 'Stato attivo',
            oldValue: 'Attivo',
            newValue: 'Non attivo',
            type: 'modified'
        },
        {
            id: 18,
            date: '2025-03-10',
            time: '09:35',
            operator: 'Giuseppe Verdi',
            category: 'casa',
            field: 'Annotazioni alloggiative',
            oldValue: 'In cerca di alloggio',
            newValue: 'In cerca di soluzione abitativa più stabile',
            type: 'modified'
        }
    ]
};


/**
 * Guest service for handling API calls
 */
const guestService = {
    /**
     * Fetch all guests
     * @returns {Promise<Array<Guest>>}
     */
    async fetchGuests() {
        try {
            // Call the real API
            const response = await api.getGuests();
            // The API returns { status, data: { guests: [...] } }
            if (response.status === 'success' && response.data && Array.isArray(response.data.guests)) {
                // Map API fields to internal fields expected by the UI
                return response.data.guests.map(g => ({
                    id: g.id,
                    guest_code: g.code,
                    guest_first_name: g.first_name,
                    guest_last_name: g.last_name,
                    guest_fiscal_code: g.fiscal_code,
                    guest_phone_number: g.guest_phone_number,
                    casa_residenza_indirizzo: g.residence_address,
                    casa_residenza_comune: g.residence_city,
                    casa_residenza_cap: g.residence_postal_code,
                    active: g.status === 'active',
                }));
            } else {
                throw new Error('Errore nel recupero degli ospiti');
            }
        } catch (error) {
            console.error('Error fetching guests:', error);
            throw error;
        }
    },

    /**
     * Search for guest by ID or fiscal code
     * @param {string} searchTerm - Search term (ID or fiscal code)
     * @returns {Promise<Array<Guest>>}
     */
    async searchGuest(searchTerm) {
        try {
            // In production, uncomment the API call
            // const response = await api.searchGuest(searchTerm);
            // return response.data.guests;

            // Mock implementation
            const results = MOCK_GUESTS.filter(guest =>
                guest.id.toString() === searchTerm ||
                guest.guest_code === searchTerm ||
                guest.guest_fiscal_code.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return Promise.resolve(results);
        } catch (error) {
            console.error('Error searching for guest:', error);
            throw error;
        }
    },

    /**
     * Get guest details by ID
     * @param {number} guestId - Guest ID
     * @returns {Promise<Object>} - Guest data
     */
    async getGuest(guestId) {
        try {
            // In production, uncomment the API call
            // const response = await api.getGuest(guestId);
            // return response.data;

            // Mock implementation
            const guest = MOCK_GUESTS.find(g => g.id === guestId);

            if (!guest) {
                throw new Error('Guest not found');
            }

            return Promise.resolve({
                guest: guest
            });
        } catch (error) {
            console.error('Error fetching guest:', error);
            throw error;
        }
    },

    /**
     * Get guest history
     * @param {number} guestId - Guest ID
     * @returns {Promise<Array>} - Guest history
     */
    async getGuestHistory(guestId) {
        try {
            // In production, uncomment the API call
            // const response = await api.getGuestHistory(guestId);
            // return response.data.history;

            // Mock implementation
            const history = MOCK_HISTORY[guestId] || [];

            return Promise.resolve(history);
        } catch (error) {
            console.error('Error fetching guest history:', error);
            throw error;
        }
    },

    /**
     * Create new guest
     * @param {Object} guestData - Guest data
     * @returns {Promise<Guest>}
     */
    async createGuest(guestData) {
        try {
            // In production, uncomment the API call
            // const response = await api.createGuest(guestData);
            // return response.data.guest;

            // Mock implementation
            const newId = Math.max(...MOCK_GUESTS.map(g => g.id)) + 1;
            const now = new Date().toISOString();

            const newGuest = {
                id: newId,
                ...guestData,
                active: true,
                created_at: now,
                updated_at: now
            };

            // Add to mock data (in real app this would be done by the API)
            MOCK_GUESTS.push(newGuest);

            // Create initial history entry
            if (!MOCK_HISTORY[newId]) {
                MOCK_HISTORY[newId] = [];
            }

            MOCK_HISTORY[newId].push({
                id: Math.floor(Math.random() * 10000),
                date: now.split('T')[0],
                time: now.split('T')[1].substring(0, 5),
                operator: 'Current User',
                category: 'anagrafica',
                field: 'Creazione scheda',
                oldValue: null,
                newValue: 'Dati anagrafici base',
                type: 'creation'
            });

            return Promise.resolve(newGuest);
        } catch (error) {
            console.error('Error creating guest:', error);
            throw error;
        }
    },

    /**
     * Update existing guest
     * @param {number} guestId - Guest ID
     * @param {Object} guestData - Guest data
     * @returns {Promise<Guest>}
     */
    async updateGuest(guestId, guestData) {
        try {
            // In production, uncomment the API call
            // const response = await api.updateGuest(guestId, guestData);
            // return response.data.guest;

            // Mock implementation
            const guestIndex = MOCK_GUESTS.findIndex(g => g.id === guestId);

            if (guestIndex === -1) {
                throw new Error('Guest not found');
            }

            const oldGuest = MOCK_GUESTS[guestIndex];
            const now = new Date().toISOString();

            // Update guest
            const updatedGuest = {
                ...oldGuest,
                ...guestData,
                updated_at: now
            };

            MOCK_GUESTS[guestIndex] = updatedGuest;

            // Create history entries for changes
            if (!MOCK_HISTORY[guestId]) {
                MOCK_HISTORY[guestId] = [];
            }

            // Find which fields changed and create history entries
            Object.keys(guestData).forEach(key => {
                if (oldGuest[key] !== guestData[key]) {
                    const fieldLabel = key.replace('guest_', '').split('_').map(
                        word => word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');

                    const category = getCategoryForField(key);

                    MOCK_HISTORY[guestId].push({
                        id: Math.floor(Math.random() * 10000),
                        date: now.split('T')[0],
                        time: now.split('T')[1].substring(0, 5),
                        operator: 'Current User',
                        category: category,
                        field: fieldLabel,
                        oldValue: oldGuest[key],
                        newValue: guestData[key],
                        type: oldGuest[key] === null || oldGuest[key] === '' ? 'added' : 'modified'
                    });
                }
            });

            return Promise.resolve(updatedGuest);
        } catch (error) {
            console.error('Error updating guest:', error);
            throw error;
        }
    },

    /**
     * Delete guest
     * @param {number} guestId - Guest ID
     * @returns {Promise<void>}
     */
    async deleteGuest(guestId) {
        try {
            // In production, uncomment the API call
            // await api.deleteGuest(guestId);

            // Mock implementation
            const guestIndex = MOCK_GUESTS.findIndex(g => g.id === guestId);

            if (guestIndex === -1) {
                throw new Error('Guest not found');
            }

            // Remove from mock data
            MOCK_GUESTS.splice(guestIndex, 1);

            return Promise.resolve();
        } catch (error) {
            console.error('Error deleting guest:', error);
            throw error;
        }
    }
};

/**
 * Helper function to determine category for a field
 * @param {string} fieldName - Field name
 * @returns {string} - Category name
 */
function getCategoryForField(fieldName) {
    const anagraficaFields = ['first_name', 'last_name', 'birth_date', 'birth_place', 'sex', 'fiscal_code', 'nationality', 'phone_number', 'email'];
    const casaFields = ['address'];
    const lavoroFields = ['additional_info'];
    const alimentazioneFields = ['note'];

    const simplifiedField = fieldName.replace('guest_', '');

    if (anagraficaFields.some(field => simplifiedField.includes(field))) {
        return 'anagrafica';
    } else if (casaFields.some(field => simplifiedField.includes(field))) {
        return 'casa';
    } else if (lavoroFields.some(field => simplifiedField.includes(field))) {
        return 'lavoro';
    } else if (alimentazioneFields.some(field => simplifiedField.includes(field))) {
        return 'alimentazione';
    }

    return 'anagrafica'; // Default category
}

module.exports = guestService;