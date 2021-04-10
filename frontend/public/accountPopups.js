const { BrowserWindow, ipcMain } = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path'); 

// Sign-in popup
ipcMain.handle('show-sign-in-popup', event => {

    const signInWindow = new BrowserWindow({
        width: 380,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: "Sign in",
        backgroundColor: '#222222',
        parent: global.mainWindow,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }

    })
    signInWindow.menuBarVisible = false
    
    signInWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/signin'
        : `file://${path.join(__dirname, '../build/index.html#signin')}`
    ); 
    
    signInWindow.on('ready-to-show', () => signInWindow.show());

})


// Delete account popup
ipcMain.handle('show-delete-account-popup', event => {

    const deleteAccountWindow = new BrowserWindow({
        width: 380,
        height: 240,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: "Delete account",
        backgroundColor: '#222222',
        parent: global.mainWindow,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }

    })
    deleteAccountWindow.menuBarVisible = false
    
    deleteAccountWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/deleteAccount'
        : `file://${path.join(__dirname, '../build/index.html#deleteAccount')}`
    ); 
    
    deleteAccountWindow.on('ready-to-show', () => deleteAccountWindow.show());

})


// Edit account popup
ipcMain.handle('show-edit-account-popup', event => {

    const editAccountWindow = new BrowserWindow({
        width: 380,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: "Edit account",
        backgroundColor: '#222222',
        parent: global.mainWindow,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }

    })
    editAccountWindow.menuBarVisible = false
    
    editAccountWindow.loadURL( 
        isDev
        ? 'http://localhost:3000#/editAccount'
        : `file://${path.join(__dirname, '../build/index.html#editAccount')}`
    ); 
    
    editAccountWindow.on('ready-to-show', () => editAccountWindow.show());

})