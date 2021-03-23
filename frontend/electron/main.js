const { app, BrowserWindow, ipcMain } = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path'); 

let mainWindow; 

function createWindow() { 

    mainWindow = new BrowserWindow({ 
        width: 800, 
        height: 500,
        backgroundColor: '#ffffff', 
        webPreferences: {
            nodeIntegration: true
        },
        

    }); 
    
    mainWindow.menuBarVisible = false;

    
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    
    mainWindow.loadURL(startURL); 

    // Handle event for when account button is clicked
    ipcMain.handle('account-button-action', event => {

        // Sign in Window
        const signInWindow = new BrowserWindow({
            width: 380,
            height: 380,
            // modal: true,
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


// IPC event handler for signing in
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