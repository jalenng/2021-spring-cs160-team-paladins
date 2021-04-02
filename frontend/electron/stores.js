const { ipcMain } = require('electron');
const Store = require('electron-store');

// Electron stores for persistent storage
const preferencesStoreOptions = {
    defaults: {
        notifications: {
            enableSound: true,
            interval: 20,
            sound: "sound1"
        },
        dataUsage: {
            trackAppUsageStats: true,
            enableWeeklyUsageStats: true
        },
        startup: {
            startAppOnLogin: true,
            startTimerOnAppStartup: true
        }
    },
    watch: true
}

preferencesStore = new Store(preferencesStoreOptions);

/**
 * Store-related IPC event handlers 
 * These event handlers update and retrieve from the store on behalf of the renderer.
 */

ipcMain.on('getPrefsStore', (event) => {
	event.returnValue = preferencesStore.store;
});

ipcMain.handle('setPrefsStoreValue', (event, key, value) => {
	preferencesStore.set(key, value);
});