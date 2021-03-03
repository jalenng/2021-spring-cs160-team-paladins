<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 23b9f4f (modify scripts to run in main process through IPC events)
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
<<<<<<< HEAD

const server = require('../backend/server.js')
=======
const { ipcRenderer } = require('electron')

document.getElementById('accountButton').addEventListener('click', () => { 
    ipcRenderer.invoke('account-button-action')
})
>>>>>>> 23b9f4f0af19c299820bb563cee552c567c30fb8
=======
>>>>>>> parent of 23b9f4f (modify scripts to run in main process through IPC events)
