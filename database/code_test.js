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
let con = mysql.createConnection({
    host: "localhost",
    user: "newuser",
    password: "password",
    database: "nodeTest"
});

// Connect to DB
con.connect(function(err) {
    if (err) { return console.error('error: ' + err.message) }
    console.log("Connected");

    // Test User Table
    getTable("Users");
    insertTable("Users", "('hello@gmail.com', 'helloPass')");

    getDataFromUserTable("hello@gmail.com");
});

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
function insertTable(table, values) {
    let query = "INSERT INTO " + table + " VALUES " + values;

    con.query(query, function(err, result) {
        if (err) { 
            console.log("The given email is already in use.");
        } else {
            console.log("Row(s) Inserted");
        }
    });
}

// Get data from table
function getDataFromUserTable(condition) {

    let query = "SELECT * FROM Users WHERE email='" + condition + "'";

    con.query(query, function(err, result) {
        if (err) { 
            console.log(err);
        } else {
            let r = JSON.stringify(result);
            let splits = r.split('\"', 9)
            let email = splits[3];              // Gets email
            let pass = splits[7];               // Gets password

             //console.log(r);                     // [{"email":"hello@gmail.com","pass":"hello"}]
            console.log(email)                  // Gets email: hello@gmail.com
            console.log(pass)                   // Gets password: helloPass

        }
    });
}






