const { BrowserWindow, ipcMain } = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path'); 

// Shared popup window options
const sharedWindowOptions = {
    width: 380,
    resizable: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: '#222222',
    parent: global.mainWindow,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false
    }
}

// Sign-in popup
ipcMain.handle('show-sign-in-popup', event => {

    const signInWindow = new BrowserWindow({
        ...sharedWindowOptions,
        height: 420,
        title: "Sign in",
    })
    signInWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/signin'
        : `file://${path.join(__dirname, '../build/index.html#signin')}`
    ); 
    
    signInWindow.removeMenu();
    signInWindow.on('ready-to-show', () => signInWindow.show());

})


// Delete account popup
ipcMain.handle('show-delete-account-popup', event => {

    const deleteAccountWindow = new BrowserWindow({
        ...sharedWindowOptions, 
        height: 240,
        title: "Delete account"
    });
    
    deleteAccountWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/deleteAccount'
        : `file://${path.join(__dirname, '../build/index.html#deleteAccount')}`
    ); 

    deleteAccountWindow.removeMenu();
    deleteAccountWindow.on('ready-to-show', () => deleteAccountWindow.show());

})


// Edit account popup
ipcMain.handle('show-edit-account-popup', event => {

    const editAccountWindow = new BrowserWindow({
        ...sharedWindowOptions,
        height: 420,
        title: "Edit account"
    });
    
    editAccountWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/editAccount'
        : `file://${path.join(__dirname, '../build/index.html#editAccount')}`
    ); 
    
    editAccountWindow.removeMenu();
    editAccountWindow.on('ready-to-show', () => editAccountWindow.show());

})


// Timer popup
ipcMain.handle('show-timer-popup', event => {

    const timerPopupWindow = new BrowserWindow({
        ...sharedWindowOptions,
        width: 320,
        height: 400,
        title: "iCare",
        alwaysOnTop: true
    })
    timerPopupWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/popupTimer'
        : `file://${path.join(__dirname, '../build/index.html#popupTimer')}`
    ); 
    
    timerPopupWindow.removeMenu();
    timerPopupWindow.on('ready-to-show', () => timerPopupWindow.show());
    
})