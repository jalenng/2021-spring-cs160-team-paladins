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

    // ---------------------------------
    // Our server listens for POST requests.
    // ---------------------------------

    // User tries to create account.
    router.post('/user', async function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
      let dName = req.body.displayName;

      let success = false;

      // Checks password length
      if (typeof password === 'undefined') {
        res.status(401).send({ reason: "BAD_PASS", message: "Password is undefined." });
        return;
      }
      else if (email === null || password === null || dName === false) { success = false; }
      else if (password.length > 8) { 
        let dec_pass = atob(password);
        let encrypted_pass = cryptr.encrypt(dec_pass);
        success = await userDB.createUser(email, encrypted_pass, dName).then((result) => { return result; }); 
      }

      // Response Codes
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

      console.log(req.body)

      // Checks crypto pass
      let dec_pass = atob(password)
      let success = await userDB.getPassword(email).then((r) => {
        if (r != false) {
          let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } else { return false }
        }
        return false;
      })
      
      // Response Codes
      if (success == true) {
        let tokenValue = await userToken.createToken(email).then((res) => { return res });
        dName = await userDB.getDisplayName(email).then((res) => { return res; });
        
        res.status(200).send({ token: tokenValue,  accountInfo: { email: email, displayName: dName } });
      }
      else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Authentication invalid" }) }

    })
 
    // Gets preferences of user
