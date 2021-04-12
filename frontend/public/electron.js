const { app, BrowserWindow, ipcMain, dialog } = require('electron'); 
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev'); 
const path = require('path'); 
const soundPlayer = require('sound-play');

require('./store');
require('./timerSystem.js');
require('./breakSystem.js');
require('./accountPopups');

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
        center: true,
        minHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maxHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maximizable: false,
        title: "iCare",
        backgroundColor: '#222222', 
        show: false,
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

    global.mainWindow.on('ready-to-show', () => global.mainWindow.show());

    // Prevent opening new windows
    mainWindow.webContents.on('new-window', (e, url) => {
        e.preventDefault()
    })

    // Handle closing through a confirmation dialog
    mainWindow.on('close', (e) => {
        const closeConfirm = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            title: 'iCare',
            message: 'Close iCare?',
            detail: 'You will not receive notifications when the app is closed.',
            buttons: ['Yes', 'No'],
            defaultId: 1
        })
        // Don't close window if selected button is 'Yes'
        if (closeConfirm === 1) e.preventDefault();
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

