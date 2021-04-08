const { ipcRenderer } = window.require('electron');

/**
 * Helper function to retrieve info about the signed-in account from the account store
 * @returns {Object}
 */
function getAccountStore() {
    return ipcRenderer.sendSync('get-account-store')
}

/**
 * Helper function to authenticate an account.
 * @returns {Object} the response of the sign-in or sign-up attempt
 */
function authenticate(email, password, createAccount=false, displayName='') {
    return ipcRenderer.invoke('authenticate', email, password, createAccount, displayName)
}

/**
 * Helper function to sign out of logged-in account
 */
function signOut() {
    ipcRenderer.invoke('sign-out')
}

/**
 * Helper function to retrieve all preferences from the preferences store
 * @returns {Object}
 */
function getAllPreferences() {
    return ipcRenderer.sendSync('get-prefs-store')
}

/**
 * Helper function to update a preference on the preferences store
 */
function setPreference(key, value) {
    ipcRenderer.invoke('set-prefs-store-value', key, value)
}

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

module.exports = {
    getAccountStore: getAccountStore,
    authenticate: authenticate,
    signOut: signOut,
    getAllPreferences: getAllPreferences,
    setPreference: setPreference,
    getAllSounds: getAllSounds,
    addCustomSound: addCustomSound
}