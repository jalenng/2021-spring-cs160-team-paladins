"use strict";

const mysql = require('mysql');
var util = require('util');

class db {
    constructor(host, user, pass, db) {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: host,
            user: user,
            password: pass,
            database: db
        })
    }

    /**
     * Creates a new user (inserts into db)
     * @param {String} givenEmail email (primary key)
     * @param {String} givenPass password
     * @param {String} displayName display name
     * @returns true if no error, false for error
     */
     async createUser(givenEmail, givenPass, displayName) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([givenEmail, givenPass, displayName]);
        if (checkValues == false) {
            return false;
        }

        let q = "INSERT INTO Users (email, pass, displayName)";
        q = q + "VALUES ('" + givenEmail + "', '" + givenPass + "', '" + displayName + "')";

        let results = await new Promise((resolve) => this.pool.query(q, function (err) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(true) }
        }));
        return results;
    }

    /**
     * Gets the user id from the database
     * @param {String} givenEmail 
     * @returns user id (int)
     */
    async getID(givenEmail) {
        let q = "SELECT id FROM Users"
        let data = await this.dbPromise(true, q, givenEmail);

        if (data.length === 0) { return false; }
        else if (data != false) {
            let intValue = await this.gettingInteger(data)
            return intValue;
        }

        return false;
    }

    /**
     * Gets email from id
     * @param {int} id 
     * @returns email associated with user id
     */
    async getEmail(id) {
        let q = "SELECT email FROM Users WHERE id=" + id 
        // Querying Result
        return await new Promise((resolve) => this.pool.query(q, function (err, result) {
            if (err) { console.log(err); resolve(false) }
            else { 
                let splits = (JSON.stringify(result)).split('\"', 5);                
                resolve(splits[3])
             }
        }));
    }

    /**
     * Gets the password given an email
     * @param {String} givenEmail 
     * @returns hashed password
     */
    async getPassword(givenEmail) {
        let q = "SELECT email, pass FROM Users";
        let data = await this.dbPromise(true, q, givenEmail);

        if (data.length === 0) { return false; }
        else if (data != false) {
            let splits = (JSON.stringify(data)).split('\"', 9);
            return splits[7]
        }

        return false;
    }

    /**
     * Updates the email of user
     * @param {String} oldEmail of user
     * @param {String} newEmail of user
     * @returns true if no error, false if fails
     */
    async changeEmail(oldEmail, newEmail) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([oldEmail, newEmail]);
        if (checkValues == false) {
            return false;
        }

        let q = "UPDATE Users SET email='" + newEmail + "'"

        return await this.dbPromise(false, q, oldEmail);
    }

    /**
     * Deletes a user given the email
     * @param {String} userEmail 
     * @returns true if no error, false if fails
     */
    async deleteAccount(userEmail) {
        let q = "DELETE FROM Users"

        return await this.dbPromise(false, q, userEmail);
    }

    /**
     * Gets displayName from preferences
     * @param {String} userEmail email (primary key)
     * @returns displayName, false if fails
     */
    async getDisplayName(userEmail) {
        let q = "SELECT displayName FROM Users";
        let data = await this.dbPromise(true, q, userEmail);

        if (data != false) {
            let splits = (JSON.stringify(data)).split('\"');
            return splits[3];
        }

        return data;
    };

    /**
     * Sets the displayName
     * @param {String} userEmail email (primary key)
     * @param {String} displayName displayName
     * @returns true if no error, false if fails
     */
    async setDisplayName(userEmail, displayName) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, displayName]);
        if (checkValues == false) {
            return false;
        }

        // Sets display name
        let q = "UPDATE Users SET displayName='" + displayName + "'"

        return await this.dbPromise(false, q, userEmail);
    }

    /**
     * Gets how long the timer is set (minute)
     * @param {String} userEmail email (primary key)
     * @returns intValue - timer length, false if fails
     */
    async getNotiInterval(userEmail) {
        let q = "SELECT notiInterval FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);

        if (data != false) {
            let intValue = await this.gettingInteger(data)
            return parseInt(intValue)
        }

        return data;
    }

    /**
     * Sets how long the timer is set (minute)
     * @param {String} userEmail email (primary key)
     * @param {int} newInt new timer length (minute)
     * @returns true if no error, false if fails
     */
    async setNotiInterval(userEmail, newInt) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, newInt]);
        if (checkValues == false) {
            return false;
        }

        // Sets notification interval
        let q = "UPDATE UserPreferences SET notiInterval=" + newInt

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets the notification sound path
     * @param {String} userEmail 
     * @returns sound path of notification sound
     */
    async getNotiSound(userEmail) {
        let q = "SELECT notiSound FROM UserPreferences"

        let data = await this.dbPromise(true, q, userEmail);

        if (data != false) {
            let splits = (JSON.stringify(data)).split('\"');
            return splits[3];
        }

        return data;
    }

    /**
     * Sets the local notification sound path of a user 
     * @param {String} userEmail email (primary key)
     * @param {String} newSound new sound to set to (sound name in database)
     */
    async setNotiSound(userEmail, newSound) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, newSound]);
        if (checkValues == false) {
            return false;
        }

        // Sets notification sound
        let q = "UPDATE UserPreferences SET notiSound='" + newSound + "'";

        return await this.dbPromise(false, q, userEmail);
    }

    /**
     * Gets the boolean value for notiSoundOn
     * @param {String} userEmail email (primary key)
     * @returns boolean - notiSoundOn, false if fails
     */
    async getNotiSoundOn(userEmail) {
        let q = "SELECT notiSoundOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);

        if (data != false) {
            let bVal = await this.gettingInteger(data)
            return Boolean(Number(bVal))
        }

        return data;
    }

    /**
     * Sets the boolean value for notiSoundOn
     * @param {String} userEmail email (primary key)
     * @param {Boolean} boolValue set the boolValue
     * @returns true if no error, false if fails
     */
    async setNotiSoundOn(userEmail, boolValue) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, boolValue]);
        if (checkValues == false) {
            return false;
        }

        // Sets boolValue
        let i = boolValue ? true : false;
        let q = "UPDATE UserPreferences SET notiSoundOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets the boolean value of timerUsageOn
     * @param {String} userEmail email (primary key)
     * @returns boolean - timerUsageOn, false if fails
     */
    async getTimerUsageOn(userEmail) {
        let q = "SELECT timerUsageOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);

        if (data != false) {
            let bVal = await this.gettingInteger(data)
            return Boolean(Number(bVal))
        }

        return data;
    }

    /**
     * Sets the boolean value for timerUsageOn
     * @param {String} userEmail email (primary key)
     * @param {Boolean} boolValue set timerUsageOn
     * @returns true if no error
     */
    async setTimerUsageOn(userEmail, boolValue) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, boolValue]);
        if (checkValues == false) {
            return false;
        }

        // Sets boolValue
        let i = boolValue ? true : false;
        let q = "UPDATE UserPreferences SET timerUsageOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets the booleanValue of AppUsageOn
     * @param {String} userEmail user email
     * @returns boolean value of AppUsageOn
     */
    async getAppUsageOn(userEmail) {
        let q = "SELECT appUsageOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);
        if (data != false) {
            let bVal = await this.gettingInteger(data)
            return Boolean(Number(bVal))
        }
        return data
    }

    /**
     * Sets the boolean value for appUsageOn
     * @param {String} userEmail 
     * @param {Boolean} boolValue set appUsageOn
     * @returns true if no error; false if fails
     */
    async setAppUsageOn(userEmail, boolValue) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, boolValue]);
        if (checkValues == false) {
            return false;
        }

        // Sets boolValue
        let i = boolValue ? true : false;
        let q = "UPDATE UserPreferences SET appUsageOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Sets the values of the timer usage record or creates a new one.
     * @param {String} userEmail user email
     * @param {int} screenTime screen time spent on computer
     * @param {int} timerCount amount of times counter has been called
     * @param {date} usageDate number of days the usageDate is away from today
     * @returns true if success in updating timerUsage records, false if fails
     */
    async setTimerUsage(userEmail, screenTime, timerCount, usageDate) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, screenTime, timerCount, usageDate]);
        if (checkValues == false) {
            return false;
        }

        // Checks for existing record
        let check = await this.check("TimerUsage", userEmail, "", usageDate);
        let q = "";


        // Updates existing record
        if (check == "1") {
            q = "UPDATE TimerUsage SET screenTime= screenTime + " + screenTime + ", timerCount= timerCount + " + timerCount + 
                " WHERE email='" + userEmail + "' AND usageDate='" + usageDate + "'";
        }
        // Creates existing record
        else {
            q = "INSERT INTO TimerUsage VALUES('" + userEmail + "', " + screenTime + ", " + timerCount + ", '" + usageDate + "')";
        }

        // Updates the database
        let results = await new Promise((resolve) => this.pool.query(q, function (err) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(true) }
        }));

        return results;
    }

    /**
     * Gets the data usage of a user based on day, week, month, or all time
     * @param {String} userEmail user email
     * @param {String} time TODAY, WEEK, MONTH, ALL (querying usageDate)
     * @returns JSON of records, false if fails (there are no records)
     */
    async getTimerUsage(userEmail, time) {

        let q = "SELECT screenTime, timerCount, usageDate FROM TimerUsage WHERE email='" + userEmail + "'"
        let q2 = await this.getQueryUsage(time);
        q = q + q2

        // Querying Result
        let results = await new Promise((resolve) => this.pool.query(q, function (err, result) {
            if (err) { resolve(false) }
            else { resolve(result) }
        }));

        return results; // JSON.stringify(results); to get the string format
    }

    /**
     * Sets the values of an AppUsage record
     * @param {String} userEmail user email
     * @param {String} appName name of the application
     * @param {int} appTime time spent on the application
     * @param {date} date usageDate
     * @returns true if success in updating appusage records, false if fails
     */
    async setAppUsage(userEmail, appName, appTime, date) {

        // Check for undefined values
        let checkValues = await this.checkUndefined([userEmail, appName, appTime, date]);
        if (checkValues == false) {
            return false;
        }
        
        // Checks for existing record
        let check = await this.check("AppUsage", userEmail, appName, date).then((result) => { return result; })
        let q = "";

        // Updates existing record
        if (check == "1") {
            q = "UPDATE AppUsage SET appTime= appTime + " + appTime +
                " WHERE email='" + userEmail + "' AND usageDate='" + date + "'";
        }
        // Creates a new record
        else {
            q = "INSERT INTO AppUsage VALUES('" + userEmail + "', '" + appName + "', " + appTime + ", '" + date + "')";
        }

        // Updates the database
        let results = await new Promise((resolve) => this.pool.query(q, function (err) {
            if (err) { resolve(false) }
            else { resolve(true) }
        }));

        return results;
    }


    /**
     * Gets app usage records
     * @param {String} userEmail user email
     * @param {String} time  day, week, month, all time (querying usageDate)
     * @returns JSON of records, false if fails (there are no records)
     */
    async getAppUsage(userEmail, time) {
        let q = "SELECT appName, appTime, usageDate FROM AppUsage WHERE email='" + userEmail + "'"
        let q2 = await this.getQueryUsage(time);
        q = q + q2

        // Querying Result
        let results = await new Promise((resolve) => this.pool.query(q, function (err, result) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(result) }
        }));

        return results; // JSON.stringify(results); to get the string format
    }

    /**
     * Closes the database pool
     */
    async close() {
        this.pool.end()
    }

    // Helper Methods--------------------------------------------------

    /**
     * Getter/Setter for DB's userPreferences using Promises
     * @param {Boolean} isGet is getter method?
     * @param {String} str first part of query
     * @param {String} userEmail email (primary key)
     * @returns true/result for successful set/get, false for failure
     */
    async dbPromise(isGet, str, userEmail) {
        let q = str + " WHERE email='" + userEmail + "'"

        let results = await new Promise((resolve) => this.pool.query(q, function (err, result) {
            if (err) { resolve(false) }
            else {
                if (isGet) { resolve(result) }      // For Getter Methods
                else { resolve(true) }              // For Setter Methods
            }
        }));

        return results;
    }

    /**
     * Getting the integer values from the DB through splitting the string
     * @param {*} data RowPacketData from dbPromise
     * @returns integer
     */
    async gettingInteger(data) {
        let splits = (JSON.stringify(data)).split(':');
        return splits[1][0];

        // let splits2 = (JSON.stringify(splits[1])).split('}')
        // let splits3 = (JSON.stringify(splits2[0])).split('\"')
        // return splits3[2]
    }

    /**
     * Gets today's date for setting the values of a Timer/App Usage record in the db
     * @param days subtract this to get a date in the past
     * @returns mysql date formats
     */
    async getDate(days) {

        let myDate = new Date();
        let pastDate = myDate.getDate() - days;
        myDate.setDate(pastDate);

        let dd = String(myDate.getDate()).padStart(2, '0');
        let mm = String(myDate.getMonth() + 1).padStart(2, '0');
        let yyyy = myDate.getFullYear();

        myDate = yyyy + '-' + mm + '-' + dd;
        return myDate;
    }

    /**
     * Checks if an entry exists in the table
     * @param {String} table "AppUsage" or "TimerUsage"
     * @param {String} userEmail email of user
     * @param {String} appName for "AppUsage"
     * @param {String} today the date of today
     * @returns "0" - no entry; "1" - entry exists; false -error
     */
    async check(table, userEmail, appName, today) {
        let checkq = "SELECT EXISTS(SELECT * FROM "
        let addq = ""

        // Checks if an entry for today exists in the database.
        if (table == "TimerUsage") {
            addq = table + " WHERE email='" + userEmail + "' AND usageDate='" + today + "')";
        }
        else if (table == "AppUsage") {
            addq = table + " WHERE email='" + userEmail + "' AND appName='" + appName + "' AND usageDate='" + today + "')";
        }
        checkq = checkq + addq;

        // 1 = the record exists, 0 = record does not exist
        let check = await new Promise((resolve) => this.pool.query(checkq, function (err, result) {
            if (err) { resolve(false) }
            else { resolve(result) }
        }));

        // Gets check value from [Object object] to string "1" or "0" / or false if fails
        return await this.gettingInteger(check).then((result) => { return result; })
    }

    /**
     * Gets the second half of a query for AppUsage/TimerUsage where we 
     * get a range of records back!
     * @param {String} time 
     */
    async getQueryUsage(time) {
        let queryString = " AND usageDate"
        let qPart = ""
        let date = ""

        if (time == "TODAY") {
            date = await this.getDate(0).then((result) => { return result; })
            qPart = "='"
        }
        else if (time == "WEEK") {
            date = await this.getDate(7).then((result) => { return result; })
            qPart = ">'"
        }
        else if (time == "MONTH") {
            date = await this.getDate(30).then((result) => { return result; })
            qPart = ">'"
        }
        else { // ALL TIME
            return "";
        }

        queryString = queryString + qPart + date + "'"

        return queryString;
    }

    /**
     * Checks for undefined values
     * @param {Array} list 
     * @returns true if no undefined values
     */
    async checkUndefined(list) {
        for (const item of list) {
            if (typeof item === 'undefined' || item.length === 0 || item === null) {
                return false;
            }
        }
        return true;
    }
}


//-------------

module.exports = db;