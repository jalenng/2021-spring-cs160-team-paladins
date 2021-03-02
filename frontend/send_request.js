var form = document.getElementById("sign-up-form");
var submitButton = document.getElementById('test'); 

submitButton.addEventListener('click', () => { 
    
    const axios = require('axios');

    axios
    .post('localhost', {
        first: form.elements[0].value,
        second: form.elements[1].value
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
        console.log("WELP")
    })

})
    

    
    
    