'user strict'

var sql = require('mysql')

var con = sql.createConnection({
    host : 'localhost',
    user : 'newuser',
    password : 'password',
    database : 'nodetest'
});

con.connect(function(err) {
    if (err) throw error;
    else console.log('worked')
});

module.exports = {  
    con: con
};


// Variable to decide whether you have logged in or not.
let logIn = function(givenEmail, givenPass) { 

    // Connect to Database
    con.connect(function(err) {
        if (err) { return console.error('error: ' + err.message) }
        console.log("Connected");
        //insertTable("Users", "('hello@gmail.com', 'helloPass')");

        let email;
        let pass;
        getLogIn(givenEmail, function(err,data){
            if (err) { console.log("ERROR : ",err);  } 
            else {  email = data[0]; pass = data[1]; }    

            // Test Login
            if (givenEmail === email && givenPass === pass) { console.log("You have logged in.") }
            else { console.log("Wrong email or password."); }
        });


        // End Connection
        con.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
            });

        });
}

let insertUser = function(givenEmail, givenPass) { 

    // Connect to Database
    con.connect(function(err) {
        if (err) { return console.error('error: ' + err.message) }
        console.log("Connected");
        insertTable("Users", givenEmail, givenPass);

        // End Connection
        con.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
            });

        });
}


// Gets Email and Password from Database (if exists)
function getLogIn(givenEmail, callback) {

    let query = "SELECT * FROM Users WHERE email='" + givenEmail + "'";

    con.query(query, function(err, result) {
        if (err) 
            callback(err,null);
        else {
            let r = JSON.stringify(result);
            let splits = r.split('\"', 9)
            let ar = [splits[3], splits[7]]     // [email, pass]
            callback(null, ar);
        }
    })

}