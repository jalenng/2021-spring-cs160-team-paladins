// Assertions
let assert = require('assert')

// Database Connection
let db = require('./db.js')
const userDB = new db("localhost", "newuser", "", "iCare");

// API Methods
let apiM = require('./api_methods.js');
let api_methods = new apiM();

// Token
let tokenClass = require('./token.js')
let userToken = new tokenClass();

// Crypto Requirements
var atob = require('atob');
const { AssertionError, strict } = require('assert');
var Cryptr = require('cryptr'),
cryptr = new Cryptr('myTotalySecretKey'); 

// Mocha Tests --------------------------------

let goodEmail = "goodgood@gmail.com";       // Reuse for create, login, delete
let goodDisplay = "goodDisplay"
let badEmail = 'existexist@gmail.com';
let newEmail = "newnewEmail@gmail.com"     // Use for change email
let goodPass = "password12345";         // Reuse for create, login, delete
let failEmail = "idontexist@gmail.com"  // Reuse for failing
let success = "";

let id = "testemail@gmail.com";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTgzODEwNDksImp3dGlkIjoibGZqYmoiLCJhdWRpZW5jZSI6IlRFU1QiLCJkYXRhIjoidGVzdCIsImV4cCI6MTYxODM4NDY0OX0.TTrYqESQPCrDN9hJSJ9p_iACOrD7grZ4u8NF2zzU3qk";
let falseToken = "false-token";
let idFromToken = "test";
let unexpectedID = "unexpectedemail@gmail.com";

