const { ipcRenderer } = require('electron')

document.getElementById('accountButton').addEventListener('click', () => { 
    ipcRenderer.invoke('account-button-action')
})