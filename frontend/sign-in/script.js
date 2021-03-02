const { ipcRenderer } = require('electron')

var form = document.getElementById("sign-up-form");

document.getElementById('signInButton').addEventListener('click', () => { 
    
    var username = form.elements[0].value;
    var password = form.elements[1].value;

    ipcRenderer.invoke('sign-in', username, password)

})  
    