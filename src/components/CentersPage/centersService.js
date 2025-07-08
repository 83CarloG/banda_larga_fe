// components/CentersPage/centersService.js
"use strict";

// Import the API module (would normally connect to a real backend)
const api = require('../../modules/api');



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