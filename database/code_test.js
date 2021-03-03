var mysql = require('mysql');

/**
 * You will get permission denied first. To fix this, we create a new user.
 * ---------------------------------------
 * First, go to MySQL shell: 
 *      Mysql JS>  \sql
 *      Mysql SQL>  \connect root@localhost
 * Then, create a new user in the shell:
 *      CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
 *      GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';
 *      FLUSH PRIVILEGES;
 * Finally, you can create the connection here using the new user and password on the localhost to use the correct database.
 */

// Create Connection
const con = mysql.createConnection({
    host: "localhost",
    user: "newuser",
    password: "password",
    database: "nodeTest"
});

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



// What is running!
//logIn("hello@gmail.com", "helloPass");
//insertUser("newUser@gmail.com", "userPass");
//logIn("newUser@gmail.com", "userPass")
//logIn("fail", "userPass")          // Should Fail


insertUser("new", "passs");
//logIn("new", "pasasss")




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


// Find a way to deal with the asychronous function of MySql and Javascript

//--------------------------Mess below-------------



// Manage Later
let runDB = function() {
    con.connect(function(err) {
        if (err) { return console.error('error: ' + err.message) }

        // End Connection
        con.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });

    });
    
}

// Test that the email and passwords match!
function testLogIn(givenEmail, givenPass) {

    let email;
    let pass;

    getLogIn(givenEmail, function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);            
        } else {            
            // code to execute on data retrieval
            email = data[0];
            pass = data[1];
        }    
        console.log("email: " + email )
        console.log(givenEmail)
        console.log("pass: " + pass )
        console.log(givenPass)

    });

    
    if (givenEmail === email) {
        console.log("TRUE RETURN")
        return true;
    }
    else{
        console.log("FALSE RETURN")
        return false;
    }
    
    


}



// Get data from user table
function getDataFromUserTable(condition) {

    let query = "SELECT * FROM Users WHERE email='" + condition + "'";

    con.query(query, function(err, result) {
        if (err) { 
            console.log(err);
        } else {
            let r = JSON.stringify(result);
            let splits = r.split('\"', 9)
            let ar = [splits[3], splits[7]]     // [email, pass]




            return ar;
        }
    });

}








// Get Table
function getTable(table) {
    let sT = "SELECT * FROM " + table

    con.query(sT, function(err, result) {
        if (err) { 
            console.log("This table, " + table + " does not exist.");
         } 
         else {
            console.log(table +" Table: ");
            console.log(result);
         }
    });
}

// Insert Into Table
function insertTable(table, email, pass) {
    let query = "INSERT INTO " + table + " VALUES ('" + email + "', '" + pass + "')";

    con.query(query, function(err, result) {
        if (err) { 
            console.log("The given email is already in use.");
        } else {
            console.log("Row(s) Inserted");
        }
    });
}







