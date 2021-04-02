const { ipcRenderer } = window.require('electron');

/**
 * Helper function to retrieve info about the signed-in account from the account store
 * @returns {Object}
 */
function getAccountStore() {
    return ipcRenderer.sendSync('getAccountStore')
}

/**
 * Helper function to sign in to an account.
 * @returns {Object} the response of the sign-in attempt
 */
function signIn(username, password) {
    return ipcRenderer.invoke('sign-in', username, password)
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
    return ipcRenderer.sendSync('getPrefsStore')
}

/**
 * Helper function to update a preference on the preferences store
 */
function setPreference(key, value) {
    ipcRenderer.invoke('setPrefsStoreValue', key, value)
}

/**
 * Helper function to retrieve all sounds from the sounds store
 * @returns {Object}
 */
function getAllSounds() {
    return ipcRenderer.sendSync('getSoundsStore')
}

/**
 * Helper function to open a file selection dialog for adding a custom sound to the sounds store
 */
function addCustomSound() {
    ipcRenderer.invoke('addCustomSound')
}

module.exports = {
    getAccountStore: getAccountStore,
    signIn: signIn,
    signOut: signOut,
    getAllPreferences: getAllPreferences,
    setPreference: setPreference,
    getAllSounds: getAllSounds,
    addCustomSound: addCustomSound
}