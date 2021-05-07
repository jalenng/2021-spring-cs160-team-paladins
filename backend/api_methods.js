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

       // No Password
       let chkPass = await this.chkValues("password", password);
       if (chkPass == false) { return chkPass; };

       // Checks for valid password
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
    * @returns id or error message (invalid token)
    */
   async checkToken(token) {

       // No Token
       let chkToken = await this.chkValues("token", token);
       if (chkToken == false) { return chkToken; }; 

       // Check Token
       let id = await userToken.getIDFromToken(token);
       if (id === false) { return ["INVALID_TOKEN", "The token given is invalid."]; }
       return id;
   }

   /**
    * Checks if a given value is undefined
    * @param {String} type 
    * @param {String} value 
    * @returns true if not undefined
    */
   async chkValues(type, value) {

       let r = "";
       let m = "";
       
       // Undefined
       let test = await userDB.checkUndefined([value]);
       if (!test) {
           switch(type) {
               case "email": 
                   r = "BAD_EMAIL"
                   m = "No email was given."
                   break;
               case "password":
                   r = "BAD_PASSWORD"
                   m = "No password was given."
                   break;
               case "display_name":
                   r = "BAD_DISPLAY_NAME"
                   m = "No display name was given."
                   break;
               case "token":
                   r = "INVALID_TOKEN";
                   m = "No token was given.";
                   break;
               default:
                   r = "BAD_INPUT"
                   m = "There is an empty input."
                   
           }
           return [r, m]
       }

       return true;
   }

   /**
    * Generate dynamic insights for user based on data/app usage statistics
    * @param {String} email 
    * @returns list of JSON objects
    */
   async generateInsights(email) {
       let insights = await this.genericInsights();

       // Generate Dynamic Insights
       let usageInsights = await this.usageInsights(email);
       insights.concat(usageInsights);

       return insights;
   }

   /**
    * Generate the default insights that appear for everyone
    * @returns list of JSON objects
    */
   async genericInsights() {

        let genericInsights = [
            { header: "Standing Up", content: "Try to stand up for 5 minutes every 30 minutes" },
            { header: "Working Hard", content: "Did you know it’s best not to work for more than an hour at a time" },
            { header: "Meditation Benefits", content: "Consider learning about the benefits of mindfulness meditation" },
            { header: "Bluelight Filter", content: "Consider using a blue light filter to protect your eyes" },
            { header: "Dark Mode", content: "Consider using a dark mode to protect your eyes" },
            { header: "Pomodoro technique", content: "Have you ever considered trying the Pomodoro technique" },
        ];

        return genericInsights;
   }

   /**
    * Generates dynamic usage insights based on 
    * @param {String} email 
    * @returns list of JSON objects
    */
   async usageInsights(email) {
       
       let dataUsage = await userDB.getTimerUsage(email, "WEEK");
       let dataAggregate = await this.getDataAggregation(dataUsage);
       let data = JSON.parse(JSON.stringify(dataAggregate));

       let usageInsights = [
           { header: "Average Screen Time", content: "Your average screen time in the last 7 days is " + data.aveSC + " minutes." },
           { header: "Average Breaks Taken", content: "The average amount of breaks you have taken in the last 7 days is " + data.aveTC + " breaks." }
       ]

        return usageInsights
   }

   /**
    * Gets statistical values from data usage records
    * @param {JSON} data records 
    * @returns [aveST, minST, maxSt, aveTC, minTC, maxTC]
    */
    async getDataAggregation(data) {
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
 
            // Screen Time / Timer Count: Min/Max
            if (minSC > rST) { minSC = rST; } if (maxSC < rST) { maxSC = rST; }
            if (minTC > rTC) { minTC = rTC; } if (maxTC < rTC) { maxTC = rTC; }
 
            // Totals to calculate averages
            aveSC += rST;  aveTC += rTC;
            notZero = true;
        }
 
        // Averages
        if (notZero == true) {
            aveSC /= count; aveTC /= count;
        }

        return { minSC: minSC, maxSC: maxSC, aveSC: aveSC, minTC: minTC, maxTC: maxTC, aveTC: aveTC }
    }

}

//-------------

module.exports = api_methods;