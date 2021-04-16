// Assertions
let assert = require('assert')

// Database Connection
let db = require('./db.js')
const userDB = new db("localhost", "newuser", "", "iCare");

// Crypto Requirements
var atob = require('atob');
var Cryptr = require('cryptr'),
cryptr = new Cryptr('myTotalySecretKey'); 

// Mocha Tests --------------------------------

let goodEmail = "good@gmail.com";       // Reuse for create, login, delete
let goodDisplay = "goodDisplay"
let badEmail = 'bad@gmail.com';
let newEmail = "newEmail@gmail.com"     // Use for change email
let goodPass = "password12345";         // Reuse for create, login, delete
let failEmail = "idontexist@gmail.com"  // Reuse for failing
let success = "";

// Create Account Test (works for both existing/non-existing email)
describe('Create new account: ', async () => {

    let dec_pass = atob(goodPass);
    let encrypted_pass = cryptr.encrypt(dec_pass);

    // Bad Email (Email already in use)
    describe('(Fail) Email already in use [' + badEmail + ']: ', async() => {
        it('should return false as email already exists', async () => {
            success = await userDB.createUser(badEmail, encrypted_pass, goodDisplay).then((result) => { return result; });
            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Good Email (Email not in use)
    describe('(Success) Email not in use [' + goodEmail + ']: ', async() => {
        it('should return true as email does not exists', async () => {
            success = await userDB.createUser(goodEmail, encrypted_pass, goodDisplay).then((result) => { return result; });
            assert.strictEqual(success, true, 'success is true');
        });
    });

});

// Get Password
describe('Get password with email', async () => {

    // Get password with non-existent email
    describe('(Fail) Non-existent account [' + failEmail + ']: ', async () => {
        it('should return false as there is no such email', async () => {
            success = await userDB.getPassword(failEmail).then((r) => {
                if (r != false) { return true; }
                return false;
            });

            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Get password with existing email
    describe('(Success) Existing account [' + goodEmail + ']: ', async () => {
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

// Change Email
describe('Change email', async () => {

    // Change email [already used email]
    describe('(Fail) Already used email [' + badEmail + ']: ', async () => {
        it('should return false as email is already in use', async () => {
            success = await userDB.changeEmail(goodEmail, badEmail);
            assert.strictEqual(success, false, 'success is false');
        });
    });

    // Change email [good email]
    describe('(Success) Existing email [' + goodEmail + ']: ', async () => {
        it ('should return true as email does exist', async () => {
            success = await userDB.changeEmail(goodEmail, newEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

    // Change email [non-existent email]
    describe('(Success) Non-existent email [' + failEmail + ']: ', async () => {
        it('should return true as email does not exist and changes nothing', async () => {
            success = await userDB.changeEmail("idontexist@gmail.com", newEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

});

// Get/Set Display Name
describe('Display name', async () => {

    let newDisplay = "newDisplay";

    // Get Display Name of newEmail
    describe('(Success) Get display name from [' + newEmail + ']', async () => {
        it('should return ' + goodDisplay, async () => {
            success = await userDB.getDisplayName(newEmail).then((r) => { return r; });
            assert.strictEqual(success, goodDisplay, 'success is true');
        })
    })

    // Set Display Name of newEmail
    describe('(Success) Set display name of [' + newEmail + '] to [' + newDisplay + ']', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setDisplayName(newEmail, newDisplay).then((r) => { return r; });
            assert.strictEqual(success, true, 'success is true');
        })
    })

    // Get Display Name of newEmail
    describe('(Success) Get new display name from [' + newEmail + ']', async () => {
        it('should return ' + newDisplay, async () => {
            success = await userDB.getDisplayName(newEmail).then((r) => { return r; });
            assert.strictEqual(success, newDisplay, 'success is true');
        });
    });

});

// Get/Set Notification Interval
describe('Notification Interval (user preferences)', async () => {

    let notiInterval = "";
    let newInterval = 30;
    
    // Get default notification interval of newEmail (20 minutes)
    describe('(Success) Get notification interval from [' + newEmail + ']', async () => {
        it('should return 20 (default timer)', async () => {
            notiInterval = await userDB.getNotiInterval(newEmail).then((r) => { return r; });
            assert.strictEqual(notiInterval, 20,  'default notification interval is 20 minutes')
        })
    });

    // Set default notification interval of newEmail (30 minutes)
    describe('(Success) Set notification interval of [' + newEmail + '] to 30 minutes', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiInterval(newEmail, newInterval).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get default notification interval of newEmail (20 minutes)
    describe('(Success) Get notification interval from [' + newEmail + ']', async () => {
        it('should return 30 (new timer)', async () => {
            notiInterval = await userDB.getNotiInterval(newEmail).then((r) => { return r; });
            assert.strictEqual(notiInterval, newInterval,  'new notification interval is 30 minutes')
        })
    });

});

// Get/Set Notification Sound
describe('Notification Sound (user preferences)', async () => {

    let notiSound = "";
    let newSound = "newSound";
    
    // Get default notification sound of newEmail (Leaf)
    describe('(Success) Get notification sound from [' + newEmail + ']', async () => {
        it('should return Leaf', async () => {
            notiSound = await userDB.getNotiSound(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSound, "Leaf",  'default notification sound is Leaf')
        })
    });

    // Set notification sound of newEmail (30 minutes)
    describe('(Success) Set notification sound of [' + newEmail + '] to 30 minutes', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiSound(newEmail, newSound).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get notification sound of newEmail (newSound)
    describe('(Success) Get notification sound from [' + newEmail + ']', async () => {
        it('should return newSound', async () => {
            notiSound = await userDB.getNotiSound(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSound, newSound,  'new notification sound is newSound')
        })
    });

});

// Get/Set Notification Sound On
describe('Notification Sound  On (user preferences)', async () => {

    let notiSoundOn = "";
    
    // Get default 'notification sound on' boolean of newEmail (true)
    describe('(Success) Get notification sound on from [' + newEmail + ']', async () => {
        it('should return true', async () => {
            notiSoundOn = await userDB.getNotiSoundOn(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSoundOn, true,  'notification sound on = true')
        })
    });

    // Set 'notification sound on' boolean of newEmail (false)
    describe('(Success) Set notification sound on of [' + newEmail + '] to false', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setNotiSoundOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'notification sound on' boolean of newEmail (false)
    describe('(Success) Get notification sound on from [' + newEmail + ']', async () => {
        it('should return false', async () => {
            notiSoundOn = await userDB.getNotiSoundOn(newEmail).then((r) => { return r; });
            assert.strictEqual(notiSoundOn, false,  'notification sound on = false')
        })
    });

});

// Get/Set Data Usage On
describe('Data Usage  On (user preferences)', async () => {

    let dataUsageOn = "";
    
    // Get default 'data usage on' boolean of newEmail (true)
    describe('(Success) Get data usage on from [' + newEmail + ']', async () => {
        it('should return true', async () => {
            dataUsageOn = await userDB.getDataUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(dataUsageOn, true,  'data usage on = true')
        })
    });

    // Set 'data usage on' boolean of newEmail (false)
    describe('(Success) Set data usage  on of [' + newEmail + '] to false', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setDataUsageOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'data usage on' boolean of newEmail (false)
    describe('(Success) Get data usage on from [' + newEmail + ']', async () => {
        it('should return false', async () => {
            dataUsageOn = await userDB.getDataUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(dataUsageOn, false,  'data usage on = false')
        })
    });

});

// Get/Set App Usage On
describe('Data Usage  On (user preferences)', async () => {

    let appUsageOn = "";
    
    // Get default 'app usage on' boolean of newEmail (true)
    describe('(Success) Get app usage on from [' + newEmail + ']', async () => {
        it('should return true', async () => {
            appUsageOn = await userDB.getAppUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(appUsageOn, true,  'app usage on = true')
        })
    });

    // Set 'app usage on' boolean of newEmail (false)
    describe('(Success) Set app usage  on of [' + newEmail + '] to false', async () => {
        it('should return true (set works)', async () => {
            success = await userDB.setAppUsageOn(newEmail, false).then((r) => { return r; });
            assert.strictEqual(success, true,  'success is true')
        })
    });

    // Get 'app usage on' boolean of newEmail (false)
    describe('(Success) Get app usage on from [' + newEmail + ']', async () => {
        it('should return false', async () => {
            appUsageOn = await userDB.getAppUsageOn(newEmail).then((r) => { return r; });
            assert.strictEqual(appUsageOn, false,  'app usage on = false')
        })
    });

});




/**

 * Get/Set data usage
 * Get/Set app usage
 */



// Delete Account Test
describe('Delete account', async() => {

    // Deletes a non-existent account
    describe('(Success) Non-existent account [' + failEmail + ']: ', async() => {
        it('should return false as email does not exist', async () => {
            success = await userDB.deleteAccount(failEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

    // Deletes an account [Good Password]
    describe('(Success) Good Password [' + newEmail + ']', async() => {
        it('should return true as email and password match', async () => {
            success = await userDB.deleteAccount(newEmail);
            assert.strictEqual(success, true, 'success is true');
        });
    });

});
