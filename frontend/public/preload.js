const { ipcRenderer } = require('electron');

// Store helper functions
window.storeFunctions = {

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
         * Fetch the latest account information
         */
        getLatestInfo: () => { return ipcRenderer.invoke('get-account-info') },

        /**
         * Update account information
         * @param {String} email The new email
         * @param {String} displayName The new displayname
         * @param {String} password The existing password for confirmation
         */
        updateInfo: (email, displayName, password) => {
            return ipcRenderer.invoke('update-account-info', email, displayName, password)
        }

    },

    preferences: {
        /**
         * Retrieve all preferences from the preferences store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-prefs-store') },

        /**
         * Update a preference on the preferences store
         * @param {String} key The key of the preference. e.g. "notifications.sound"
         * @param {String} value The new value 
         */
        set: (key, value) => { ipcRenderer.invoke('set-prefs-store-value', key, value) }
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
        add: () => { ipcRenderer.invoke('add-custom-sound') }
        
    },

    insights: {
        /**
         * Retrieve insights from the data usage store
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-insights-store') }
    }

}
