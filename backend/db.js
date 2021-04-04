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

    // Database Methods--------------------------------------------------

    /**
     * Creates a new user (inserts into db)
     * @param {String} givenEmail email (primary key)
     * @param {String} givenPass password
     * @returns true if no error, false for error
     */
    async createUser(givenEmail, givenPass) {
        let q = "INSERT INTO Users (email, pass) VALUES ('" + givenEmail + "', '" + givenPass + "')";

        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err) {
            if (err) { resolve(false) }
            else { resolve(true) }
        }));

        return results;
    }

    /**
     * Checks LogIn Information
     * @param {String} givenEmail email (primary key)
     * @param {String} givenPass password
     * @returns true if successful login, false if fails
     */
    async checkLogIn(givenEmail, givenPass) {

        let q = "SELECT email, pass FROM Users";
        let data = await this.dbPromise(true, q, givenEmail);

        if (data != false) {
            let splits = (JSON.stringify(data)).split('\"', 9);

            if (splits[3] == givenEmail && splits[7] == givenPass) { return true }
            else { return false }
        }
        console.log(data)
        return data;

    };

    /**
     * Gets displayName from preferences
     * @param {String} userEmail email (primary key)
     * @returns displayName, false if fails
     */
    async getDisplayName(userEmail) {
        let q = "SELECT displayName FROM UserPreferences";
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
        let q = "UPDATE userPreferences SET displayName='" + displayName + "'"

        return await this.dbPromise(false, q, userEmail)
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
        let q = "UPDATE userPreferences SET notiInterval=" + newInt

        return await this.dbPromise(false, q, userEmail)
    }


    /**
     * Gets the path of the notification sound to play the sound!
     * @param {String} userEmail email (primary key)
     * @return path if successful, false if failed
     */
    async getNotiSound(userEmail) {
        let query = "SELECT path FROM notificationSounds WHERE soundName="
        let q = query + "(SELECT notiSound FROM userPreferences WHERE email='" + userEmail + "')"

        let path = await new Promise((resolve, reject) => this.pool.query(q, function (err, result) {
            if (err) { reject(false) }
            else {
                resolve(result)
            }
        }));

        return path;
    }

    /**
     * Sets the notification sound of a user 
     * @param {String} userEmail email (primary key)
     * @param {String} newSound new sound to set to (sound name in database)
     */
    async setNotiSound(userEmail, newSound) {
        let q = "UPDATE userPreferences SET notiSound='" + newSound + "'";

        return await this.dbPromise(false, q, userEmail);
    }

    /**
     * Adds notification sound to database
     * @param {String} name name of sound file
     * @param {String} path path of sound file
     * @return true if no error, false for error (duplicate entry usually)
     */
    async addNotiSound(name, path) {
        let q = "INSERT INTO notificationSounds VALUES ('" + name + "', '" + path + "')";

        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err) {
            if (err) { resolve(false) }
            else { resolve(true) }
        }));

        return results;
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
        let i = boolValue ? true : false;
        let q = "UPDATE userPreferences SET notiSoundOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets the boolean value of dataUsageOn
     * @param {String} userEmail email (primary key)
     * @returns boolean - dataUsageOn, false if fails
     */
    async getDataUsageOn(userEmail) {
        let q = "SELECT dataUsageOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);
        if (data != false) {
            let bVal = await this.gettingInteger(data)
            return Boolean(Number(bVal))
        }

        return data
    }

    /**
     * Sets the boolean value for dataUsageOn
     * @param {String} userEmail email (primary key)
     * @param {Boolean} boolValue set DataUsageOn
     * @returns true if no error
     */
    async setDataUsageOn(userEmail, boolValue) {
        let i = boolValue ? true : false;
        let q = "UPDATE userPreferences SET dataUsageOn=" + i

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
        let i = boolValue ? true : false;
        let q = "UPDATE userPreferences SET appUsageOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Sets the values of the data usage record or creates a new one.
     * @param {String} userEmail user email
     * @param {int} screenTime screen time spent on computer
     * @param {int} timerCount amount of times counter has been called
     * @returns true if success in updating datausage records, false if fails
     */
    async setDataUsage(userEmail, screenTime, timerCount) {
        let today = await this.getDate(0).then((result) => { return result; })
        let check = await this.check("DataUsage", userEmail, "", today);
        let q = "";

        // Updates existing record
        if (check == "1") {
            q = "UPDATE DataUsage SET screenTime=" + screenTime + ", timerCount=" + timerCount + " WHERE email='" + userEmail + "' AND usageDate='" + today + "'";
        }
        // Creates existing record
        else {
            q = "INSERT INTO DataUsage VALUES('" + userEmail + "', " + screenTime + ", " + timerCount + ", '" + today + "')";
        }

        // Updates the database
        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(true) }
        }));

        return results;
    }

    /**
     * Gets the data usage of a user based on day, week, month, or all time
     * @param {String} userEmail user email
     * @param {String} time day, week, month, all time (querying usageDate)
     * @returns JSON of records, false if fails (there are no records)
     */
    async getDataUsage(userEmail, time) {

        let q = "SELECT screenTime, timerCount, usageDate FROM DataUsage WHERE email='" + userEmail + "'"
        let q2 = await this.getQueryUsage(time);
        q = q + q2

        // Querying Result
        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err, result) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(result) }
        }));

        return results; // JSON.stringify(results); to get the string format
    }

    /**
     * Sets the values of an AppUsage record
     * @param {String} userEmail user email
     * @param {String} appName name of the application
     * @param {int} appTime time spent on the application
     * @returns true if success in updating appusage records, false if fails
     */
    async setAppUsage(userEmail, appName, appTime) {
        let today = await this.getDate(0).then((result) => { return result; })
        let check = await this.check("AppUsage", userEmail, appName, today);
        let q = "";

        // Updates existing record
        if (check == "1") {
            q = "UPDATE AppUsage SET appTime=" + appTime + ", timerCount=" + timerCount +
                " WHERE email='" + userEmail + "' AND usageDate='" + today + "'";
        }
        // Creates existing record
        else {
            q = "INSERT INTO DataUsage VALUES('" + userEmail + "', " + screenTime + ", " + timerCount + ", '" + today + "')";
        }

        // Updates the database
        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err) {
            if (err) { console.log(err); resolve(false) }
            else { resolve(true) }
        }));

        return results;
    }


    /**
     * Gets app usage records
     * @param {String} userEmail user email
     * @param {String} appName name of application
     * @param {int} appTime time spent on application
     * @param {String} time  day, week, month, all time (querying usageDate)
     * @returns JSON of records, false if fails (there are no records)
     */
    async getAppUsage(userEmail, appName, appTime, time) {
        let q = "SELECT appName, appTime, usageDate FROM AppUsage WHERE email='" + userEmail + "'"
        let q2 = await this.getQueryUsage(time);
        q = q + q2

        // Querying Result
        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err, result) {
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

        let results = await new Promise((resolve, reject) => this.pool.query(q, function (err, result) {
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
        let splits2 = (JSON.stringify(splits[1])).split('}')
        let splits3 = (JSON.stringify(splits2[0])).split('\"')

        return splits3[2]
    }

    /**
     * Gets today's date for setting the values of a Data/App Usage record in the db
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
     * @param {String} table "AppUsage" or "DataUsage"
     * @param {String} userEmail email of user
     * @param {String} appName for "AppUsage"
     * @param {String} today the date of today
     * @returns "0" - no entry; "1" - entry exists; false -error
     */
    async check(table, userEmail, appName, today) {
        let checkq = "SELECT EXISTS(SELECT * FROM "
        let addq = ""

        // Checks if an entry for today exists in the database.
        if (table == "DataUsage") {
            addq = table + " WHERE email='" + userEmail + "' AND usageDate='" + today + "')";
        }
        else if (table == "App Usage") {
            addq = table + " WHERE email='" + userEmail + "' AND appName='" + appName + "' AND usageDate='" + today + "')";
        }
        checkq = checkq + addq;

        // 1 = the record exists, 0 = record does not exist
        let check = await new Promise((resolve, reject) => this.pool.query(checkq, function (err, result) {
            if (err) { resolve(false) }
            else { resolve(result) }
        }));

        // Gets check value from [Object object] to string "1" or "0" / or false if fails
        return await this.gettingInteger(check).then((result) => { return result; })
    }

    /**
     * Gets the second half of a query for AppUsage/DataUsage where we 
     * get a range of records back!
     * @param {String} time 
     */
    async getQueryUsage(time) {
        let queryString = " AND usageDate"
        let qPart = ""
        let date = ""

        if (time == "day") {
            date = await this.getDate(0).then((result) => { return result; })
            qPart = "='"
        }
        else if (time == "week") {
            date = await this.getDate(7).then((result) => { return result; })
            qPart = ">'"
        }
        else if (time == "month") {
            date = await this.getDate(30).then((result) => { return result; })
            qPart = ">'"
        }

        queryString = queryString + qPart + date + "'"

        return queryString;
    }
}


//-------------

module.exports = db;
