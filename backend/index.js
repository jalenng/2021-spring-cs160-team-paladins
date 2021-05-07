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
    router.get('/prefs', async function (req, res) {
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
      let tUsageOn = await userDB.getTimerUsageOn(email)
      let aUsageOn = await userDB.getAppUsageOn(email)
 
      // Response Codes
      if (notiInterval == notiSound == notiSoundOn == tUsageOn == aUsageOn == true) {
        res.status(200).send({
          notifications: { enableSound: notiSoundOn, interval: notiInterval, sound: notiSound, },
          timerUsage: { trackAppUsageStats: aUsageOn, enableWeeklyUsageStats: tUsageOn }
        });
      }
      else { res.status(504).send({ reason: "RETRIEVAL_FAILED", message: "Couldn't retrieve preferences." }); }
 
    });
 
    // Saves the user preferences
    router.put('/prefs', async function (req, res) {
      let token = req.headers.auth;
      let notiInterval = req.body.notifications.interval;
      let notiSound = req.body.notifications.sound;
      let notiSoundOn = req.body.notifications.enableSound;
      let tUsageOn = req.body.timerUsage.enableWeeklyUsageStats;
      let aUsageOn = req.body.timerUsage.trackAppUsageStats;
      let email = ""
 
      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Save user preferences in database 
      let success1 = await userDB.setNotiInterval(email, notiInterval).then((r) => { return r; })
      let success2 = await userDB.setNotiSound(email, notiSound).then((r) => { return r; })
      let success3 = await userDB.setNotiSoundOn(email, notiSoundOn).then((r) => { return r; })
      let success4 = await userDB.setTimerUsageOn(email, tUsageOn).then((r) => { return r; })
      let success5 = await userDB.setAppUsageOn(email, aUsageOn).then((r) => { return r; })

      // Send to frontend
      if (success1 == success2 == success3 == success4 == success5 == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Saved new user preferences." }); 
      }
      else { res.status(504).send({ reason: "SAVE_FAILED", message: "Couldn't save all preferences." }); }
    });

    // Gets data usage
    router.get('/data', async (req, res) => {
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Get Usage Data -------------------------
      let timePeriod = "WEEK";    // TODAY, WEEK, MONTH, ALL
      let tUsage = await userDB.getTimerUsage(email, timePeriod).then((r) => { return r; });
      let aUsage = await userDB.getAppUsage(email, timePeriod).then((r) => { return r; });

      // Response Codes (Sends JSONs)
      if ((tUsage != false && aUsage != false) || (tUsage.length === 0 && aUsage != false) 
          || (tUsage != false && aUsage.length === 0) || (tUsage.length === 0 && aUsage.length === 0)) { 
        res.status(200).send({ timerUsage: tUsage, appUsage: aUsage }) 
      }
      else { res.status(504).send({ reason: "GET_REQUEST_FAILED", message: "Couldn't get data/app usage." }) }
    });

    // Updates the data usage of user
    router.put('/data', async (req, res) => {
      let token = req.headers.auth;
      let email = ""

      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Update Timer Usage
      let dataUsage = req.body;
      let timerUsage = dataUsage.timerUsage;
      console.log('email' + email);
      let tuSuccess = await userDB.setTimerUsage(email, timerUsage.screenTime, timerUsage.timerCount, timerUsage.usageDate);

      // Update App Usage
      // let appUsage = req.body.appUsage;
      // let auSuccess = false;
      // auSuccess = await userDB.setAppUsage(email, 'VSCode', '50', new Date());

      // Response Codes
      if (tuSuccess == true) { 
        res.status(200).send({ reason: "SUCCESS", message: "Updated data/app usage" });  
      }
      else { res.status(504).send({ reason: "UPDATE_FAILED", message: "Couldn't update all data/app usage" }) }


      // for (const duObject of timerUsageObjects) {
      //   let row = JSON.parse(JSON.stringify(duObject));
      //   duSuccess = await userDB.settimerUsage(email, row.screenTime, row.numBreaks, row.usageDate)
      // }

      // Update App Usage
      // let appUsageObjects = req.body.appUsage;
      // let auSuccess = false;

      // for (const auObject of appUsageObjects) {
      //   let row = JSON.parse(JSON.stringify(auObject));
      //   auSuccess = await userDB.setAppUsage(email, row.appName, row.appTime, row.usageDate)
      // }

      // Response Codes
      // if (duSuccess == true && auSuccess == true) { 
      //   res.status(200).send({ reason: "SUCCESS", message: "Updated data/app usage" });  
      // }
      // else { res.status(504).send({ reason: "UPDATE_FAILED", message: "Couldn't update all data/app usage" }) }

    });

    // Get Insights
    router.get('/data/insights', async (req, res) => {
      let token = req.headers.auth;
      let email = ""
 
      // Check Token
      let ct = await api_methods.checkToken(token)
      if (Array.isArray(ct)) { res.status(401).send({ reason: ct[0], message: ct[1] }); return; }
      else { email = await userDB.getEmail(ct); }

      // Get Insights
      let insight = await api_methods.generateInsights(email);

      // Response Codes
      if (insight != false) { 
        res.status(200).send({ header: insight });  
      }
      else { res.status(504).send({ reason: "RETRIEVE_FAILED", message: "Insights could not be generated." }) }
    });

    //--------------------------
 
    let server = app.listen(3000, function () {
      console.log('Express server listening on port ' + server.address().port);
    });
 
    module.exports = app;
  }()
);

//-------------------------------------



