(
  function() {
      "use strict";
      let express = require('express');
      let bodyParser = require('body-parser')
      let multer = require('multer')
      let path = require('path')
      let upload = multer()
      let db = require('./db.js')
      let app = express();

      // gets form data.
      app.get('/', function(req, res){
        res.render('form');
      });

      // for parsing application/json
      app.use(bodyParser.json()); 

      // when user posts, displays form data
      app.post('/', function(req, res) {
        console.log(req.body)
        console.log(req.body.username)
        console.log(req.body.password)

        logIn(req.body.username, req.body.password)

      });
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);