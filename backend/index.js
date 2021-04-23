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

      // Checks for undefined inputs
      for (const item of [["email", email], ["password", password], ["display_name", dName]]) {
        let checkValues =  await api_methods.chkValues(item[0], item[1])
        if (Array.isArray(checkValues)) {
          res.status(401).send({ reason: checkValues[0], message: checkValues[1] }); 
          return;
        }
      }

      // Check Password Length
      if (password.length > 8) { 
        let encrypted_pass = await api_methods.encryptPass(password);
        success = await userDB.createUser(email, encrypted_pass, dName).then((result) => { return result; }); 
      } else {
        res.status(401).send({ reason: "BAD_PASSWORD", message: "Your password must be at least 8 characters long." });
        return;
      }

      // Response Codes
      if (success == true) {
        let userID = await userDB.getID(email).then((r) => { return r; });
        let tokenValue = await userToken.createToken(userID).then((r) => { return r; });
        res.status(201).send({ token: tokenValue, accountInfo: { email: email, displayName: dName } });
      }
      else {
        res.status(401).send({ reason: "BAD_EMAIL", message: "Email already in use." });
      }
    })

    // User tries to login
    router.post('/auth', async function (req, res) {
      let email = req.body.email;
      let password = req.body.password;

      // Checks for undefined email input
      let checkValues =  await api_methods.chkValues("email", email)
      if (Array.isArray(checkValues)) {
        res.status(401).send({ reason: checkValues[0], message: checkValues[1] }); 
        return;
      }
  
      // Checks password, Response Codes
      let success = await api_methods.checkPass(password, email).then((r) => { return r; });
      
      if (success == true) {
        let userID = await userDB.getID(email).then((r) => { return r; });
        let tokenValue = await userToken.createToken(userID).then((r) => { return r; });
        let dName = await userDB.getDisplayName(email).then((r) => { return r; });
        
        res.status(200).send({ token: tokenValue,  accountInfo: { email: email, displayName: dName } });
      }
      else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Authentication invalid." }) }

    });

    // Change email and display name
    router.put('/user', async (req, res) => {
      let token = req.headers.auth;
      let newEmail = req.body.email;
      let newDisplay = req.body.displayName;
      let pass = req.body.password;
      let oldEmail = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { oldEmail = await userDB.getEmail(ct) }

      // Checks for undefined inputs
      for (const item of [["email", newEmail], ["display_name", newDisplay]]) {
        let checkValues =  await api_methods.chkValues(item[0], item[1])
        if (Array.isArray(checkValues)) {
          res.status(401).send({ reason: checkValues[0], message: checkValues[1] }); 
          return;
        }
      }

      // Check password, Response Codes
      let checkPass = await api_methods.checkPass(pass, oldEmail)
      if (checkPass == true) {
        let dnSuccess = await userDB.setDisplayName(oldEmail, newDisplay)
        let ceSuccess = await userDB.changeEmail(oldEmail, newEmail)
        
        if (dnSuccess == ceSuccess == true) { 
          res.status(202).send({ email: newEmail, displayName: newDisplay }); 
        }
        else { res.status(401).send({ reason: "BAD_EMAIL", message: "The email is already in use." }); }
      }
      else { res.status(401).send({ reason: checkPass[0], message: checkPass[1] }); }

    });

    // Gets email and display name
    router.get('/user', async (req, res) => {
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Response Code
      if (email != false) {
        let dName = await userDB.getDisplayName(email).then((r) => { return r; })
        res.status(200).send({ email: email, displayName: dName });
      }
      else {
        res.status(401).send({ reason: "RETRIEVAL_FAILED", message: "Couldn't retrieve user information." });
      }
    });
    
    // Delete user
    router.delete('/user', async (req, res) => {
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Checks crypto pass, Deletes User, Response Codes
      let pass = req.body.password;
      let checkPass = await api_methods.checkPass(pass, email).then((r) => { return r; });

      if (checkPass == true) { 
        let success = await userDB.deleteAccount(email).then((r) => { return r; }); 
        if (success == true) { res.status(200).send({ reason: "SUCCESS", message: "Deleted account" }); }
        else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Couldn't delete account." }); }
      }
      else { res.status(401).send({ reason: checkPass[0], message: checkPass[1] }); }
    });

    ///------------------------------------------------------------------------
 
    // Gets preferences of user
