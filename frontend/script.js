var form = document.getElementById("sign-up-form");
var submitButton = document.getElementById('test'); 

submitButton.addEventListener('click', () => { 
    
    var username = form.elements[0].value;
    var password = form.elements[1].value;

    const axios = require('axios');

    axios
    .post('http://localhost:3000', {
        username: username,
        password: password
    })
    .then(res => {
        console.log("Note:")
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.log("Error:")
        console.error(error)
    })

})  
    