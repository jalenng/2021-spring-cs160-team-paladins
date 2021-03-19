(
  function() {
      "use strict";
      let express = require('express');
      let bodyParser = require('body-parser')
      let multer = require('multer')
      let path = require('path')
      let upload = multer()

      // Database Connection
      let db = require('./db.js')
      const userDB = new db("localhost", "newuser", "password", "iCare");
      // ---------------------------------

      let app = express();

      // gets form data.
      app.get('/', function(req, res){
        res.render('form');
      });

      // for parsing application/json
      app.use(bodyParser.json()); 

      // when user posts, displays form data
      app.post('/',  async (req, res) => {

        console.log("1")

        // Create user
        await userDB.createUser(req.body.username, req.body.password). then((result) => {
          if (result) {
            console.log("2 Created Account")
          }
          else {
            console.log("2 Email already in use")
          }
          console.log("3")
        })
        

        /*

        // Testing Login Credentials-----------------------
        await userDB.checkLogIn(req.body.username, req.body.password).then((result) => {
          console.log("2 - login? " + result)
          console.log("3")
        }).catch((err) => {
          console.log(err)
        })

        */
        
        console.log("4")
        
        

      });

      
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);


