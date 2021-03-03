// Modules to control application life and create native browser window
const { ipcMain, app, BrowserWindow } = require('electron')
const path = require('path')
const axios = require('axios')

function createWindow() {

    // Main iCare Window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }

    })
    mainWindow.loadFile('index.html')
    mainWindow.menuBarVisible = false
    mainWindow.webContents.openDevTools()
    
    // Handle event for when account button is clicked
    ipcMain.handle('account-button-action', event => {

        // Sign in Window
        const signInWindow = new BrowserWindow({
            width: 380,
            height: 380,
            modal: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            title: "Sign in",
            parent: mainWindow,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true
            }

        })
        signInWindow.menuBarVisible = false
        signInWindow.loadFile('sign-in/index.html')   
        
    })
    
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// Event handler for signing in
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