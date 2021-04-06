const { route } = require('./index.js');
 
(
  function () {
    "use strict";
    let express = require('express');
    let bodyParser = require('body-parser')
    let router = express.Router()
    let multer = require('multer')
    let path = require('path')
    let upload = multer()
    let app = express();
 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
    app.use('/', router)
 
    // Database Connection
    let db = require('./db.js');
    let userDB = new db("localhost", "newuser", "", "iCare");

    // API Methods
    let apiM = require('/api_methods.js');
    let api_methods = new apiM();

    // Crypto Requirements
    var atob = require('atob');
    var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey'); 

    // Token Methods
    let tokenClass = require('./token.js')
    let userToken = new tokenClass();

    // ---------------------------------
    // Our server listens for POST requests.
    // ---------------------------------

    // User tries to create account.
    router.post('/user', async function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
      let displayName = req.body.displayName;

      // CRYPTO: Encrypt password and store in the database
      let dec_pass = atob(password);
      let encrypted_pass = cryptr.encrypt(dec_pass);
      if (email === null || password === null || displayName === false) { success = false; }
      else { success = await userDB.createUser(email, encrypted_pass, displayName).then((result) => { return result; }); }
      
      // Sends results based on create user success
      if (success == true) {
        let tokenValue = await userToken.createToken(email).then((res) => { return res });
        res.status(201).send({ 
          status: 201, 
          data: { token: tokenValue, email: email, displayName: displayName }
        });
      }
      else {
        let array = await api_methods.postCreateUser(displayName, password).then((result) => { return result; }); 
        res.status(401).send({
          status: 401, 
          data: { reason: array[0], message: array[1] }
        });
      }
    })

    // User tries to login (test send)
    router.post('/auth', async function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
      let dName = ""

      // Checks crypto pass
      let dec_pass = atob(password)
      let success = await userDB.getPassword(email).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } 
        else { return false }
      })
      
      // Sends result based on login success
      if (success == true) {
        let tokenValue = await userToken.createToken(email).then((res) => { return res });
        dName = await userDB.getDisplayName(email).then((res) => { return res; });

        res.status(200).send({
          status: 200, 
          data: { token: tokenValue, accountInfo: { email: email, displayName: dName } }
        });
      }
      else {
        res.status(401).send({
          reason: "INVALID_CREDENTIALS",
          message: "Authentication invalid"
        })
      }

    })
 
    // Gets preferences of user
    router.get('/pref/:user', async function (req, res) {

      let token = req.body.auth.token;

      // Gets token from frontend
      // Somehow convert token to user email to get info out of db
 
      let email = "Convert from token";
      let notiInterval = await userDB.getNotiInterval(email).then((result) => { return result; })
      let notiSound = await userDB.getNotiSound(email).then((result) => { return result; })
      let notiSoundOn = await userDB.getNotiSoundOn(email).then((result) => { return result; })
      let dUsageOn = await userDB.getDataUsageOn(email).then((result) => { return result; })
      let aUsageOn = await userDB.getAppUsageOn(email).then((result) => { return result; })
 
      // Send to frontend
      if (notiInterval != false && notiSound != false && notiSoundOn != false) {
        res.status(200).send({
          status: 200, data: {
            notifications: { enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
            dataUsage: { trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: dUsageOn }
          }
        });
      }
      else {
        res.status(504).send({
          status: 504, 
          data: { reason: "RETRIEVAL_FAILED", message: "Couldn't retrieve preferences." }
        });
      }
 
    });
 
    // Saves the user preferences
    router.put('/pref/:user', async function (req, res) {
 
      let token = req.body.auth.token;

      // Get data from frontend (token, notification interval, sound, and boolean (sound on/off))
      // Somehow convert token to user email to get info out of db

      

      let email = "Convert from token";
      let notiInterval = req.body.data.interval
      let notiSound = req.body.data.sound
      let notiSoundOn = req.body.data.enableSound
      let dUsageOn = "get from frontend"
      let aUsageOn = "get from frontend"
 
      // Save user preferences in database
      let success1 = await userDB.setNotiInterval(email, notiInterval).then((result) => { return result; })
      let success2 = await userDB.setNotiSound(email, notiSound).then((result) => { return result; })
      let success3 = await userDB.setNotiSoundOn(email, notiSoundOn).then((result) => { return result; })
      let success4 = await userDB.setDataUsageOn(email, dUsageOn).then((result) => { return result; })
      let success5 = await userDB.setAppUsageOn(email, aUsageOn).then((result) => { return result; })

      // Send to frontend
      if (success1 == success2 == success3 == success4 == success5 == true) {
        res.status(200).send({ status: 200 })
      }
      else {
        res.status(504).send({
          status: 504, 
          data: { reason: "SAVE_FAILED", message: "Couldn't save all preferences." }
        });
      }
    });

    // Testing get/set for datausage (Works!)
    //userDB.getDataUsage('basic@gmail.com', 'day').then((result) => { console.log(result); });
    //userDB.getDataUsage('basic@gmail.com', 'week').then((result) => { console.log(result); });
    //userDB.getDataUsage('basic@gmail.com', 'month').then((result) => { console.log(result); });
 
    //userDB.setDataUsage('basic@gmail.com', 20, 3).then((result) => { console.log(result); });
 
    //--------------------------
 
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });
 
    module.exports = app;
  }()
);
 

