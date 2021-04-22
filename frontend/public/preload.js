/**
 * The purpose of this preload script is to provide a set of methods for the 
 * renderer (React code) to interact with the main process (Electron). 
 * 
 * This compartmentalization ensures that logic is handled exclusively by Electron,
 * and displaying UI elements is handled exclusively by React.
 */

const { ipcRenderer } = require('electron');


/**
 * Event system
 */
const EventSystem = function() {

    this._events = {}
    /**
     * Register an event listener
     * @param {string} name 
     * @param {} listener 
     */
    this.on = (name, listener) => {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push(listener);
    }
}


/**
 * Store helper functions
 */
window.store = {
    accounts: {
        /**
         * Retrieve info about the signed-in account from the account store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-account-store') },
        
        /**
         * Sign into an account.
         * @param {String} email the email address of the account
         * @param {String} password the password of the account
         * @returns {Object} the response of the sign-in attempt
         */
        signIn: (email, password) => { return ipcRenderer.invoke('authenticate', email, password) },

        /**
         * Sign up an account.
         * @param {String} email the email address of the new account
         * @param {String} password the password of the new account
         * @param {String} displayName the display name of the new account
         * @returns {Object} the response of the sign-up attempt
         */
        signUp: (email, password, displayName) => {
            return ipcRenderer.invoke('authenticate', email, password, true, displayName)
        },

        /**
         * Sign out of logged-in account
         */
        signOut: () => { return ipcRenderer.invoke('sign-out', false) },

        /**
         * Delete account
         * @param {String} password The existing password for confirmation
         */
        delete: (password) => { return ipcRenderer.invoke('sign-out', true, password) },

        /**
         * Fetch the latest account information from the server
         */
        fetchInfo: () => { return ipcRenderer.invoke('fetch-account-info') },

        /**
         * Update account information
         * @param {String} email The new email
         * @param {String} displayName The new displayname
         * @param {String} password The existing password for confirmation
         */
        updateInfo: (email, displayName, password) => {
            return ipcRenderer.invoke('update-account-info', email, displayName, password)
        },

        /* Event system */
        eventSystem: new EventSystem()
    },
    preferences: {
        /**
         * Retrieve all preferences from the preferences store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-prefs-store') },

        /**
         * Update a preference on the preferences store
         * @param {String} key The key of the preference. e.g. 'notifications.sound'
         * @param {String} value The new value 
         */
        set: (key, value) => { ipcRenderer.invoke('set-prefs-store-value', key, value) },

        /**
         * Fetch the latest preferences from the server
         */
        fetch: () => { return ipcRenderer.invoke('fetch-prefs') },

        /**
         * Push the local preferences to the server
         */
        push: () => { return ipcRenderer.invoke('push-prefs') },

        /* Event system */
        eventSystem: new EventSystem()
    },
    sounds: {
        /**
         * Retrieve all sounds from the sounds store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-sounds-store') },

        /**
         * Open a file selection dialog for adding a custom sound to the sounds store
         */
        add: () => { ipcRenderer.invoke('add-custom-sound') },

        /* Event system */
        eventSystem: new EventSystem()        
    },
    insights: {
        /**
         * Retrieve insights from the data usage store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-insights-store') },

        /* Event system */
        eventSystem: new EventSystem()
    },
}


/**
 * Popup window helper functions
 */
window.showPopup = {
    /**
     * Open the "Sign in" popup window
     */
    signIn: () => { ipcRenderer.invoke('show-sign-in-popup') },
    /**
     * Open the "Delete account" popup window
     */
    deleteAccount: () => { ipcRenderer.invoke('show-delete-account-popup') },
    /**
     * Open the "Edit account" popup window
     */
    editAccount: () => { ipcRenderer.invoke('show-edit-account-popup') },
    /**
     * Open the popup timer window
     */
    timer: () => { ipcRenderer.invoke('show-timer-popup') }
}

/**
 * Timer helper functions 
 */

window.timer = {
    toggle: () => { ipcRenderer.invoke('timer-toggle') },
    end: () => { ipcRenderer.invoke('timer-end') },
    reset: () => { ipcRenderer.invoke('timer-reset') },
    getStatus: () => { ipcRenderer.send('get-timer-status') },
    eventSystem: new EventSystem()
}

window.breakSys = {
    getStatus: () => { ipcRenderer.send('get-break-status') },
    eventSystem: new EventSystem()
}


/**
 * Other functions
 */
window.playSound = () => { ipcRenderer.invoke('play-sound') }
window.getAboutInfo = () => { return ipcRenderer.sendSync('get-about-info') }


/**
 * Listen for events from ipcRenderer, then relay them accordingly.
 */
ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
    const fireCallbacks = (callback) => callback(event, timerStatus);
    window.timer.eventSystem._events['update'].forEach(fireCallbacks);
})

ipcRenderer.on('receive-break-status', (event, breakStatus) => {
    const fireCallbacks = (callback) => callback(event, breakStatus);
    window.breakSys.eventSystem._events['update'].forEach(fireCallbacks);
})

ipcRenderer.on('store-changed', (event, category) => {
    const fireCallbacks = (callback) => callback();
    window.store[category].eventSystem._events['changed'].forEach(fireCallbacks);
})