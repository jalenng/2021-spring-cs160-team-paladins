const { ipcRenderer } = window.require('electron');

/* ACCOUNT */

/**
 * Helper function to retrieve info about the signed-in account from the account store
 * @returns {Object}
 */
function getAccountStore() {
    return ipcRenderer.sendSync('get-account-store')
}

/**
 * Helper function to sign into an account.
 * @param {String} email the email address of the account
 * @param {String} password the password of the account
 * @returns {Object} the response of the sign-in attempt
 */
function signIn(email, password) {
    return ipcRenderer.invoke('authenticate', email, password)
}

/**
 * Helper function to sign up an account.
 * @param {String} email the email address of the new account
 * @param {String} password the password of the new account
 * @param {String} displayName the display name of the new account
 * @returns {Object} the response of the sign-up attempt
 */
function signUp(email, password, displayName) {
    return ipcRenderer.invoke('authenticate', email, password, true, displayName)
}
    
/**
 * Helper function to sign out of logged-in account
 */
function signOut() {
    return ipcRenderer.invoke('sign-out', false)
}

/**
 * Helper function to delete account account
 * @param {String} password The existing password for confirmation
 */
function deleteAccount(password) {
    return ipcRenderer.invoke('sign-out', true, password)
}

/**
 * Helper function to fetch the latest account information
 */
function getAccountInfo() {
    return ipcRenderer.invoke('get-account-info')
}

/**
 * Helper function to update account information
 * @param {String} email The new email
 * @param {String} displayName The new displayname
 * @param {String} password The existing password for confirmation
 */
function updateAccountInfo(email, displayName, password) {
    return ipcRenderer.invoke('update-account-info', email, displayName, password)
}

/* PREFERENCES */

/**
 * Helper function to retrieve all preferences from the preferences store
 * @returns {Object}
 */
function getAllPreferences() {
    return ipcRenderer.sendSync('get-prefs-store')
}

/**
 * Helper function to update a preference on the preferences store
 * @param {String} key The key of the preference. e.g. "notifications.sound"
 * @param {String} value The new value 
 */
function setPreference(key, value) {
    ipcRenderer.invoke('set-prefs-store-value', key, value)
}


/* SOUNDS */

/**
 * Helper function to retrieve all sounds from the sounds store
 * @returns {Object}
 */
function getAllSounds() {
    return ipcRenderer.sendSync('get-sounds-store')
}

/**
 * Helper function to open a file selection dialog for adding a custom sound to the sounds store
 */
 function addCustomSound() {
    ipcRenderer.invoke('add-custom-sound')
}


/* INSIGHTS */

/**
 * Helper function to retrieve insights from the data usage store
 * @returns {Object}
 */
 function getAllInsights() {
    return ipcRenderer.sendSync('get-insights-store')
}




module.exports = {
    getAccountStore: getAccountStore,
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    deleteAccount: deleteAccount,
    getAccountInfo: getAccountInfo,
    updateAccountInfo: updateAccountInfo,

    getAllPreferences: getAllPreferences,
    setPreference: setPreference,

    getAllSounds: getAllSounds,
    addCustomSound: addCustomSound,

    getAllInsights: getAllInsights
}