<<<<<<< HEAD
<<<<<<< HEAD
    router.get('/pref/:user', async function (req, res) {
=======
    router.get('/pref', async function (req, res) {
>>>>>>> 99978f9 (updated token and 200 response code)
=======
    router.get('/prefs', async function (req, res) {
>>>>>>> 79ab3e7 (reorganized code)
      let token = req.headers.auth;
      let email = ""
 
      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }
      
      // Get Preferences -------------------------
      let notiInterval = await userDB.getNotiInterval(email)
      let notiSound = await userDB.getNotiSound(email)
      let notiSoundOn = await userDB.getNotiSoundOn(email)
      let dUsageOn = await userDB.getDataUsageOn(email)
      let aUsageOn = await userDB.getAppUsageOn(email)
 
      // Response Codes
      if (notiInterval == notiSound == notiSoundOn == dUsageOn == aUsageOn == true) {
        res.status(200).send({
          notifications: { enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
          dataUsage: { trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: dUsageOn }
        });
      }
      else { res.status(504).send({ reason: "RETRIEVAL_FAILED", message: "Couldn't retrieve preferences." }); }
 
    });
 
<<<<<<< HEAD
    // Saves the user preferences (incomplete)
<<<<<<< HEAD
<<<<<<< HEAD
    router.put('/pref/:user', async function (req, res) {
=======
    router.put('/pref', async function (req, res) {
>>>>>>> 99978f9 (updated token and 200 response code)
=======
=======
    // Saves the user preferences
>>>>>>> adcf8d9 (checks, postman fail cases)
    router.put('/prefs', async function (req, res) {
>>>>>>> 79ab3e7 (reorganized code)
      let token = req.headers.auth;
      let notiInterval = req.body.notifications.interval;
      let notiSound = req.body.notifications.sound;
      let notiSoundOn = req.body.notifications.enableSound;
      let dUsageOn = req.body.dataUsage.enableWeeklyUsageStats;
      let aUsageOn = req.body.dataUsage.trackAppUsageStats;
      let email = ""
 
      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Save user preferences in database 
      let success1 = await userDB.setNotiInterval(email, notiInterval).then((r) => { return r; })
      let success2 = await userDB.setNotiSound(email, notiSound).then((r) => { return r; })
      let success3 = await userDB.setNotiSoundOn(email, notiSoundOn).then((r) => { return r; })
      let success4 = await userDB.setDataUsageOn(email, dUsageOn).then((r) => { return r; })
      let success5 = await userDB.setAppUsageOn(email, aUsageOn).then((r) => { return r; })

      // Send to frontend
      if (success1 == success2 == success3 == success4 == success5 == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Saved new user preferences." }); 
      }
      else { res.status(504).send({ reason: "SAVE_FAILED", message: "Couldn't save all preferences." }); }
    });

<<<<<<< HEAD
    // Gets data usage (incomplete)
<<<<<<< HEAD
    router.get('/data/:user', async (req, res) => {
=======
=======
    // Gets data usage
>>>>>>> 6df2ca3 (preferences postman, finished test.js)
    router.get('/data', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Get Usage Data -------------------------
      let timePeriod = "WEEK";    // TODAY, WEEK, MONTH, ALL
      let dUsage = await userDB.getDataUsage(email, timePeriod).then((r) => { return r; });
      let aUsage = await userDB.getAppUsage(email, timePeriod).then((r) => { return r; });

      // Response Codes (Sends JSONs)
      if ((dUsage != false && aUsage != false) || (dUsage.length === 0 && aUsage != false) 
          || (dUsage != false && aUsage.length === 0) || (dUsage.length === 0 && aUsage.length === 0)) { 
        res.status(200).send({ dataUsage: dUsage, appUsage: aUsage }) 
      }
      else { res.status(504).send({ reason: "GET_REQUEST_FAILED", message: "Couldn't get data/app usage." }) }
    });

<<<<<<< HEAD
    // Updates the data/app usage of user (incomplete)
<<<<<<< HEAD
    router.put('/data/:user', async (req, res) => {
=======
=======
    // Updates the data/app usage of user
>>>>>>> 6df2ca3 (preferences postman, finished test.js)
    router.put('/data', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      //------------------------
      // Update Data Usage
      let dataUsageObjects = req.body.dataUsage;
      let duSuccess = false;

      for (const duObject of dataUsageObjects) {
        let row = JSON.parse(JSON.stringify(duObject));
        duSuccess = await userDB.setDataUsage(email, row.screenTime, row.numBreaks, row.usageDate)
      }

      // Update App Usage
      let appUsageObjects = req.body.appUsage;
      let auSuccess = false;

      for (const auObject of appUsageObjects) {
        let row = JSON.parse(JSON.stringify(auObject));
        auSuccess = await userDB.setAppUsage(email, row.appName, row.appTime, row.usageDate)
      }

      // Response Codes
      if (duSuccess == true && auSuccess == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Updated data/app usage" });  
      }
      else { res.status(504).send({ reason: "UPDATE_FAILED", message: "Couldn't update all data/app usage" }) }

    });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    // Change email (incomplete)
    router.put('/user/:user', async (req, res) => {
=======
=======
    ///------------------------------------------------------------------------

>>>>>>> e6dd6ac (clean code, test create, login, change email, delete APIs)
    // Change email
    router.put('/user', async (req, res) => {
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
      let oldEmail = ""

      // Checks Token -------------------------
      let checkToken = await api_methods.checkToken(token).then((r) => {
        if (Array.isArray(r)) { res.status(401).send({ reason: r[0], message: r[1] }); return false; }
        else {  oldEmail = r; return true; }
      })
      if (checkToken == false) { return; }

      // Checks crypto pass and changes email -------------------------
      let newEmail = req.body.data.email;
      let pass = req.body.data.password;
      let checkPass = await api_methods.checkPass(pass, oldEmail).then((r) => { return r; });

      if (checkPass == true) {
        let success = await userDB.changeEmail(oldEmail, newEmail).then((r) => { return r; });
        if (success == true) { 
          let tokenValue = await userToken.createToken(newEmail).then((r) => { return r; });
          res.status(200).send({ token: tokenValue, reason: "SUCCESS", message: "Changed email" });  
        }
        else { res.status(409).send({ reason: "BAD_EMAIL", message: "The email is already in use." }); }
      }
      else { res.status(401).send({ reason: checkPass[0], message: checkPass[1] }); }

    });

    // Delete user
    router.delete('/user', async (req, res) => {
<<<<<<< HEAD

=======
>>>>>>> 99978f9 (updated token and 200 response code)
      let token = req.headers.auth;
      let email = ""

      // Checks Token -------------------------
      let checkToken = await api_methods.checkToken(token).then((r) => {
        if (Array.isArray(r)) { res.status(401).send({ reason: r[0], message: r[1] }); return false; }
        else { email = r; return true; }
      })
      if (checkToken == false) { return; }

<<<<<<< HEAD
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
=======
      // Checks crypto pass and deletes user -------------------------
      let pass = req.body.data.password;
      let checkPass = await api_methods.checkPass(pass, email).then((r) => { return r; });
>>>>>>> e6dd6ac (clean code, test create, login, change email, delete APIs)

      if (checkPass == true) { 
        let success = await userDB.deleteAccount(email).then((r) => { return r; }); 
        if (success == true) { res.status(200).send({ reason: "SUCCESS", message: "Deleted account" }); }
        else { res.status(401).send({ reason: "INVALID_CREDENTIALS", message: "Couldn't delete account." }); }
      }
      else { res.status(401).send({ reason: checkPass[0], message: checkPass[1] }); }
    });
 
=======
    // Get Insights
    router.get('/data/insights', async (req, res) => {
      let token = req.headers.auth;
      let email = ""
 
      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Get Insights
      let insight = await api_methods.generateInsights();

      // Response Codes
      if (insight != false) { 
        res.status(200).send({ header: insight });  
      }
      else { res.status(504).send({ reason: "RETRIEVE_FAILED", message: "Insights could not be generated." }) }
    });

>>>>>>> 79ab3e7 (reorganized code)
    //--------------------------
 
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });
 
    module.exports = app;
  }()
);

//-------------------------------------

<<<<<<< HEAD
/*
 // Database Connection
 let db = require('./db.js');
 let userDB = new db("localhost", "newuser", "password", "iCare");

 // API Methods
 let apiM = require('./api_methods.js');
 let api_methods = new apiM();

<<<<<<< HEAD
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

=======
/*
>>>>>>> a82622e (added token based on user id)
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
*/

<<<<<<< HEAD


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
=======
/*
async function test() {

>>>>>>> 6df2ca3 (preferences postman, finished test.js)

}


<<<<<<< HEAD
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
=======
test()
>>>>>>> 6df2ca3 (preferences postman, finished test.js)
*/
<<<<<<< HEAD
>>>>>>> 1430444 (fixed create user bugs)
=======

>>>>>>> a82622e (added token based on user id)
=======
>>>>>>> 8ec33a6 (cleaned/updated index.js)
