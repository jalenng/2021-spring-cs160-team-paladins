(
  function() {
      "use strict";
      let express = require('express');
      let app = express();

      app.get('/', function(req, res) {
         res.send("Hello world!");
      });

      app.get('/login', function(req, res) {
        res.send("Goodbye world!");
     });
      
      let server = app.listen(3000, function () {
          console.log('Express server listening on port ' + server.address().port);
      });
      module.exports = app;
  }()
);