<<<<<<< HEAD
    router.get('/pref/:user', async function (req, res) {
=======
    router.get('/pref', async function (req, res) {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
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
 
      // Response Codes
      if (notiInterval != false && notiSound != false && notiSoundOn != false) {
        res.status(200).send({
          notifications: { enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
          dataUsage: { trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: dUsageOn }
        });
      }
      else { res.status(504).send({ reason: "RETRIEVAL_FAILED", message: "Couldn't retrieve preferences." }); }
 
    });
 
    // Saves the user preferences (incomplete)
<<<<<<< HEAD
    router.put('/pref/:user', async function (req, res) {
=======
    router.put('/pref', async function (req, res) {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
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
        res.status(200).send({ reason: "SUCCESS", message: "Saved new user preferences" }); 
      }
      else { res.status(504).send({ reason: "SAVE_FAILED", message: "Couldn't save all preferences." }); }
    });

    // Gets data usage (incomplete)
<<<<<<< HEAD
    router.get('/data/:user', async (req, res) => {
=======
    router.get('/data', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
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

      // Response Codes (Sends JSONs)
      if (dUsage != false && aUsage != false) { res.status(200).send({ dataUsage: dUsage, appUsage: aUsage }) }
      else { res.status(504).send({ reason: "GET_REQUEST_FAILED", message: "Couldn't get data usage" }) }
    });

    // Updates the data/app usage of user (incomplete)
<<<<<<< HEAD
    router.put('/data/:user', async (req, res) => {
=======
    router.put('/data', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
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



      // Response Codes
      if (dusuccess == true && auSuccess == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Updated data/app usage" });  
      }
      else { res.status(504).send({ reason: "UPDATE_FAILED", message: "Couldn't update data usage" }) }

    });

<<<<<<< HEAD
    // Change email (incomplete)
    router.put('/user/:user', async (req, res) => {
=======
    // Change email
    router.put('/user', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
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
      let success = await userDB.getPassword(oldEmail).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true; } 
        else { return false }
      })

      // Response Code (check password)
      if (success == true) { success = await userDB.changeEmail(oldEmail, newEmail); }
      else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Your password is incorrect." }); }
      
      // Response Code (check changeEmail success)
      if (success == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Changed email" });  
      }
      else { res.status(401).send({ reason: "BAD_EMAIL", message: "The email is already in use." }); }
    });

    // Delete user
    router.delete('/user', async (req, res) => {
<<<<<<< HEAD

=======
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
      let email = ""
 
      // Checking the token
      if (typeof token !== 'undefined') {
        email = await userToken.getEmailFromToken(token);

        // Invalid Token
        if (email == false) { res.status(504).send({ reason: "INVALID_TOKEN",  message: "The token given is invalid" }); return; }

      } else {res.status(504).send({ reason: "INVALID_TOKEN", message: "No token was given." }); return; }

      //------------------------
<<<<<<< HEAD
      // Delete User
      let password = req.body.password;

      // Checks crypto pass
      let dec_pass = atob(password)
      let success = await userDB.getPassword(email).then((r) => {
        if (r != false) {
          let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } else { return false }
        }
=======
      
      // Checks crypto pass and deletes user
      let pass = req.body.data.password;
      let dec_pass = atob(pass)
      let success = await userDB.getPassword(email).then((r) => {
        let decryptPass = cryptr.decrypt(r)
        if (decryptPass == dec_pass) { return true } 
        else { return false }
>>>>>>> 99978f9 (updated token and 200 response code)
      })

      if (success == true) { success =await userDB.deleteAccount(email); }
      else { res.status(504).send({ reason: "BAD_PASSWORD", message: "Wrong password was given." }); }
      
      // Response Code
      if (success == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Deleted account" }); 
      }
      else { res.status(504).send({ reason: "INVALID_CREDENTIALS", message: "Couldn't delete account." }); }
    });
 
    //--------------------------
 
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });
 
    module.exports = app;
  }()
);

//-------------------------------------

/*
 // Database Connection
 let db = require('./db.js');
 let userDB = new db("localhost", "newuser", "password", "iCare");

 // API Methods
 let apiM = require('./api_methods.js');
 let api_methods = new apiM();

<<<<<<< HEAD
 // Crypto Requirements
 var atob = require('atob');
 var Cryptr = require('cryptr'),
 cryptr = new Cryptr('myTotalySecretKey'); 

 // Token Methods
 let tokenClass = require('./token.js')
 let userToken = new tokenClass();


 // WORKING 
 async function testCreate() {
  let email = 'test@gmail.com'
  let password = 'passpasspass';
  let dName = 'test';
<<<<<<< HEAD

  let success = true;

=======

  let success = true;

>>>>>>> ca128ad (testing code)
  // Checks password length
  if (password.length < 8) { success = false; }
  else {
    // CRYPTO: Encrypt password and store in the database
    let dec_pass = atob(password);
    let encrypted_pass = cryptr.encrypt(dec_pass);
    if (email === null || password === null || dName === false) { success = false; }
    else { success = await userDB.createUser(email, encrypted_pass, dName).then((result) => { return result; }); }
  }

  // Response Codes
  if (success == true) {
    console.log("Successful Creation")
  }
  else {
    let array = await api_methods.postCreateUser(dName, password).then((result) => { return result; }); 
    console.log(array)
  }
 }

<<<<<<< HEAD

 // WORKING
 async function testLogin() {
  let email = 'te@gmail.com'
  let password = 'passpasspass';
  let dName = '';

  // Checks crypto pass
  let dec_pass = atob(password)
  let success = await userDB.getPassword(email).then((r) => {
    if (r != false) {
      let decryptPass = cryptr.decrypt(r)
    if (decryptPass == dec_pass) { return true } else { return false }
    }
  })
  
  // Response Codes
  if (success == true) {
    let tokenValue = await userToken.createToken(email).then((res) => { return res });
    dName = await userDB.getDisplayName(email).then((res) => { return res; });

=======

 // WORKING
 async function testLogin() {
  let email = 'test@gmail.com'
  let password = 'passpasspass';
  let dName = '';

  // Checks crypto pass
  let dec_pass = atob(password)
  let success = await userDB.getPassword(email).then((r) => {
    let decryptPass = cryptr.decrypt(r)
    if (decryptPass == dec_pass) { return true } else { return false }
  })
  
  // Response Codes
  if (success == true) {
    let tokenValue = await userToken.createToken(email).then((res) => { return res });
    dName = await userDB.getDisplayName(email).then((res) => { return res; });

>>>>>>> ca128ad (testing code)
    console.log("Sucessful Login DN: " + dName)
    
  }
  else { console.log("Failed Login") }
 }


=======

 // WORKS!
 async function testDataUsage() {

  let email = "basic@gmail.com"
  //let duSuccess = await userDB.setDataUsage(email, 270, 5);
  //console.log("Success? " + duSuccess);

  let value = await userDB.getDataUsage(email, "ALL TIME")
  let listofvalues = await api_methods.getStatistics(value).then((res) => { return res; })

  console.log("Average Screen Time: " + listofvalues[0]);
  console.log("Min Screen Time Spend: " + listofvalues[1]);
  console.log("Max Screen Time Spend: " + listofvalues[2]);
  console.log();
  console.log("Average Timer Count: " + listofvalues[3]);
  console.log("Min Timer Count: " + listofvalues[4]);
  console.log("Max Timer Count: " + listofvalues[5]);
 }



>>>>>>> 0e70f85 (mocha testing and data usage aggregation)
async function test() {

  testDataUsage()
  
<<<<<<< HEAD
<<<<<<< HEAD
  //await testCreate()
=======
  await testCreate()
>>>>>>> ca128ad (testing code)
  await testLogin()
=======
>>>>>>> 0e70f85 (mocha testing and data usage aggregation)

}


<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
//test()
=======
test();
>>>>>>> ca128ad (testing code)
=======
test()
>>>>>>> 0e70f85 (mocha testing and data usage aggregation)
=======
//test()
*/
>>>>>>> 1430444 (fixed create user bugs)
