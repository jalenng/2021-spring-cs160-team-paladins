var form = document.getElementById("sign-up-form");
var submitButton = document.getElementById('test'); 

submitButton.addEventListener('click', () => { 
    
    var username = form.elements[0].value;
    var password = form.elements[1].value;

    const axios = require('axios');

    axios
    .post('localhost', {
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
    

    
    
    