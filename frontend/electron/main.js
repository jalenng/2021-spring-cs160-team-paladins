const { app, BrowserWindow, ipcMain } = require('electron'); 
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev'); 
const path = require('path'); 

const { TimerSystem } = require('./timerSystem.js');
const { BreakSystem } = require('./breakSystem.js');

const DEFAULT_WINDOW_SIZE = {
    defaultWidth: 800,
    defaultHeight: 500
}
require('./stores');

global.mainWindow; 

/**
 * Timer model
 */
global.timerSystem = new TimerSystem();
global.breakSystem = new BreakSystem();

global.timerSystem.on('timer-end', () => {
    global.breakSystem.start();
})

global.breakSystem.on('break-end', () => {
    global.timerSystem.start();
})


/**
 * Functions for creating windows
 */
// Main window
function createWindow() { 

    // Main window
    let mainWindowState = windowStateKeeper(DEFAULT_WINDOW_SIZE);

    global.mainWindow = new BrowserWindow({ 
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width, 
        height: mainWindowState.height,
        minHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maxHeight: DEFAULT_WINDOW_SIZE.defaultHeight,
        maximizable: false,
        title: "iCare",
        backgroundColor: '#333333', 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });

    mainWindowState.manage(global.mainWindow);
    
    global.mainWindow.menuBarVisible = false;
    
    global.mainWindow.loadURL(
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
        backgroundColor: '#333333',
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
        ? 'http://localhost:3000/signin'
        : `file://${path.join(__dirname, '../build/login/index.html')}`
    ); 

})

// Toggle timer
ipcMain.handle('timer-toggle', () => {
    global.timerSystem.toggle();
})

ipcMain.on('get-timer-status', (event) => {
    event.reply('receive-timer-status', global.timerSystem.getStatus());
});

ipcMain.on('get-break-status', (event) => {
    event.reply('receive-break-status', global.breakSystem.getStatus());
});
