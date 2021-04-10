const { ipcRenderer } = window.require('electron');

/**
 * Helper function to retrieve info about the signed-in account from the account store
 * @returns {Object}
 */
function getAccountStore() {
    return ipcRenderer.sendSync('get-account-store')
}

/**
 * Helper function to sign into an account.
 * @returns {Object} the response of the sign-in attempt
 */
 function signIn(email, password) {
    return ipcRenderer.invoke('authenticate', email, password)
}

/**
 * Helper function to sign up an account.
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
 */
 function deleteAccount(password) {
    return ipcRenderer.invoke('sign-out', true, password)
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
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    deleteAccount: deleteAccount,
    getAllPreferences: getAllPreferences,
    setPreference: setPreference,
    getAllSounds: getAllSounds,
    addCustomSound: addCustomSound
}