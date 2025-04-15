"use strict";

const api = require('../../modules/api');

/**
 * Mock data for guests
 */
const MOCK_GUESTS = [
    {
        id: 1,
        guest_code: 'G001',
        guest_first_name: 'Mario',
        guest_last_name: 'Rossi',
        guest_birth_date: '1980-01-01',
        guest_birth_place: 'Roma',
        guest_sex: 'M',
        guest_fiscal_code: 'RSSMRA80A01H501Z',
        guest_address: 'Via Roma 123, 00100, Roma',
        guest_nationality: 'Italiana',
        guest_phone_number: '3331234567',
        guest_email: 'mario.rossi@example.com',
        guest_emergency_contact: '3339876543',
        guest_additional_info: 'Nessuna informazione aggiuntiva',
        guest_note: '',
        active: true,
        created_at: '2025-01-01T09:00:00.000Z',
        updated_at: '2025-01-01T09:00:00.000Z'
    },
    {
        id: 2,
        guest_code: 'G002',
        guest_first_name: 'Anna',
        guest_last_name: 'Verdi',
        guest_birth_date: '1985-05-15',
        guest_birth_place: 'Milano',
        guest_sex: 'F',
        guest_fiscal_code: 'VRDNNA85E55F205Z',
        guest_address: 'Via Milano 456, 20100, Milano',
        guest_nationality: 'Italiana',
        guest_phone_number: '3387654321',
        guest_email: 'anna.verdi@example.com',
        guest_emergency_contact: '3381122334',
        guest_additional_info: 'Allergie alimentari',
        guest_note: 'Necessità di dieta speciale',
        active: true,
        created_at: '2025-01-15T10:30:00.000Z',
        updated_at: '2025-02-01T14:45:00.000Z'
    },
    {
        id: 3,
        guest_code: 'G003',
        guest_first_name: 'Ahmed',
        guest_last_name: 'Khan',
        guest_birth_date: '1975-08-22',
        guest_birth_place: 'Cairo',
        guest_sex: 'M',
        guest_fiscal_code: 'KHNHMD75M22Z336Y',
        guest_address: 'Via Napoli 789, 80100, Napoli',
        guest_nationality: 'Egiziana',
        guest_phone_number: '3335556677',
        guest_email: 'ahmed.khan@example.com',
        guest_emergency_contact: '3332211000',
        guest_additional_info: 'Parla italiano, inglese e arabo',
        guest_note: 'In cerca di lavoro nel settore ristorazione',
        active: true,
        created_at: '2025-02-10T08:15:00.000Z',
        updated_at: '2025-03-05T11:20:00.000Z'
    },
    {
        id: 4,
        guest_code: 'G004',
        guest_first_name: 'Sofia',
        guest_last_name: 'Bianchi',
        guest_birth_date: '1990-11-30',
        guest_birth_place: 'Torino',
        guest_sex: 'F',
        guest_fiscal_code: 'BNCSFO90S70L219Z',
        guest_address: 'Via Torino 321, 10100, Torino',
        guest_nationality: 'Italiana',
        guest_phone_number: '3399887766',
        guest_email: 'sofia.bianchi@example.com',
        guest_emergency_contact: '3399887755',
        guest_additional_info: 'Laurea in scienze dell\'educazione',
        guest_note: 'In cerca di alloggio',
        active: false,
        created_at: '2025-01-20T13:45:00.000Z',
        updated_at: '2025-03-10T09:30:00.000Z'
    }
];

/**
 * Mock change history for guests
 */
const MOCK_HISTORY = {
    1: [
        {
            id: 1,
            date: '2025-01-01',
            time: '09:00',
            operator: 'Operatore1',
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
        }
    ],
    2: [
        {
            id: 3,
            date: '2025-01-15',
            time: '10:30',
            operator: 'Operatore1',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 4,
            date: '2025-02-01',
            time: '14:45',
            operator: 'Operatore2',
            category: 'alimentazione',
            field: 'Note alimentazione',
            oldValue: null,
            newValue: 'Allergie alimentari',
            type: 'added'
        }
    ],
    3: [
        {
            id: 5,
            date: '2025-02-10',
            time: '08:15',
            operator: 'Operatore3',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 6,
            date: '2025-03-05',
            time: '11:20',
            operator: 'Operatore1',
            category: 'lavoro',
            field: 'Note lavoro',
            oldValue: null,
            newValue: 'In cerca di lavoro nel settore ristorazione',
            type: 'added'
        }
    ],
    4: [
        {
            id: 7,
            date: '2025-01-20',
            time: '13:45',
            operator: 'Operatore2',
            category: 'anagrafica',
            field: 'Creazione scheda',
            oldValue: null,
            newValue: 'Dati anagrafici base',
            type: 'creation'
        },
        {
            id: 8,
            date: '2025-03-10',
            time: '09:30',
            operator: 'Operatore3',
            category: 'casa',
            field: 'Situazione attuale',
            oldValue: 'Affitto',
            newValue: 'Senza fissa dimora',
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
            // Use mock data for now
            // In production, uncomment the API call
            // const response = await api.getGuests();
            // return response.data.guests;

            return Promise.resolve(MOCK_GUESTS);
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