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
    let userDB = new db("localhost", "newuser", "password", "iCare");

    // ---------------------------------
    // Our server listens for POST requests.
    // ---------------------------------
 
      // Testing get/set for datausage (Works!)
      //userDB.getDataUsage('basic@gmail.com', 'day').then((result) => { console.log(result); });
      //userDB.getDataUsage('basic@gmail.com', 'week').then((result) => { console.log(result); });
      //userDB.getDataUsage('basic@gmail.com', 'month').then((result) => { console.log(result); });
 
      //userDB.setDataUsage('basic@gmail.com', 20, 3).then((result) => { console.log(result); });
 
 
     // User tries to login (test send)
     router.post('/auth', async function(req, res) {
       let username = req.body.username;
       let password = req.body.password;
       console.log(username, password)
 
       // Gets success
       let success = await userDB.checkLogIn(username, password).then((result) => {
           return result;
       })
 
       // Sends result based on login success
       if (success) {
            res.status(200).send({status: "success", 
                data: {token: "<some long string>"} 
            });
       }
       else {
            res.status(401).send({status: "failure", 
                data: {reason: "INVALID CREDENTIALS", message: "Authentication invalid"} 
            });
       }
 
     })

    // User tries to create account.
    router.post('/signup', function(req, res) {
      let username = req.body.email;
      let password = req.body.password;
      console.log(email, password)
      //userDB.createUser(username, password)
    })
 
 
     // Gets preferences of user
     router.get('/pref/:user', async function(req, res) {
 
        // Gets token from frontend
        // Somehow convert token to user email to get info out of db
 
        let email = "Convert from token";
        let notiInterval = await userDB.getNotiInterval(email).then((result) => { return result; })
        let notiSound = await userDB.getNotiSound(email).then((result) => { return result; })
        let notiSoundOn = await userDB.getNotiSoundOn(email).then((result) => { return result; })
        let dUsageOn = await userDB.getDataUsageOn(email).then((result) => { return result; })
        let aUsageOn = await userDB.getAppUsageOn(email).then((result) => { return result; })
 
        // Send to frontend
        if (displayName != false && notiInterval != false && notiSound != false && notiSoundOn != false) {
            res.status(200).send({status: "success", data: {
                notifications: {enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
                dataUsage: {trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: dUsageOn}
            }});
        }
        else {
            res.status(504).send({status: "failure", data: {
                reason: "RETRIEVAL_FAILED", 
                message: "Couldn't retrieve preferences"
            }});
        }
 
     });
 
     // Saves the user preferences
     router.put('/pref/:user', async function(req, res) {
 
        // Get data from frontend (token, notification interval, sound, and boolean (sound on/off))
        // Somehow convert token to user email to get info out of db
        let email = "Convert from token";
        let dName = "get from frontend"
        let notiInterval = "get from frontend"
        let notiSound = "get from frontend"
        let notiSoundOn = "get from frontend"
        let dUsageOn = "get from frontend"
 
        // Save user preferences in database
        let success1 = await userDB.setDisplayName(email, displayName).then((result) => { return result; })
        let success2 = await userDB.setNotiInterval(email, notiInterval).then((result) => { return result; })
        let success3 = await userDB.setNotiSound(email, notiSound).then((result) => { return result; })
        let success4 = await userDB.setNotiSoundOn(email, notiSoundOn).then((result) => { return result; })
        let success5 = await userDB.setDataUsageOn(email, dUsageOn).then((result) => { return result; })
 
        // Send to frontend
        if (success1 == success2 == success3 == success4 == success5 == true) {
            res.status(202).send({status: "success"})
        }
        else {
            res.status(504).send({status: "failure", 
                data: {reason: "CANNOT_SAVE", message: "Couldn't save all preferences."} 
            });
        }
     });

    //--------------------------
    
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });

      module.exports = app;
  }()
);
