// components/base/StateFullComponent.js
"use strict";

class StateFullComponent extends HTMLElement {
    constructor() {
        super();
        this._state = {};
        this._initialized = false;
    }

    /**
     * Initialize state with default values
     * @protected
     * @param {Object} initialState - Initial state object
     */
    initState(initialState) {
        this._state = { ...initialState };
        this._initialized = true;
    }

    /**
     * Update state and trigger re-render
     * @protected
     * @param {Object|Function} newState - State update object or function
     * @param {Function} [callback] - Optional callback after state update
     */
    setState(newState, callback) {
        const nextState = typeof newState === 'function'
            ? newState(this._state)
            : newState;

        const prevState = { ...this._state };
        const stateChanged = Object.keys(nextState).some(
            key => this._state[key] !== nextState[key]
        );

        if (stateChanged) {
            this._state = { ...this._state, ...nextState };

            // Dispatch state change event
            this.dispatchEvent(new CustomEvent('statechange', {
                detail: {
                    prevState,
                    nextState: this._state
                }
            }));

            // Schedule render
            this.scheduleRender();
        }

        if (callback) {
            callback(this._state);
        }
    }

    /**
     * Get current state
     * @protected
     * @returns {Object} Current state
     */
    getState() {
        return { ...this._state };
    }

    /**
     * Schedule a render on next animation frame
     * @protected
     */
    scheduleRender() {
        if (!this._renderScheduled) {
            this._renderScheduled = true;
            requestAnimationFrame(() => {
                this._renderScheduled = false;
                this.render();
            });
        }
    }

    /**
     * Lifecycle: component connected
     */
    connectedCallback() {
        if (!this._initialized) {
            throw new Error('Component state not initialized. Call initState() in constructor');
        }
        this.render();
    }

    /**
     * Lifecycle: component disconnected
     */
    disconnectedCallback() {
        this.cleanup();
    }

    /**
     * Cleanup resources
     * @protected
     */
    cleanup() {
        // Override in subclass
    }

    /**
     * Render component
     * @protected
     */
    render() {
        // Override in subclass
        throw new Error('render() method must be implemented');
    }
}

module.exports = StateFullComponent;