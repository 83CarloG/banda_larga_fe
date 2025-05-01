// src/utils/fontUtils.js
"use strict";

/**
 * Utility for managing font styles and creating font CSS variables
 */

/**
 * Creates CSS variable expressions for font properties
 * @param {string} property - Font property name (weight, size, etc.)
 * @param {string} variant - Font property variant
 * @param {string} fallback - Fallback value
 * @returns {string} CSS variable expression
 */
const fontVar = (property, variant, fallback = null) => {
    const variable = `--font-${property}-${variant}`;
    return fallback ? `var(${variable}, ${fallback})` : `var(${variable})`;
};

/**
 * Font family values
 */
const FONT_FAMILY = {
    /** Primary font family (Poppins) */
    PRIMARY: "var(--font-family, 'Poppins', system-ui, -apple-system, sans-serif)",
    /** Monospace font family for code */
    MONO: "var(--font-family-mono, 'Fira Code', 'Source Code Pro', monospace)",
};

/**
 * Font weight values
 */
const FONT_WEIGHT = {
    /** Light font weight (300) */
    LIGHT: "var(--font-weight-light, 300)",
    /** Regular font weight (400) */
    REGULAR: "var(--font-weight-regular, 400)",
    /** Medium font weight (500) */
    MEDIUM: "var(--font-weight-medium, 500)",
    /** Semibold font weight (600) */
    SEMIBOLD: "var(--font-weight-semibold, 600)",
    /** Bold font weight (700) */
    BOLD: "var(--font-weight-bold, 700)",
};

/**
 * Font size values using var(--font-size-*) CSS variables
 */
const FONT_SIZE = {
    /** Extra small font size (12px) */
    XS: "var(--font-size-xs, 0.75rem)",
    /** Small font size (14px) */
    SM: "var(--font-size-sm, 0.875rem)",
    /** Base font size (16px) */
    BASE: "var(--font-size-base, 1rem)",
    /** Large font size (18px) */
    LG: "var(--font-size-lg, 1.125rem)",
    /** Extra large font size (20px) */
    XL: "var(--font-size-xl, 1.25rem)",
    /** 2X large font size (24px) */
    XXL: "var(--font-size-2xl, 1.5rem)",
    /** 3X large font size (30px) */
    XXXL: "var(--font-size-3xl, 1.875rem)",
};

/**
 * Creates a CSS string for styling text with Poppins font
 * @param {Object} options - Font styling options
 * @returns {string} CSS string for text styling
 */
const createFontStyles = (options = {}) => {
    const {
        family = FONT_FAMILY.PRIMARY,
        weight = FONT_WEIGHT.REGULAR,
        size = FONT_SIZE.BASE,
        lineHeight = 1.5,
        letterSpacing = 'normal',
        color = 'inherit',
    } = options;

    return `
        font-family: ${family};
        font-weight: ${weight};
        font-size: ${size};
        line-height: ${lineHeight};
        letter-spacing: ${letterSpacing};
        color: ${color};
    `;
};

/**
 * Helper function to load fonts dynamically if needed
 * @param {string} family - Font family name
 * @param {Object} options - Font loading options
 */
const loadFont = (family, options = {}) => {
    // Google Fonts URL format
    const createGoogleFontsUrl = (family, weights = [400], display = 'swap') => {
        const familyString = family.replace(/\s+/g, '+');
        const weightsString = weights.join(';');
        return `https://fonts.googleapis.com/css2?family=${familyString}:wght@${weightsString}&display=${display}`;
    };

    // Only load if not already loaded
    if (!document.querySelector(`link[href*="${family}"]`)) {
        const {
            weights = [300, 400, 500, 600, 700],
            display = 'swap',
            source = 'google' // or 'local'
        } = options;

        // Create link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';

        if (source === 'google') {
            // Google Fonts
            link.href = createGoogleFontsUrl(family, weights, display);
        } else if (source === 'local') {
            // Local path
            link.href = `/assets/fonts/${family.toLowerCase().replace(/\s+/g, '-')}.css`;
        }

        // Append to head
        document.head.appendChild(link);
        return true;
    }

    return false;
};

module.exports = {
    fontVar,
    FONT_FAMILY,
    FONT_WEIGHT,
    FONT_SIZE,
    createFontStyles,
    loadFont
};