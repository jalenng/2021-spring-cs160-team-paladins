const { ipcMain, dialog, app } = require('electron');
const Store = require('electron-store');
const path = require("path");
const axios = require('axios')

const SERVER_URL = 'http://165.232.156.120:3000'

/* Preferences defaults */
const preferencesStoreDefaults = {
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
}

/* Sounds defaults */
const soundsStoreDefaults = {
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
}

/* Account defaults */
const accountStoreDefaults = {
    token: null,
    accountInfo: {
        email: null,
        displayName: 'iCare Guest',
    }
}

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

// Handles a request to sign in and update the account store
ipcMain.handle('sign-in', async (event, email, password) => {

    let res;
    try {
        // Send POST request
        res = await axios.post(`${SERVER_URL}/auth`, {
            email: email,
            password: password
        })

        //TODO: Process response object
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data);
        return res.data;
    }
    catch (error) {
        // POST Error
        console.error(error);
        return error.code;
    }
})

// Handles a request to create an account and update the account store
ipcMain.handle('sign-up', async (event, email, password1, password2) => {

    if (password1 != password2) {
        return "Passwords do not match."
    }

    let res;
    try {
        // Send POST request
        res = await axios.post(`${SERVER_URL}/user`, {
            email: email,
            password: password1
        })

        //TODO: Process response object
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data);
        return res.data;
    }
    catch (error) {
        // POST Error
        console.error(error);
        return error.code;
    }

})

// Handles a request to sign out and clear the account store
ipcMain.handle('sign-out', () => {
    store.reset('account');
})