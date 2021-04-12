const { time } = require('console');
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
    let apiM = require('./api_methods.js');
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
      let dName = req.body.displayName;

      let success = true;

      // Checks password length
      if (password.length < 8) { success = false; }
      else {
        // CRYPTO: Encrypt password and store in the database
        let dec_pass = atob(password);
        let encrypted_pass = cryptr.encrypt(dec_pass);
        if (email === null || password === null || dName === false) { success = false; }
        else { success = await userDB.createUser(email, encrypted_pass, dName).then((result) => { return result; }); }
      }

      // Sends results based on create user success
      if (success == true) {
        let tokenValue = await userToken.createToken(email).then((res) => { return res });
        res.status(200).send({ token: tokenValue, accountInfo: { email: email, displayName: dName } });
      }
      else {
        let array = await api_methods.postCreateUser(dName, password).then((result) => { return result; }); 
        res.status(401).send({ reason: array[0], message: array[1] });
      }
    })

    // User tries to login
    router.post('/auth', async function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
      let dName = ""

      // Checks crypto pass
      let dec_pass = atob(password)
      let success = await userDB.getPassword(email).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } else { return false }
      })
      
      // Sends result based on login success
      if (success == true) {
        let tokenValue = await userToken.createToken(email).then((res) => { return res });
        dName = await userDB.getDisplayName(email).then((res) => { return res; });
        
        res.status(200).send({ token: tokenValue,  accountInfo: { email: email, displayName: dName } });
      }
      else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Authentication invalid" }) }

    })
 
    // Gets preferences of user
    router.get('/pref/:user', async function (req, res) {
      let token = req.headers.auth.token;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------
      
      // Get Preferences
      let notiInterval = await userDB.getNotiInterval(email).then((result) => { return result; })
      let notiSound = await userDB.getNotiSound(email).then((result) => { return result; })
      let notiSoundOn = await userDB.getNotiSoundOn(email).then((result) => { return result; })
      let dUsageOn = await userDB.getDataUsageOn(email).then((result) => { return result; })
      let aUsageOn = await userDB.getAppUsageOn(email).then((result) => { return result; })
 
      // Send to frontend
      if (notiInterval != false && notiSound != false && notiSoundOn != false) {
        res.status(200).send({
          notifications: { enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
          dataUsage: { trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: dUsageOn }
        });
      }
      else {
        res.status(504).send({
          reason: "RETRIEVAL_FAILED", 
          message: "Couldn't retrieve preferences." 
        });
      }
 
    });
 
    // Saves the user preferences (incomplete)
    router.put('/pref/:user', async function (req, res) {
      let token = req.headers.auth.token;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------

      // Set Preferences
      let notiInterval = req.body.data.notifications.interval;
      let notiSound = req.body.data.notifications.sound;
      let notiSoundOn = req.body.data.notifications.enableSound;
      let dUsageOn = req.body.dataUsage.enableWeeklyUsageStats;
      let aUsageOn = eq.body.dataUsage.trackAppUsageStats;
 
      // Save user preferences in database
      let success1 = await userDB.setNotiInterval(email, notiInterval).then((result) => { return result; })
      let success2 = await userDB.setNotiSound(email, notiSound).then((result) => { return result; })
      let success3 = await userDB.setNotiSoundOn(email, notiSoundOn).then((result) => { return result; })
      let success4 = await userDB.setDataUsageOn(email, dUsageOn).then((result) => { return result; })
      let success5 = await userDB.setAppUsageOn(email, aUsageOn).then((result) => { return result; })

      // Send to frontend
      if (success1 == success2 == success3 == success4 == success5 == true) {
        res.status(200);
      }
      else {
        res.status(504).send({
          reason: "SAVE_FAILED", 
          message: "Couldn't save all preferences."
        });
      }
    });

    // Gets data usage (incomplete)
    router.get('/data/:user', async (req, res) => {
      let token = req.headers.auth.token;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------
      let timePeriod = req.body.data.timePeriod;    // TODAY, WEEK, MONTH, ALL

      // Get Usage Data
      let dUsage = await userDB.getDataUsage(email, timePeriod).then((result) => { return result; });
      let aUsage = await userDB.getAppUsage(email, timePeriod).then((result) => { return result; });

      if (dUsage != false && aUsage != false) {
        res.status(200).send({ 
          dataUsage: dUsage, 
          appUsage: aUsage      // Sends JSONs
        })
      }
      else {
        res.status(504).send({
          reason: "GET_REQUEST_FAILED", 
          message: "Couldn't get data usage" 
        })
      }
    });

    // Updates the data/app usage of user (incomplete)
    router.put('/data/:user', async (req, res) => {
      let token = req.headers.auth.token;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------

      // Sets Update Data
      let todayScreenTime = req.body.data.dailyDataUsage.screenTime;
      let todaynumBreaks = req.body.data.dailyDataUsage.numBreaks;
      let todayAppUsage = req.body.data.dailyAppUsage;
      
      let duSuccess = await userDB.setDataUsage(email, todayScreenTime, todaynumBreaks);


      let ausuccess = ""
      // For app usage, use dictionary key-value pairing in a for loop to insert into the database
      // If one fails, success == false




      if (dusuccess == true && auSuccess == true) {
        res.status(200);
      }
      else {
        res.status(504).send({
          reason: "UPDATE_FAILED", 
          message: "Couldn't update data usage" 
        })
      }

    });

    // Change email (incomplete)
    router.put('/user/:user', async (req, res) => {

      let token = req.headers.auth.token;
      let oldEmail = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        oldEmail = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (oldEmail == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------

      // Set new password
      let newEmail = req.body.data.email;
      let pass = req.body.data.password;

      // Checks password
      let dec_pass = atob(pass)
      let success = await userDB.getPassword(email).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } 
        else { return false }
      })
      
      // Response Code (check password)
      if (success == true) {
        success = await userDB.changeEmail(oldEmail, newEmail);
      }
      else {
        res.status(401).send({ 
          reason: "INVALID_CREDENTIALS", 
          message: "Your password is incorrect." 
        });
      }
      
      // Response Code (check changeEmail success)
      if (success == true) {
        res.status(200);
      }
      else {
        res.status(401).send({ 
          reason: "BAD_EMAIL", 
          message: "The email is already in use." 
        });
      }

    
    });

    // Delete user (incomplete)
    router.delete('/user', async (req, res) => {
      let token = req.headers.auth.token;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------
      // Delete User
      let pass = req.body.data.password;

      // Checks crypto pass
      let dec_pass = atob(pass)
      let success = await userDB.getPassword(email).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } 
        else { return false }
      })
      
      // Response Code
      if (success == true) { res.status(200); }
      else { res.status(504).send({ reason: "INVALID_CREDENTIALS", message: "Couldn't delete account." }); }
    });
 
    //--------------------------
 
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });
 
    module.exports = app;
  }()
);

 // Database Connection
 let db = require('./db.js');
 let userDB = new db("localhost", "newuser", "password", "iCare");

 // API Methods
 let apiM = require('./api_methods.js');
 let api_methods = new apiM();

 // Crypto Requirements
 var atob = require('atob');
 var Cryptr = require('cryptr'),
 cryptr = new Cryptr('myTotalySecretKey'); 

 // Token Methods
 let tokenClass = require('./token.js')
 let userToken = new tokenClass();


async function test() {
  
  let value;
  console.log(value)

  if (typeof value !== 'undefined') {
    console.log("Success")
  }
  else {
  console.log("Fail")
}


}

//test();
