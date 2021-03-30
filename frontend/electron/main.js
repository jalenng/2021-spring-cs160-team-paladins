const { app, BrowserWindow, ipcMain } = require('electron'); 
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev'); 
const path = require('path'); 

global.mainWindow; 

function createWindow() { 

    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 500
    });

    global.mainWindow = new BrowserWindow({ 
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width, 
        height: mainWindowState.height,
        minWidth: 400,
        minHeight: mainWindowState.height,
        maxHeight: mainWindowState.height,
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

// App event handlers
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
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

// Sign in
ipcMain.handle('sign-in', (event, username, password) => {

    axios
    .post('http://localhost:3000', {
        username: username,
        password: password
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })

})

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
    global.timer.toggle();
})

ipcMain.on('get-timer-status', (event) => {
    event.returnValue = global.timer.getStatus();
});

