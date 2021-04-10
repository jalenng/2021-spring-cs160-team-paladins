const { app, BrowserWindow, ipcMain, dialog } = require('electron'); 
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
require('./accountPopups');

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
        backgroundColor: '#222222', 
        show: false,
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
