// components/CentersPage/centersService.js
"use strict";

// Import the API module (would normally connect to a real backend)
// const api = require('../../modules/api');

// Mock data for centers
const mockCenters = [
    {
        id: 1,
        name: "Centro Ascolto San Giovanni",
        type: ["Cibo", "Psicologico", "Abiti e altri beni"],
        openDate: "2018-05-12",
        mission: "Aiutare le persone in situazioni di difficoltà offrendo supporto alimentare e ascolto.",
        fiscalCode: "CF8765432109",
        director: "Maria Rossi",
        address: "Via Roma 123, Milano",
        phone: "02 1234567",
        email: "sangiovannicentro@example.it",
        active: true,
        notes: "Aperto tutti i giorni dalle 9:00 alle 18:00"
    },
    {
        id: 2,
        name: "Dormitorio San Paolo",
        type: ["Dormitorio", "Housing"],
        openDate: "2010-11-30",
        mission: "Offrire un rifugio sicuro per le persone senza dimora.",
        fiscalCode: "CF2345678901",
        director: "Paolo Bianchi",
        address: "Via Verdi 45, Roma",
        phone: "06 7654321",
        email: "dormitorio@sanpaolo.org",
        active: true,
        notes: "Aperto dalle 20:00 alle 8:00. 30 posti disponibili."
    },
    {
        id: 3,
        name: "Centro Formazione Nuove Opportunità",
        type: ["Formazione", "Collocamento lavorativo"],
        openDate: "2015-03-15",
        mission: "Aiutare le persone a trovare lavoro attraverso formazione professionale e orientamento.",
        fiscalCode: "CF3456789012",
        director: "Laura Verdi",
        address: "Corso Italia 78, Torino",
        phone: "011 9876543",
        email: "formazione@nuoveopportunita.org",
        active: true,
        notes: "Corsi di formazione professionale in diversi settori."
    },
    {
        id: 4,
        name: "Centro Distribuzione Solidale",
        type: ["Cibo", "Abiti e altri beni"],
        openDate: "2019-02-01",
        mission: "Raccolta e distribuzione di generi alimentari e vestiario per famiglie in difficoltà.",
        fiscalCode: "CF4567890123",
        director: "Giovanni Neri",
        address: "Via Dante 90, Napoli",
        phone: "081 1234567",
        email: "distribuzione@solidale.org",
        active: true,
        notes: "Distribuzione pacchi alimentari ogni martedì e giovedì."
    },
    {
        id: 5,
        name: "Centro Ascolto Famiglia",
        type: ["Psicologico"],
        openDate: "2017-09-10",
        mission: "Supporto psicologico e ascolto per famiglie in difficoltà.",
        fiscalCode: "CF5678901234",
        director: "Anna Bianchi",
        address: "Via Mazzini 56, Firenze",
        phone: "055 7654321",
        email: "ascolto@centrofamiglia.org",
        active: false,
        notes: "Consulenze su appuntamento."
    },
    {
        id: 6,
        name: "Centro Mobilità Sostenibile",
        type: ["Trasporto"],
        openDate: "2020-01-15",
        mission: "Offrire servizi di trasporto gratuito per persone con disabilità e anziani.",
        fiscalCode: "CF6789012345",
        director: "Roberto Gialli",
        address: "Corso Europa 120, Genova",
        phone: "010 9876543",
        email: "trasporti@mobilitasostenibile.org",
        active: true,
        notes: "Servizio di trasporto su prenotazione."
    }
];

// Helper function to simulate async API calls
const simulateApiCall = (data, delay = 500, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('API call failed'));
            } else {
                resolve(data);
            }
        }, delay);
    });
};

/**
 * Center service for handling API calls
 */
const centerService = {
    /**
     * Fetch all centers
     * @returns {Promise<Array<Center>>}
     */
    async fetchCenters() {
        // In a real app, this would call the API:
        // const response = await api.getCenters();
        // return response.data.centers;

        // Instead, we'll use mock data
        return simulateApiCall(mockCenters);
    },

    /**
     * Get center details for editing
     * @param {number} centerId - Center ID
     * @returns {Promise<Object>} - Center data
     */
    async getCenter(centerId) {
        // In a real app:
        // const response = await api.getCenter(centerId);
        // return response.data;

        const center = mockCenters.find(c => c.id === centerId);
        return simulateApiCall(center || null);
    },

    /**
     * Create new center
     * @param {Object} centerData - Center data
     * @returns {Promise<Center>}
     */
    async createCenter(centerData) {
        // In a real app:
        // const response = await api.createCenter(centerData);
        // return response.data.center;

        // Generate a new center with an ID
        const newCenter = {
            ...centerData,
            id: Math.max(...mockCenters.map(c => c.id), 0) + 1
        };

        // In a real app, this would persist to the backend
        mockCenters.push(newCenter);

        return simulateApiCall(newCenter);
    },

    /**
     * Update existing center
     * @param {number} centerId - Center ID
     * @param {Object} centerData - Center data
     * @returns {Promise<Center>}
     */
    async updateCenter(centerId, centerData) {
        // In a real app:
        // const response = await api.updateCenter(centerId, centerData);
        // return response.data.center;

        const index = mockCenters.findIndex(c => c.id === centerId);
        if (index === -1) {
            return simulateApiCall(null, 400, true);
        }

        // Update the center in the mock data
        const updatedCenter = {
            ...mockCenters[index],
            ...centerData,
            id: centerId  // Ensure ID isn't changed
        };

        mockCenters[index] = updatedCenter;

        return simulateApiCall(updatedCenter);
    },

    /**
     * Delete center
     * @param {number} centerId - Center ID
     * @returns {Promise<void>}
     */
    async deleteCenter(centerId) {
        // In a real app:
        // await api.deleteCenter(centerId);

        const index = mockCenters.findIndex(c => c.id === centerId);
        if (index === -1) {
            return simulateApiCall(null, 400, true);
        }

        // Remove the center from the mock data
        mockCenters.splice(index, 1);

        return simulateApiCall({ success: true });
    }
};

module.exports = centerService;