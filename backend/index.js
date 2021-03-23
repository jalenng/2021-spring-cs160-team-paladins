// var sql = require('mysql')

// var con = sql.createConnection({
//     host : 'localhost',
//     user : 'newuser',
//     password : 'password',
//     database : 'nodetest'
// });

// Variable to decide whether you have logged in or not.
function logIn(givenEmail, givenPass) { 

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

(
  function() {
      "use strict";
      let express = require('express');
      let multer = require('multer')
      let path = require('path')
      let upload = multer()
      //   let db = require('./db.js')
      let app = express();

      // for parsing application/json
      app.use(express.json());

      // // when user posts, displays form data
      // app.post('/', function(req, res) {
      //   logIn(req.body.username, req.body.password)
      // }); 

      app.get('/LoginMenu', (req, res) => { 
          let username = req.query.username;
          let password = req.query.password;
          console.log(username, password)
      })
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);


