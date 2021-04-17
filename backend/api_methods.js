 // Crypto Requirements
 var atob = require('atob');
 var Cryptr = require('cryptr'),
 cryptr = new Cryptr('myTotalySecretKey'); 

 // Database Connection
 let db = require('./db.js');
 let userDB = new db("localhost", "newuser", "", "iCare");

 // Token Methods
 let tokenClass = require('./token.js')
 let userToken = new tokenClass();

 class api_methods {
    constructor() {}

    /**
     * Gets the response values for a failed create user
     * @param {String} displayName
     * @param {String} password 
     * @returns array of reason and message
     */
    async postCreateUser(displayName, password) {
        let r = ""; let m = "";

        if (displayName === "") { r = "BAD_DISPLAY_NAME"; m = "Display name cannot be empty."; }
        else if (password.length < 8) { r = "BAD_PASS"; m = "Your password must be at least 8 characters long."; }
        else { r = "BAD_EMAIL"; m = "Email already in use."; }

        return [r, m];
    }

    /**
     * Encrypts the given value
     * @param {String} password 
     * @returns encrypted password
     */
    async encryptPass(password) {
        let dec_pass = atob(password);
        let encrypted_pass = cryptr.encrypt(dec_pass);
        return encrypted_pass;
    }

    /**
     * Checks if the given password is correct for the given email.
     * @param {String} password 
     * @param {String} email 
     * @returns true if correct password, false otherwise
     */
    async checkPass(password, email) {

        let dec_pass = atob(password)
        let decryptPass = await userDB.getPassword(email).then((r) => { 
            if (r != false) { return cryptr.decrypt(r) }
            return false;
        });

        if (dec_pass == decryptPass) { return true; }
        else { return ["BAD_PASSWORD", "Wrong password was given."] }
    }

    /**
     * Checks if the token is valid
     * @param {String} token 
     * @returns id or error message
     */
    async checkToken(token) {
        let r = ""; let m = ""

        if (typeof token !== 'undefined') {
            let id = await userToken.getIDFromToken(token);
            if (id == false) {
                r = "INVALID_TOKEN";
                m = "The token given is invalid."
            } else {
                return id;
            }
        }
        else {
            r = "INVALID_TOKEN";
            m = "No token was given.";
        }

        return [r, m];
    }


    /**
     * Gets statistical values from data usage records
     * @param {JSON} data records 
     * @returns [aveST, minST, maxSt, aveTC, minTC, maxTC]
     */
    async getStatistics(data) {
        // Screen Time, Timer Count - Min, Max, Average
        let notZero = false;
        let minSC = 0; let maxSC = 0; let aveSC = 0;
        let minTC = 0; let maxTC = 0; let aveTC = 0;

        // Get Values
        let i = 0; let count = data.length;
        for (i = 0; i < count; i++) {

            // Get one row data
            let row = JSON.parse(JSON.stringify(data[i]));
            let rST = row.screenTime; let rTC = row.timerCount;

            // Screen Time: Min/Max
            if (minSC > rST) { minSC = rST; }
            if (maxSC < rST) { maxSC = rST; }

            // Timer Count: Min/Max
            if (minTC > rTC) { minTC = rTC; }
            if (maxTC < rTC) { maxTC = rTC; }

            // Totals to calculate averages
            aveSC += rST;  aveTC += rTC;
            notZero = true;
        }

        // Averages
        if (notZero == true) {
            aveSC /= count; aveTC /= count;
        }
        
        return [aveSC, minSC, maxSC, aveTC, minTC, maxTC];
    }

    async generateInsights() {

        // Return array [header, content] if you were able to generate insights

        // Return false if fail to generate insights
        return false;
    }


}

//-------------

module.exports = api_methods;