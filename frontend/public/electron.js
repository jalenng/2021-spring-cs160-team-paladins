require ('hazardous');

const { app, BrowserWindow, ipcMain } = require('electron'); 
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev'); 
const path = require('path'); 
const soundPlayer = require('sound-play');

require('./store');
require('./timerSystem.js');
require('./breakSystem.js');

const DEFAULT_WINDOW_SIZE = {
    defaultWidth: 800,
    defaultHeight: 500
}

global.mainWindow; 

timerSystem.on('timer-end', () => breakSystem.start());
breakSystem.on('break-end', () => timerSystem.start());

/**
 * Functions for creating windows
 */
// Main window
function createWindow() { 

    // Main window
    let mainWindowState = windowStateKeeper(DEFAULT_WINDOW_SIZE);

    mainWindow = new BrowserWindow({ 
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width, 
        height: mainWindowState.height,
        minHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maxHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maximizable: false,
        title: "iCare",
        backgroundColor: '#222222', 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });

    mainWindowState.manage(mainWindow);
    
    mainWindow.menuBarVisible = false;
    
    mainWindow.loadURL(
        isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    ); 

    // Prevent opening new windows
    mainWindow.webContents.on('new-window', (e, url) => {
        e.preventDefault()
    })

} 


/**
 * App settings for when user logs in
 */
 app.setLoginItemSettings({
    openAtLogin: global.store.get('preferences.startup.startAppOnLogin'),
    enabled: global.store.get('preferences.startup.startAppOnLogin'),
    path: app.getPath('exe')
})


/**
 * Application event handlers
 */
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


/**
 * IPC event handlers
 * These event handlers are executed when another process invokes the event.
 */

// Log to main process's console
ipcMain.handle('log-to-console', (event, message) => {
    console.log(message);
})

// Show sign-in window when account button is clicked
ipcMain.handle('show-sign-in-popup', event => {

    // Sign in Window
    const signInWindow = new BrowserWindow({
        width: 380,
        height: 380,
        // modal: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: "Sign in",
        backgroundColor: '#222222',
        parent: global.mainWindow,
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

})

// Play sound file
ipcMain.handle('play-sound', (event, filepath) => {
    let fullFilepath = path.isAbsolute(filepath)
        ? filepath
        : path.join(__dirname, filepath);
    soundPlayer.play(fullFilepath);
});

// Get app info
ipcMain.on('get-app-info', (event) => {
    let appInfo = {
        name: app.getName(),
        version: app.getVersion()
    }
    event.reply('receive-app-info', appInfo);
})

