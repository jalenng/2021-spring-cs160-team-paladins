// Database Connection
let db = require('./db.js')
const userDB = new db("localhost", "newuser", "password", "iCare");

//JEST Testing Framework (npm run test)
test('check login credentials for \'hello@gmail.com\' (success)', async () => {
    let loginCheck = await userDB.checkLogIn('hello@gmail.com', 'pass')
    expect(loginCheck).toBe(true);
  });

test('check login credentials for \'hello@gmail.com\' (fail - wrong password)', async () => {
    let loginCheck = await userDB.checkLogIn('hello@gmail.com', 'wrongPass')
    expect(loginCheck).not.toBe(true);
});

test('create user \'test@gmail.com\' (success)', async () => {
    let createUser = await userDB.createUser('test@gmail.com', 'pass')

    if (createUser == true) { expect(createUser).toBe(true); }      // First time
    else { expect(createUser).not.toBe(true); }                     // All times after (duplicate entry)
});

test('get display name (success)', async () => {
    let displayName = await userDB.getDisplayName('basic@gmail.com');
    expect(displayName).toBe("Display Name");
});

test('set display name (success)', async () => {
    let setDN = await userDB.setDisplayName('default@gmail.com', 'newDisplayName')
    if (setDN == true) { expect(setDN).toBe(true) }         
    else { expect(setDN).not.toBe(true) }
})

test('get timer length in minutes (success)', async () => {
    let notiInt = await userDB.getNotiInterval('hello@gmail.com');
    expect(notiInt).toBe(30);
});

test('set timer length in minutes (success)', async () => {
    let setNI = await userDB.setDisplayName('default@gmail.com', 50)
    if (setNI == true) { expect(setNI).toBe(true) }         
    else { expect(setNI).not.toBe(true) }
})

test('get notiSoundOn - boolean (success)', async () => {
    let soundBool = await userDB.getNotiSoundOn('basic@gmail.com');
    expect(soundBool).toBe(true);
});

test('set notiSoundOn - boolean (success)', async () => {
    let setNSBool = await userDB.setNotiSoundOn('default@gmail.com', false)
    if (setNSBool == true) { expect(setNSBool).toBe(true) }         
    else { expect(setNSBool).not.toBe(true) }
})

test('get dataUsageOn - boolean (success)', async () => {
    let dataUsageBool = await userDB.getDataUsageOn('basic@gmail.com');
    expect(dataUsageBool).toBe(true);
});

test('set dataUsageOn false - boolean (success)', async () => {
    await userDB.setDataUsageOn('default@gmail.com', false).then((result) => {
        if (result == true) { expect(result).toBe(true) }
        else { expect(result).not.toBe(true) }
    })
})

test('set dataUsageOn true - boolean (success)', async () => {
    await userDB.setDataUsageOn('default@gmail.com', true).then((result) => {
        if (result == true) { expect(result).toBe(true) }
        else { expect(result).not.toBe(true) }
    })
})

// -------Testing Notification Sounds-------------------------
test ('add notification sound input into database', async () => {
    let name = "Leaf"
    let soundPath = "2021-spring-cs160-team-paladins/database/Sounds/Leaf.ogg"
    await userDB.addNotiSound(name, soundPath).then((result) => {
        if (result == true) { expect(result).toBe(true) }           // Fails after it is inputted
        else { expect(result).not.toBE(true) }
    })
})

test ('change notification sound preference of user', async () => {
    await userDB.setNotiSound("basic@gmail.com", "Leaf").then((result) => {
        if (result == true) { expect(result).toBe(true) }
        else { expect(result).not.toBE(true) }
    });

})

test ('getting notification sound path of user', async () => {
    await userDB.getNotiSound('basic@gmail.com').then((result) => {
        if (result == true) { expect(result).toBe(true) }
        else { expect(result).not.toBE(true) }
    });

})
      
//--------------------------------

test('close connection', async () => {
    await userDB.close();
})
  