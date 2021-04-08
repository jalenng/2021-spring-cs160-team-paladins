const { ipcMain, dialog, app } = require('electron');
const Store = require('electron-store');
const path = require('path');
const axios = require('axios');

const SERVER_URL = 'http://165.232.156.120:3000'

/* Preferences defaults */
const preferencesStoreDefaults = {
    notifications: {
        enableSound: true,
        interval: 20,
        sound: 'Bell.mp3'
    },
    dataUsage: {
        trackAppUsageStats: true,
        enableWeeklyUsageStats: true
    },
    startup: {
        startAppOnLogin: true,
        startTimerOnAppStartup: true
    }
}

/* Sounds defaults */
const soundsStoreDefaults = {
    defaultSounds: [{
        key: 'Bell.mp3',
        text: 'Bell'
    }],
    customSounds: []
}

/* Account defaults */
const accountStoreDefaults = {
    token: null,
    accountInfo: {
        email: null,
        displayName: 'iCare Guest',
    }
}

/* Create the store */
const storeOptions = {
    defaults: {
        preferences: preferencesStoreDefaults,
        sounds: soundsStoreDefaults,
        account: accountStoreDefaults,
    },
    watch: true
}
const store = new Store(storeOptions);


/**
 * Handler for store change events
 */
// Handles a change to preferences.startup.startAppOnLogin 
store.onDidChange('preferences.startup.startAppOnLogin', (newVal, oldVal) => {
    // Start app when the user logs in
    app.setLoginItemSettings({
        openAtLogin: newVal,
        enabled: newVal,
        path: app.getPath('exe')
    })
});

// Notifies the main window of preference store updates
store.onDidChange('preferences', () => {
    global.mainWindow.webContents.send('preferences-store-changed');
});

// Notifies the main window of sound store updates
store.onDidChange('sounds', () => {
    global.mainWindow.webContents.send('sounds-store-changed');
});

// Notifies the main window of account store updates
store.onDidChange('account', () => {
    global.mainWindow.webContents.send('account-store-changed');
});


/**
 * Preferences-related IPC event handlers 
 * These event handlers retrieve and update the preferences on behalf of the renderer.
 */

// Handles a request to retrieve the preferences store
ipcMain.on('get-prefs-store', (event) => {
    console.log('get prefs store')
    event.returnValue = store.get('preferences');
});

// Handles a request to update the preferences store
ipcMain.handle('set-prefs-store-value', (event, key, value) => {
    store.set(`preferences.${key}`, value);
});


/**
 * Sounds-related IPC event handlers 
 * These event handlers retrieve and update the sounds on behalf of the renderer.
 */

// Handles a request to retrieve the sounds store
ipcMain.on('get-sounds-store', (event) => {
    event.returnValue = store.get('sounds');
});

// Handles a request to update the sounds store
ipcMain.handle('add-custom-sound', (event) => {

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
            // If user did not cancel the dialog
            if (!result.canceled) {
                var filePath = result.filePaths[0];

                // Create new sound object from selected file
                var newSound = {
                    key: filePath,
                    text: path.basename(filePath)
                }
                var newCustomSounds = store.get('sounds.customSounds');

                // Concatenate with existing list of custom sounds
                newCustomSounds = newCustomSounds.concat(newSound);

                // Update custom sounds with updated array
                store.set('sounds.customSounds', newCustomSounds);

                // Set new sound as default notification sound
                store.set('preferences.notifications.sound', filePath);

            }
        }).catch(err => {
            console.log(err);
        })

});


/**
 * Account store-related IPC event handlers 
 * These event handlers retrieve and update the account store on behalf of the renderer.
 */

// Handles a request to retrieve the account store
ipcMain.on('get-account-store', (event) => {
    event.returnValue = store.get('account');
});

// Handles a request to sign out and clear the account store
ipcMain.handle('sign-out', () => {
    store.reset('account');
})

// Handles a request to authenticate the user (by signing in or signing up)
ipcMain.handle('authenticate', async (event, email, password, createAccount = false, displayName = '') => {

    let result = {
        success: false,
        data: {}
    };

    // Try to authenticate
    try {
        
        // Send POST request        
        let url;
        let data;
        if (createAccount) {
            url = `${SERVER_URL}/user`
            data = {
                email: email,
                password: password,
                displayName: displayName
            }
        } else {
            url = `${SERVER_URL}/auth`
            data = {
                email: email,
                password: password
            }
        }

        // Await for response
        let res = await axios.post(url, data);

        // If sign-in was successful
        if (res.status === 200 || res.status === 201) {

            let account = {
                token: res.data.token,
                accountInfo: {
                    email: res.data.accountInfo.email,
                    displayName: res.data.accountInfo.displayName
                }
            }
            store.set('account', account)

            result.success = true;

        }
    }
    // Handle errors
    catch (error) {
     
        console.log(error)

        // Axios error code?
        if (error.code) {
            result.data = {
                reason: error.code,
                message: `Error: ${error.code}`
            }
        }
        // Response error code?
        else if (error.response && error.response.data && error.response.data.reason && error.response.data.message) {
            result.data = error.response.data;
        }
        // Generic error
        else {
            result.data = {
                reason: 'RESPONSE_ERR',
                message: error.toString()
            }
        }

    }

    // Return the result object
    return result;
})