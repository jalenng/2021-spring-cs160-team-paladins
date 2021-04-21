const { ipcMain, dialog, app, systemPreferences } = require('electron');
const Store = require('electron-store');
const path = require('path');
const axios = require('axios');

/* Preferences defaults */
const preferencesStoreDefaults = {
    notifications: {
        enableSound: true,
        interval: 20,
        sound: '../sounds/Long Expected.mp3'
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
            key: '../sounds/Clearly.mp3',
            text: 'Clearly'
        },
        {
            key: '../sounds/Done For You.mp3',
            text: 'Done For You'
        },
        {
            key: '../sounds/Insight.mp3',
            text: 'Insight'
        },
        {
            key: '../sounds/Juntos.mp3',
            text: 'Juntos'
        },
        {
            key: '../sounds/Long Expected.mp3',
            text: 'Long Expected'
        },
        {
            key: '../sounds/Pristine.mp3',
            text: 'Pristine'
        },
        {
            key: '../sounds/When.mp3',
            text: 'When'
        },
    ],
    customSounds: []
}

/* Account defaults */
const accountStoreDefaults = {
    token: null,
    accountInfo: {
        email: '',
        displayName: 'iCare Guest',
    }
}

/* Data usage defaults */
const insightsDefaults = {
    cards: [
        {
            header: 'Test insight 1',
            content: 'Insight message.'
        },
        {
            header: 'Insight card!',
            content: 'This is an insight card. Let\'s pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights.'
        },
        {
            header: 'Test insight 1',
            content: 'Insight message.'
        },
        {
            header: 'Insight card!',
            content: 'This is an insight card. Let\'s pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights.'
        },
        {
            header: 'Test insight 1',
            content: 'Insight message.'
        },
        {
            header: 'Insight card!',
            content: 'This is an insight card. Let\'s pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights.'
        },
        {
            header: 'Test insight 1',
            content: 'Insight message.'
        },
        {
            header: 'Insight card!',
            content: 'This is an insight card. Let\'s pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights.'
        },
        {
            header: 'Test insight 1',
            content: 'Insight message.'
        },
        {
            header: 'Insight card!',
            content: 'This is an insight card. Let\'s pretend that this card is saying something very, very insightful. So, so, so insightful. Wow, would you look at this insight! I love insights.'
        },
    ]
}

/* Create the store */
const storeOptions = {
    defaults: {
        preferences: preferencesStoreDefaults,
        sounds: soundsStoreDefaults,
        account: accountStoreDefaults,
        insights: insightsDefaults
    },
    watch: true
}
global.store = new Store(storeOptions);
// store.set('preferences.notifications.interval', 0.1)
// store.clear();
// console.log(store.store)

/* Configure axios */
axios.defaults.baseURL = 'http://165.232.156.120:3000';
axios.defaults.timeout = 10000;
axios.defaults.headers.common['auth'] = store.get('account.token');


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

// Notifies the main window of account store updates, and updates 
store.onDidChange('account', () => {
    axios.defaults.headers.common['auth'] = store.get('account.token');
    global.mainWindow.webContents.send('account-store-changed');
});

// Notifies the main window of insights store updates
store.onDidChange('insights', () => {
    global.mainWindow.webContents.send('insights-store-changed');
});


/**
 * Preferences-related IPC event handlers 
 * These event handlers retrieve and update the preferences on behalf of the renderer.
 */

// Handles a request to retrieve the preferences store
ipcMain.on('get-prefs-store', (event) => {
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
            extensions: ['wav', 'mp3']
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

// Handles a request to retrieve the latest account info.
// Involves backend communication.
ipcMain.handle('get-account-info', async (event) => {

    let result = { success: false, data: {} };

    // Try to authenticate
    try {

        // Send GET request and await for response
        let res = await axios.get('user');

        // If information retrieval was successful
        if (res.status === 200) {

            let accountInfo = {
                email: res.data.email,
                displayName: res.data.displayName
            }
            store.set('account.accountInfo', accountInfo)

            result.success = true;
        }
    }
    // Handle errors
    catch (error) { result.data = handleRequestError(error) }
    
    // Return the result object
    return result;
})

// Handles a request to authenticate the user (by signing in or signing up).
// Involves backend communication.
ipcMain.handle('authenticate', async (event, email, password, createAccount = false, displayName = '') => {

    let result = { success: false, data: {} };

    // Try to authenticate
    try {

        // Send POST request and await for response
        let res;

        if (createAccount) {    // Sign up
            res = await axios.post('user', {
                email: email,
                password: password,
                displayName: displayName
            })
        }
        else {  // Sign in
            res = await axios.post('auth', {
                email: email,
                password: password
            });
        }

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
    catch (error) { result.data = handleRequestError(error) }
    
    // Return the result object
    return result;
})

// Handles a request to clear the account store (by signing out or deleting the account).
// Involves backend communication.
ipcMain.handle('sign-out', async (event, deleteAccount=false, password='') => {

    let result = { success: false, data: {} };

    // Try to delete account
    try {
        
        if (deleteAccount) {

            // Send DELETE request and await for response
            let res = await axios.delete('user', { // Second arg is a config object with property data
                data: {
                    password: password,
                }
            });

            // If sign-in was successful
            if (res.status === 200) {
                store.reset('account');
                result.success = true;
            }
            
        }
        else {
            store.reset('account');
            result.success = true;
        }
    }
    // Handle errors
    catch (error) { result.data = handleRequestError(error) }

    // Return the result object
    return result;
})

// Handles a request to authenticate the user (by signing in or signing up).
// Involves backend communication.
ipcMain.handle('update-account-info', async (event, email, displayName, password) => {

    let result = { success: false, data: {} };

    // Try to authenticate
    try {
        
        // Send PUT request and await for response
        let res = await axios.put('user', {
            email: email,
            displayName: displayName,
            password: password,
        });

        // If sign-in was successful
        if (res.status === 202) {

            let accountInfo = {
                email: res.data.email,
                displayName: res.data.displayName
            }
            store.set('account.accountInfo', accountInfo)

            result.success = true;
        }

    }
    // Handle errors
    catch (error) { result.data = handleRequestError(error) }
    
    // Return the result object
    return result;
})


/**
 * Helper functions
 */

/**
 * Handle an exception from making an API call via axios
 * @param {Error} error 
 * @returns an object with the reason and message of the error
 */
function handleRequestError(error) {

    let resultData;

    // Check if backend returned a reason and message for the error
    let responseMessageExists = 
        error.response 
        && error.response.data 
        && error.response.data.reason 
        && error.response.data.message;

    if (responseMessageExists) {
        resultData = {
            reason: error.response.data.reason,
            message: error.response.data.message
        }
    }

    else {
        // Else, return generic error
        resultData = {
            reason: 'RESPONSE_ERR',
            message: error.toString()
        }
    }
    return resultData;

}


/**
 * Insights store-related IPC event handlers
 * These event handlers retrieve and update the data usage store on behalf of the renderer.
 */
// Handles a request to retrieve the insights store
ipcMain.on('get-insights-store', (event) => {
    event.returnValue = store.get('insights');
});