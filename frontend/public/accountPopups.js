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
        nodeIntegration: true,
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
    
    signInWindow.menuBarVisible = false;
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

    deleteAccountWindow.menuBarVisible = false;
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
    
    editAccountWindow.menuBarVisible = false;
    editAccountWindow.on('ready-to-show', () => editAccountWindow.show());

})