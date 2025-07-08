// components/CentersPage/centersService.js
"use strict";

// Import the API module (would normally connect to a real backend)
const api = require('../../modules/api');

// Mock data for centers
// const mockCenters = [
//     {
//         id: 1,
//         name: "Centro Ascolto San Giovanni",
//         type: ["Cibo", "Psicologico", "Abiti e altri beni"],
//         openDate: "2018-05-12",
//         mission: "Aiutare le persone in situazioni di difficoltà offrendo supporto alimentare e ascolto.",
//         fiscalCode: "CF8765432109",
//         director: "Maria Rossi",
//         address: "Via Roma 123, Milano",
//         phone: "02 1234567",
//         email: "sangiovannicentro@example.it",
//         active: true,
//         notes: "Aperto tutti i giorni dalle 9:00 alle 18:00"
//     },
//     {
//         id: 2,
//         name: "Dormitorio San Paolo",
//         type: ["Dormitorio", "Housing"],
//         openDate: "2010-11-30",
//         mission: "Offrire un rifugio sicuro per le persone senza dimora.",
//         fiscalCode: "CF2345678901",
//         director: "Paolo Bianchi",
//         address: "Via Verdi 45, Roma",
//         phone: "06 7654321",
//         email: "dormitorio@sanpaolo.org",
//         active: true,
//         notes: "Aperto dalle 20:00 alle 8:00. 30 posti disponibili."
//     },
//     {
//         id: 3,
//         name: "Centro Formazione Nuove Opportunità",
//         type: ["Formazione", "Collocamento lavorativo"],
//         openDate: "2015-03-15",
//         mission: "Aiutare le persone a trovare lavoro attraverso formazione professionale e orientamento.",
//         fiscalCode: "CF3456789012",
//         director: "Laura Verdi",
//         address: "Corso Italia 78, Torino",
//         phone: "011 9876543",
//         email: "formazione@nuoveopportunita.org",
//         active: true,
//         notes: "Corsi di formazione professionale in diversi settori."
//     },
//     {
//         id: 4,
//         name: "Centro Distribuzione Solidale",
//         type: ["Cibo", "Abiti e altri beni"],
//         openDate: "2019-02-01",
//         mission: "Raccolta e distribuzione di generi alimentari e vestiario per famiglie in difficoltà.",
//         fiscalCode: "CF4567890123",
//         director: "Giovanni Neri",
//         address: "Via Dante 90, Napoli",
//         phone: "081 1234567",
//         email: "distribuzione@solidale.org",
//         active: true,
//         notes: "Distribuzione pacchi alimentari ogni martedì e giovedì."
//     },
//     {
//         id: 5,
//         name: "Centro Ascolto Famiglia",
//         type: ["Psicologico"],
//         openDate: "2017-09-10",
//         mission: "Supporto psicologico e ascolto per famiglie in difficoltà.",
//         fiscalCode: "CF5678901234",
//         director: "Anna Bianchi",
//         address: "Via Mazzini 56, Firenze",
//         phone: "055 7654321",
//         email: "ascolto@centrofamiglia.org",
//         active: false,
//         notes: "Consulenze su appuntamento."
//     },
//     {
//         id: 6,
//         name: "Centro Mobilità Sostenibile",
//         type: ["Trasporto"],
//         openDate: "2020-01-15",
//         mission: "Offrire servizi di trasporto gratuito per persone con disabilità e anziani.",
//         fiscalCode: "CF6789012345",
//         director: "Roberto Gialli",
//         address: "Corso Europa 120, Genova",
//         phone: "010 9876543",
//         email: "trasporti@mobilitasostenibile.org",
//         active: true,
//         notes: "Servizio di trasporto su prenotazione."
//     }
// ];

// Helper function to simulate async API calls
// const simulateApiCall = (data, delay = 500, shouldFail = false) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (shouldFail) {
//                 reject(new Error('API call failed'));
//             } else {
//                 resolve(data);
//             }
//         }, delay);
//     });
// };

// Helper to map backend center to frontend model
function mapCenter(center) {
    if (!center) return null;
    // Ensure type is always an array of string IDs
    let typeArr = [];
    if (Array.isArray(center.center_types)) {
        typeArr = center.center_types.map(t => {
            if (typeof t === 'object' && t.id) return String(t.id);
            return String(t);
        });
    }
    return {
        id: center.id,
        name: center.center_name,
        type: typeArr,
        openDate: center.center_opening_date,
        mission: center.center_description,
        fiscalCode: center.center_vat,
        director: center.center_responsible,
        address: center.center_address,
        phone: center.center_phone_number,
        email: center.center_email,
        active: center.active !== undefined ? center.active : true,
        notes: center.center_note || ''
    };
}

/**
 * Center service for handling API calls
 */
const centerService = {
    /**
     * Fetch all centers
     * @returns {Promise<Array<Center>>}
     */
    async fetchCenters() {
        const response = await api.getCenters();
        // The backend returns { status, data: { centers: [...], centerTypes: [...] } }
        let centersArr = [];
        let centerTypesArr = [];
        if (response.data && response.data.centers) {
            centersArr = response.data.centers;
            centerTypesArr = response.data.centerTypes || [];
        } else if (response.data) {
            centersArr = response.data;
        } else if (Array.isArray(response)) {
            centersArr = response;
        }
        return {
            centers: Array.isArray(centersArr) ? centersArr.map(mapCenter) : [],
            centerTypes: Array.isArray(centerTypesArr) ? centerTypesArr : []
        };
    },

    /**
     * Get center details for editing
     * @param {number} centerId - Center ID
     * @returns {Promise<Object>} - Center data
     */
    async getCenter(centerId) {
        const response = await api.getCenter(centerId);
        let centerObj = null;
        if (response.data && response.data.center) {
            centerObj = response.data.center;
        } else if (response.data) {
            centerObj = response.data;
        } else {
            centerObj = response;
        }
        return mapCenter(centerObj);
    },

    /**
     * Create new center
     * @param {Object} centerData - Center data
     * @returns {Promise<Center>}
     */
    async createCenter(centerData) {
        const response = await api.createCenter(centerData);
        let centerObj = null;
        if (response.data && response.data.center) {
            centerObj = response.data.center;
        } else if (response.data) {
            centerObj = response.data;
        } else {
            centerObj = response;
        }
        return mapCenter(centerObj);
    },

    /**
     * Update existing center
     * @param {number} centerId - Center ID
     * @param {Object} centerData - Center data
     * @returns {Promise<Center>}
     */
    async updateCenter(centerId, centerData) {
        const response = await api.updateCenter(centerId, centerData);
        let centerObj = null;
        if (response.data && response.data.center) {
            centerObj = response.data.center;
        } else if (response.data) {
            centerObj = response.data;
        } else {
            centerObj = response;
        }
        return mapCenter(centerObj);
    },

    /**
     * Delete center
     * @param {number} centerId - Center ID
     * @returns {Promise<void>}
     */
    async deleteCenter(centerId) {
        return api.deleteCenter(centerId);
    }
};

module.exports = centerService;