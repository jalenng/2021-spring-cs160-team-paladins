const { route } = require('./index.js');

(
  function() {
    "use strict";
    let express = require('express');
    let bodyParser = require('body-parser')
    let router = express.Router()
    let multer = require('multer')
    let path = require('path')
    let upload = multer()
    let app = express();

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json())
    app.use('/', router)

    // Database Connection
    let db = require('./db.js')
    const userDB = new db("localhost", "newuser", "", "iCare");

    // ---------------------------------
    
    // Our server listens for POST requests.

    // User tries to login.
    router.post('/login', function(req, res) {
      let username = req.body.username;
      let password = req.body.password;
      console.log(username, password)
      userDB.checkLogIn(username, password)
    })

    // User tries to create account.
    router.post('/signup', function(req, res) {
      let username = req.body.email;
      let password = req.body.password;
      console.log(email, password)
      //userDB.createUser(username, password)
    })

    //--------------------------
    
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });

      module.exports = app;
  }()
);


