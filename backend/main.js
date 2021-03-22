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

        // Test: UserPreferences dataUsageOn (Getter/Setter) - Success
        let dataValue = await userDB.getDataUsageOn(userEmail)
        console.log("Data Usage On? -" + dataValue)

        await userDB.setDataUsageOn(userEmail, !dataValue).then( () => {
          console.log("3 Changed dataUsageOn")
        })

        await userDB.getDataUsageOn(userEmail).then((result) => {
          console.log("Data Usage On? -" + result)
        })
        

        /*
        // Test: UserPreferences notiSoundOn (Getter/Setter) - Success
        let notiValue = await userDB.getNotiSoundOn(userEmail)
        console.log("Notification Sound On? -" + notiValue)

        await userDB.setNotiSoundOn(userEmail, !notiValue).then( () => {
          console.log("3 New Notification Sound On Set")
        })

        await userDB.getNotiSoundOn(userEmail).then((result) => {
          console.log("Notification Sound On? -" + result)
        })
        */


        /*
        // Test: UserPreferences notiInterval (Getter/Setter) - Success
        await userDB.getNotiInterval(userEmail).then((result) => {
          if (result > 0)   // Tests if return value is an int!
              console.log("Successfully Turned to Int: " + result);
        })

        await userDB.setNotiInterval(userEmail, 30).then(() => {
          if (result) {
            console.log("3 New Notification Timer Interval Set")
          }
        });

        await userDB.getNotiInterval(userEmail).then((result) => {
          console.log("Successfully Turned to Int: " + result);
        })
        */
        
        


        /*
        // Test: UserPreferences displayName  (Getter/Setter) - Success
        await userDB.getDisplayName(userEmail).then((result) => {
          console.log(result)
        });

        await userDB.setDisplayName(userEmail, "New Display Name").then((result) => {
          if (result) {
            console.log("3 New Display Name Set")
          }
        });

        await userDB.getDisplayName(userEmail).then((result) => {
          console.log(result)
        });
        */
        


        /*
        // Test: Create User (Success)
        await userDB.createUser(userEmail, req.body.password).then((result) => {
          if (result) {
            console.log("2 Created Account")
          }
          else {
            console.log("2 Email already in use")
          }
          console.log("3")
        })
        */
        

        
        /*
        // Test: Check Login Credentials (Success)
        await userDB.checkLogIn(userEmail, req.body.password).then((result) => {
          console.log("2 - login? " + result)
          console.log("3")
        }).catch((err) => {
          console.log(err)
        })
        */

        

      });

      
      
      let server = app.listen(3000, function () {
        console.log('Express server listening on port ' + server.address().port);
      });

      module.exports = app;
  }()
);


