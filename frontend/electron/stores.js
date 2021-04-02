const { ipcMain, dialog, app } = require('electron');
const Store = require('electron-store');
const path = require("path");


/**
 * Persistent storage for preferences
 */
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
const preferencesStore = new Store(preferencesStoreOptions);


/**
 * Persistent storage for sound-related data
 */
const soundStoreOptions = {
    defaults: {
        defaultSounds: [
            {
                key: "Bell.mp3",
                text: "Bell"
            }
        ],
        customSounds: [
            {
                key: "C:/.../CustomSound.mp3",
                text: "CustomSound"
            }
        ]
    },
    watch: true
}
const soundStore = new Store(soundStoreOptions);


/**
 * Persistent storage/cache for account-related data
 */
 const accountStoreOptions = {
    defaults: {
        token: null,
        accountInfo: {
            email: null,
            displayName: 'iCare Guest',
        }
    },
    watch: true
}
const accountStore = new Store(accountStoreOptions);


/**
 * Preferences store-related IPC event handlers 
 * These event handlers retrieve and update the preferences store on behalf of the renderer.
 */

// Handles a request to retrieve the preferences store
ipcMain.on('getPrefsStore', (event) => {
    event.returnValue = preferencesStore.store;
});

// Handles a request to update the preferences store
ipcMain.handle('setPrefsStoreValue', (event, key, value) => {
    preferencesStore.set(key, value);
});


/**
 * Sounds store-related IPC event handlers 
 * These event handlers retrieve and update the sounds store on behalf of the renderer.
 */

// Handles a request to retrieve the sounds store
ipcMain.on('getSoundsStore', (event) => {
    event.returnValue = soundStore.store;
});

// Handles a request to update the sounds store
ipcMain.handle('addCustomSound', (event) => {

    // Open file selection dialog box
    dialog.showOpenDialog(mainWindow, {
        title: 'Choose custom sound',
        filters: [{
            name: 'Audio files',
            extensions: ['wav', 'mp3', 'ogg']
        }],
        defaultPath: app.getPath('music'),
        properties: ['openFile', 'dontAddToRecent']
    })
        .then(result => {
            if (!result.canceled) {     // If user did not cancel the dialog
                var filePath = result.filePaths[0]
                var newSound = {        // Create new sound object from selected file
                    key: filePath,
                    text: path.basename(filePath)
                }
                var newCustomSounds = soundStore.get('customSounds')
                newCustomSounds = newCustomSounds.concat(newSound)      // Concatenate with existing list of custom sounds
                soundStore.set('customSounds', newCustomSounds);        // Update custom sounds with updated array
            }
        }).catch(err => {
            console.log(err)
        })

});


/**
 * Account store-related IPC event handlers 
 * These event handlers retrieve and update the account store on behalf of the renderer.
 */

// Handles a request to retrieve the account store
ipcMain.on('getAccountStore', (event) => {
    event.returnValue = accountStore.store;
});

// Handles a request to sign in and update the account store
ipcMain.handle('sign-in', (event, username, password) => {

    axios
    .post('http://localhost:3000', {
        username: username,
        password: password
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })

})

// Handles a request to sign out and clear the account store
ipcMain.handle('sign-out', () => {
    accountStore.reset();
})