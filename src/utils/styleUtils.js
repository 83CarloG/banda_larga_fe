// src/utils/styleUtils.js
"use strict";

/**
 * CSS Template literal tag for better CSS organization
 * @param {Array<string>} strings - Template literal strings
 * @param {...any} values - Template literal values
 * @returns {string} Processed CSS string
 */
const css = (strings, ...values) => {
    const result = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] || '');
    }, '');

    // Clean and format CSS
    return result
        .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove comments
        .replace(/\s+/g, ' ')              // Normalize whitespace
        .replace(/\s*{\s*/g, ' {\n    ')   // Format opening braces
        .replace(/;\s*/g, ';\n    ')       // Format semicolons
        .replace(/\s*}\s*/g, '\n}\n')      // Format closing braces
        .trim();                           // Remove leading/trailing whitespace
};

/**
 * Joins CSS class names, filtering out falsy values
 * @param {...string} classes - CSS class names to join
 * @returns {string} Joined class names
 */
const classNames = (...classes) => {
    return classes
        .flat()
        .filter(Boolean)
        .join(' ');
};

/**
 * Creates a CSS variable with optional fallback
 * @param {string} name - Variable name without -- prefix
 * @param {string} [fallback] - Optional fallback value
 * @returns {string} CSS var() function
 */
const cssVar = (name, fallback) => {
    return fallback
        ? `var(--${name}, ${fallback})`
        : `var(--${name})`;
};

module.exports = {
    css,
    classNames,
    cssVar
};