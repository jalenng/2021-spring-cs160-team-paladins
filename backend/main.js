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

      // Database Connection
      let db = require('./db.js')
      const userDB = new db("localhost", "newuser", "", "iCare");

      // ---------------------------------

     router.post('/login', function(req, res) {
       let username = req.body.username;
       let password = req.body.password;
       console.log(username, password)
       userDB.checkLogIn(username, password)
     })

      //--------------------------
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);


