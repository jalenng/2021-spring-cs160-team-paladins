const { ipcMain, dialog, app } = require('electron');
const Store = require('electron-store');
const path = require("path");
const axios = require('axios');

const SERVER_URL = 'http://165.232.156.120:3000'

/* Preferences defaults */
const preferencesStoreDefaults = {
        notifications: {
        enableSound: true,
        interval: 20,
        sound: "Bell.mp3"
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
    defaultSounds: [
        {
            key: "Bell.mp3",
            text: "Bell"
        }
    ],
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
ipcMain.on('getPrefsStore', (event) => {
    event.returnValue = store.get('preferences');
});

// Handles a request to update the preferences store
ipcMain.handle('setPrefsStoreValue', (event, key, value) => {
    store.set(`preferences.${key}`, value);
});


/**
 * Sounds-related IPC event handlers 
 * These event handlers retrieve and update the sounds on behalf of the renderer.
 */

// Handles a request to retrieve the sounds store
ipcMain.on('getSoundsStore', (event) => {
    event.returnValue = store.get('sounds');
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
ipcMain.on('getAccountStore', (event) => {
    event.returnValue = store.get('account');
});

// Handles a request to sign out and clear the account store
ipcMain.handle('sign-out', () => {
    store.reset('account');
})

// Handles a request to sign in and update the account store
ipcMain.handle('sign-in', async (event, email, password) => {

    let success = false;
    let message = "";

    try {
        // Send POST request
        let res = await axios.post(`${SERVER_URL}/auth`, {
            email: email,
            password: password
        })

        // Sign-in was successful. Process token.
        if (res.status === 200) {
            store.set('account.token', res.data.token);
            success = true,
            message = "Sign-in was successful"
        }
    }
    catch (error) {
        // On POST Error
        success = false;
        message = error.code
                    ? `Error: ${error.code}`
                    : error.response.data.message;
    }
    
    return {
        success: success,
        message: message
    }
})

// Handles a request to create an account and update the account store
ipcMain.handle('sign-up', async (event, email, password1, password2) => {

    let success = false;
    let message = "";

    // Check if passwords match
    if (password1 != password2) {
        message = "Passwords do not match.";
    }
    else {
        try {
            // Send POST request
            let res = await axios.post(`${SERVER_URL}/user`, {
                email: email,
                password: password1
            })
            
            console.log(res);
            // Sign-up was successful. Process token.
            if (res.status === 200) {
                success = true;
                message = "Account created. Please sign in.";
            }
        }
        catch (error) {
            // On POST Error
            console.error(error);
            message = error.code
                        ? `Error: ${error.code}`
                        : error.response.data.message;
        }
    }

    return {
        success: success,
        message: message
    }
    
})