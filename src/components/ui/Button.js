require('./Button.css');

/**
 * Creates a reusable button component that matches the existing styling
 *
 * @param {Object} config - Configuration object
 * @param {string} config.text - Button text
 * @param {string} config.type - Button type (button, submit, reset)
 * @param {string} config.variant - Button style variant (primary, cancel)
 * @param {string} config.icon - SVG icon markup (optional)
 * @param {boolean} config.disabled - Whether button is disabled
 * @param {string} config.ariaLabel - Accessibility label
 * @param {Function} config.onClick - Click handler
 * @returns {Object} - Button component API
 */
const Button = (config = {}) => {
    const {
        text = 'Button',
        type = 'button',
        variant = 'primary',
        icon = null,
        disabled = false,
        ariaLabel = '',
        onClick = () => {}
    } = config;

    // Create button element
    const button = document.createElement('button');
    button.type = type;
    button.className = `button ${variant === 'primary' ? 'primary-btn' : 'cancel-btn'}`;
    button.disabled = disabled;

    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }

    // Add text content
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    button.appendChild(textSpan);

    // Add icon if provided
    if (icon) {
        const iconContainer = document.createElement('span');
        iconContainer.innerHTML = icon;
        button.insertBefore(iconContainer, textSpan);
    }

    // Loading state properties
    let isLoading = false;
    const originalText = text;
    let originalWidth = null;

    // Store original button content before loading
    const originalContent = button.innerHTML;

    // Event listeners
    button.addEventListener('click', (e) => {
        if (!disabled && !isLoading) {
            onClick(e);
        }
    });

    // Public API
    return {
        getElement: () => button,

        getText: () => textSpan.textContent,

        setText: (newText) => {
            if (!isLoading) {
                textSpan.textContent = newText;
            }
        },

        setLoading: (loading) => {
            isLoading = loading;

            if (loading) {
                // Store original width to prevent layout shifts
                if (!originalWidth) {
                    originalWidth = button.offsetWidth;
                    button.style.width = `${originalWidth}px`;
                }

                button.disabled = true;
                button.innerHTML = '<span class="spinner"></span> Saving...';
            } else {
                button.disabled = disabled; // Restore original disabled state
                button.innerHTML = originalContent;

                // Restore original width
                if (originalWidth) {
                    button.style.width = '';
                    originalWidth = null;
                }
            }
        },

        disable: () => {
            disabled = true;
            button.disabled = true;
        },

        enable: () => {
            disabled = false;
            button.disabled = false;
        }
    };
};

module.exports = Button;