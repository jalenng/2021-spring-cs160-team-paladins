const mysql = require('mysql');

export class database {
 
    constructor(host, user, pass, db) {

        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: host,
            user: user,
            password: pass,
            database: db
        })

        console.log("=> Connenction Pool Created");
    }

    // Creates a new user (inserts into db)
    createUser(givenEmail, givenPass) {

        let query = "INSERT INTO Users VALUES ('" + givenEmail + "', '" + givenPass + "')";
        this.pool.query(query, function(err) {
            if (err) { console.log("The given email, " + givenEmail + ", is already in use."); } 
                else {  console.log("Account Created"); }
        })
        return;
    }

    // Checks LogIn Information
    checkLogIn(givenEmail, givenPass) {

        let query = "SELECT * FROM Users WHERE email='" + givenEmail + "'";
        let email = "", pass = "";

        this.pool.query(query, function(err, result) {
            if (err) { 
                console.log("Error: " + err); 
            } 
            else {  
                let splits = (JSON.stringify(result)).split('\"', 9); 
                email = splits[3];
                pass = splits[7];
            }

            // Test Login
            if (givenEmail === email && givenPass === pass) { 
                console.log("You have logged in.") 
            }
            else { 
                console.log("Wrong email or password."); 
            }
        });
        return;
    }

    // Ends the process
    endConnection() {
        this.close()
    }

}


const db = new database("localhost", "newuser", "password", "nodeTest");


//db.createUser("hello@gmail.com", "helloPass");
//db.createUser("hello", "helloPass");
//db.checkLogIn("hello@gmail.com", "helloPass");
//db.endConnection();

