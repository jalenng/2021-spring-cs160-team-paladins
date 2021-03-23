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

        let userEmail = req.body.username;
        




        
        
      });

      
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);