// Create Account Test (works for both existing/non-existing email)
describe('Create new account: ', () => {

    let dec_pass = atob(goodPass);
    let encrypted_pass = cryptr.encrypt(dec_pass);
    

    // Bad Email (Email already in use)
    describe('(Fail) Email already in use [' + badEmail + ']: ', () => {
        it ('should return false as email already exists', async () => {
            await userDB.createUser(badEmail, encrypted_pass, goodDisplay).then((result) => { return result; });
            success = await userDB.createUser(badEmail, encrypted_pass, goodDisplay).then((result) => { return result; });
            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Good Email (Email not in use)
    describe('(Success) Email not in use [' + goodEmail + ']: ', () => {
        it('should return true as email does not exists', async () => {
            success = await userDB.createUser(goodEmail, encrypted_pass, goodDisplay).then((result) => { return result; });
            assert.strictEqual(success, true, 'success is true');
        });
    });

});

// Get Password
describe('Get password with email',  () => {

    // Get password with non-existent email
    describe('(Fail) Non-existent account [' + failEmail + ']: ',  () => {
        it('should return false as there is no such email', async () => {
            success = await userDB.getPassword(failEmail).then((r) => {
                if (r != false) { return true; }
                return false;
            });
            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Get password with existing email
    describe('(Success) Existing account [' + goodEmail + ']: ',  () => {
        it('should return false as there is no such email', async () => {
            let dec_pass = atob(goodPass)
            success = await userDB.getPassword(goodEmail).then((r) => {
                let decryptPass = cryptr.decrypt(r);
                if (decryptPass == dec_pass) { return true; } else { return false; }
            });

            assert.strictEqual(success, true, 'success is true');
        });
    });

});

// Get Email and ID 
describe('Get user ID and email', () => {

    // Checks if user id is returned (changes for every test so we only test creation)
    describe('Get ID from email [' + badEmail + ']: ', () => {
        it('should return user id', async () => {
            let id = await userDB.getID(badEmail);
            if (id != false) { success = true; } else { success = false }
            assert.strictEqual(success, true, 'id exists')
        });
    });

    // Gets email
    describe('Get email from ID', () => {
        it('should return user id', async () => {
            let id = await userDB.getID(badEmail);
            let idEmail = await userDB.getEmail(id);
            assert.strictEqual(idEmail, badEmail, 'email linked to id: ' + badEmail )
        });
    });
});

// Create Token
describe('Create Token and get ID from token', () => {
    describe('Verify token created for ' + id, async() => {
        it('Verify token is not empty', async () => {
            res_token = await userToken.createToken(id).then((res) => { return res });
            assert.notStrictEqual(res_token, "", 'Generated token is empty');
        })
        it('Verify generated token is for the expected email', async () => {
            res_id = await userToken.getIDFromToken(res_token).then((res) => { return res });
            assert.strictEqual(id, res_id, 'Email retrieved from generated token does not match [wanted: ' + id + ', received: ' + res_id +']');
        })
        it('Verify generated token is not for other emails', async () => {
            res_id = await userToken.getIDFromToken(res_token).then((res) => { return res });
            assert.notStrictEqual(unexpectedID, res_id);
        });
    });       
  
    // Verify getIDFromToken
    describe('Verify ID retrieved from a valid token', async() => {
        it('Verify expected ID is retrieved', async () => {
            res_id = await userToken.getIDFromToken(token);
            assert.strictEqual(res_id, idFromToken, 'ID retrieved from valid token does not match [wanted: ' + idFromToken + ', received: ' + res_id +']');
        });
    })
  
    describe('Verify ID failed to retrieve from an invalid token' , async() => {
        it('Verify ID retrieved does not match', async () => {
            res_id = await userToken.getIDFromToken(falseToken);
            assert.notStrictEqual(res_id, id, 'IDFromToken does not match with givenID');
        });
    });
 });

// Change Email
describe('Change email', () => {

    // Change email [already used email]
    describe('(Fail) Already used email [' + badEmail + ']: ', () => {
        it('should return false as email is already in use', async () => {
            success = await userDB.changeEmail(goodEmail, badEmail);
            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Change email [good email]
    describe('(Success) Existing email [' + goodEmail + ']: ', () => {
        it ('should return true as email does exist', async () => {
            success = await userDB.changeEmail(goodEmail, newEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

    // Change email [non-existent email]
    describe('(Success) Non-existent email [' + failEmail + ']: ', () => {
        it('should return true as email does not exist and changes nothing', async () => {
            success = await userDB.changeEmail("idontexist@gmail.com", newEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

});


// Get/Set Display Name
describe('Display name', () => {

    let newDisplay = "newDisplay";

    // Get Display Name of newEmail
    describe('(Success) Get display name from [' + newEmail + ']', () => {
        it('should return ' + goodDisplay, async () => {
            success = await userDB.getDisplayName(newEmail).then((r) => { return r; });
            assert.strictEqual(success, goodDisplay, 'success is true');
        })
    })

    // Set Display Name of newEmail
    describe('(Success) Set display name of [' + newEmail + '] to [' + newDisplay + ']', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setDisplayName(newEmail, newDisplay).then((r) => { return r; });
            assert.strictEqual(success, true, 'success is true');
        })
    })

    // Get Display Name of newEmail
    describe('(Success) Get new display name from [' + newEmail + ']', () => {
        it('should return ' + newDisplay, async () => {
            success = await userDB.getDisplayName(newEmail).then((r) => { return r; });
            assert.strictEqual(success, newDisplay, 'success is true');
        });
    });

});


// Get/Set Notification Interval
describe('Notification Interval (user preferences)', () => {

    let notiInterval = "";
    let newInterval = 30;
    
    // Get default notification interval of newEmail (20 minutes)
    describe('(Success) Get notification interval from [' + newEmail + ']', () => {
        it('should return 20 (default timer)', async () => {
            notiInterval = await userDB.getNotiInterval(newEmail).then((r) => { return r; });
            assert.strictEqual(notiInterval, 20,  'default notification interval is 20 minutes')
        })
    });

    // Set default notification interval of newEmail (30 minutes)
    describe('(Success) Set notification interval of [' + newEmail + '] to 30 minutes', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiInterval(newEmail, newInterval).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get default notification interval of newEmail (20 minutes)
    describe('(Success) Get notification interval from [' + newEmail + ']', () => {
        it('should return 30 (new timer)', async () => {
            notiInterval = await userDB.getNotiInterval(newEmail).then((r) => { return r; });
            assert.strictEqual(notiInterval, newInterval,  'new notification interval is 30 minutes')
        })
    });

});


// Get/Set Notification Sound
describe('Notification Sound (user preferences)', () => {

    let notiSound = "";
    let newSound = "/newSound.ogg";
    
    // Get default notification sound of newEmail (Leaf)
    describe('(Success) Get notification sound from [' + newEmail + ']', () => {
        it('should return Leaf', async () => {
            notiSound = await userDB.getNotiSound(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSound, "/Leaf.ogg",  'default notification sound is /Leaf.ogg')
        })
    });

    // Set notification sound of newEmail (30 minutes)
    describe('(Success) Set notification sound of [' + newEmail + '] to 30 minutes', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiSound(newEmail, newSound).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get notification sound of newEmail (newSound)
    describe('(Success) Get notification sound from [' + newEmail + ']', () => {
        it('should return newSound', async () => {
            notiSound = await userDB.getNotiSound(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSound, newSound,  'new notification sound is ' + newSound)
        })
    });

});

// Get/Set Notification Sound On
describe('Notification Sound  On (user preferences)', () => {

    let notiSoundOn = "";
    
    // Get default 'notification sound on' boolean of newEmail (true)
    describe('(Success) Get notification sound on from [' + newEmail + ']', () => {
        it('should return true', async () => {
            notiSoundOn = await userDB.getNotiSoundOn(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSoundOn, true,  'notification sound on = true')
        })
    });

    // Set 'notification sound on' boolean of newEmail (false)
    describe('(Success) Set notification sound on of [' + newEmail + '] to false', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiSoundOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'notification sound on' boolean of newEmail (false)
    describe('(Success) Get notification sound on from [' + newEmail + ']', () => {
        it('should return false', async () => {
            notiSoundOn = await userDB.getNotiSoundOn(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSoundOn, false,  'notification sound on = false')
        })
    });

});

let timePeriod = "WEEK"

let timerUsageObjects = [
    {
        "screenTime": 50,
        "numBreaks": 4,
        "usageDate": '2021-04-19'
    },
    {
        "screenTime": 48,
        "numBreaks": 2,
        "usageDate": '2021-04-10'
    }
]

describe('Timer Usage', () => {

    // Gets the default timer usage (0, 0) of newEmail
    describe('(Success) Get timer usage of [' + newEmail + ']', () => {
        it('should return screenTime (0), timerCount (0)', async () => {

            let today = await userDB.getDate(0);

            let duo = await userDB.getTimerUsage(newEmail, timePeriod);
            for (const duObject of duo) {
                let row = JSON.parse(JSON.stringify(duObject));
                assert.strictEqual(row.screenTime, 0,  'screen time = 0')
                assert.strictEqual(row.timerCount, 0,  'timer count = 0')
                assert.strictEqual(row.usageDate, today + "T07:00:00.000Z", "usageDate")
            }
            
        });
    });


    // Sets the timer usage of newEmail
    for (const duObject of timerUsageObjects) {
        let row = JSON.parse(JSON.stringify(duObject));
        
        describe('(Success) Sets timer usage of [' + newEmail + ']', () => {
            it('should return true for ' + JSON.stringify(duObject), async () => {
                success = await userDB.setTimerUsage(newEmail, row.screenTime, row.numBreaks, row.usageDate)            
                assert.strictEqual(success, true,  'success is true')
            })
        });
    }
});



let appUsageObjects = [
    {
        "appName": "Discord",
        "appTime": 40,
        "usageDate": "2021-04-19"
    },
    {
        "appName": "Zoom",
        "appTime": 37,
        "usageDate": "2021-04-19"
    },
    {
        "appName": "Discord",
        "appTime": 431,
        "usageDate": "2021-04-01"
    },
    {
        "appName": "Zoom",
        "appTime": 87,
        "usageDate": "2021-04-13"
    }
]

// Get/Set App Usage
describe('Set App Usage', () => {

    // Sets the app usage of newEmail
    for (const auObject of appUsageObjects) {
        let row = JSON.parse(JSON.stringify(auObject));
        
        describe('(Success) Sets app usage of [' + newEmail + ']', () => {
            it('should return true for ' + JSON.stringify(auObject), async () => {
                success = await userDB.setAppUsage(newEmail, row.appName, row.appTime, row.usageDate)
                assert.strictEqual(success, true, 'success is true')
            })
        });
    }

});


// Get/Set Timer Usage On
describe('Timer Usage  On (user preferences)', () => {

    let timerUsageOn = "";
    
    // Get default 'timer usage on' boolean of newEmail (true)
    describe('(Success) Get timer usage on from [' + newEmail + ']', () => {
        it('should return true', async () => {
            timerUsageOn = await userDB.getTimerUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(timerUsageOn, true,  'timer usage on = true')
        })
    });

    // Set 'timer usage on' boolean of newEmail (false)
    describe('(Success) Set timer usage  on of [' + newEmail + '] to false', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setTimerUsageOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'timer usage on' boolean of newEmail (false)
    describe('(Success) Get timer usage on from [' + newEmail + ']', () => {
        it('should return false', async () => {
            timerUsageOn = await userDB.getTimerUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(timerUsageOn, false,  'timer usage on = false')
        })
    });

});


// Get/Set App Usage On
describe('App Usage  On (user preferences)', () => {

    let appUsageOn = "";
    
    // Get default 'app usage on' boolean of newEmail (true)
    describe('(Success) Get app usage on from [' + newEmail + ']', () => {
        it('should return true', async () => {
            appUsageOn = await userDB.getAppUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(appUsageOn, true,  'app usage on = true')
        })
    });

    // Set 'app usage on' boolean of newEmail (false)
    describe('(Success) Set app usage  on of [' + newEmail + '] to false', () => {
        it('should return true (set works)', async () => {
            success = await userDB.setAppUsageOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'app usage on' boolean of newEmail (false)
    describe('(Success) Get app usage on from [' + newEmail + ']', () => {
        it('should return false', async () => {
            appUsageOn = await userDB.getAppUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(appUsageOn, false,  'app usage on = false')
        })
    });

});


// Delete Account Test
describe('Delete account', () => {

    // Deletes a non-existent account
    describe('(Success) Non-existent account [' + failEmail + ']: ', () => {
        it('should return false as email does not exist', async () => {
            success = await userDB.deleteAccount(failEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

    // Deletes an account [Good Password]
    describe('(Success) Good Password [' + newEmail + ']', () => {
        it('should return true as email and password match', async () => {
            success = await userDB.deleteAccount(newEmail);
            assert.strictEqual(success, true, 'success is true');
            await userDB.deleteAccount(badEmail);
        });
    });

});