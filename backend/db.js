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
     * @param {string} givenEmail email (primary key)
     * @param {string} givenPass password
     * @returns true if no error
     */
    async createUser(givenEmail, givenPass) {
        let q = "INSERT INTO Users (email, pass) VALUES ('" + givenEmail + "', '" + givenPass + "')";

        let results = await new Promise((resolve, reject) => this.pool.query(q, function(err) {
            if (err) { resolve(err) }
            else { resolve(true) }
        }));

        return results;
    }

    /**
     * Checks LogIn Information
     * @param {string} givenEmail email (primary key)
     * @param {string} givenPass password
     * @returns true if successful login
     */
    async checkLogIn(givenEmail, givenPass) {
        
        let q = "SELECT email, pass FROM Users";
        let data = await this.dbPromise(true, q, givenEmail);
        let splits = (JSON.stringify(data)).split('\"', 9);

        if (splits[3] == givenEmail && splits[7] == givenPass) { return true }
        else { return false }

    };

    /**
     * Gets displayName from preferences
     * @param {string} userEmail email (primary key)
     * @returns displayName
     */
    async getDisplayName(userEmail) {
        let q = "SELECT displayName FROM UserPreferences";
        let data = await this.dbPromise(true, q, userEmail);
        let splits = (JSON.stringify(data)).split('\"');       
    
        return splits[3];
    };

    /**
     * Sets the displayName
     * @param {string} userEmail email (primary key)
     * @param {string} displayName displayName
     * @returns true if no error
     */
    async setDisplayName(userEmail, displayName) {
        let q = "UPDATE userPreferences SET displayName='" + displayName + "'"

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets how long the timer is set (minute)
     * @param {string} userEmail email (primary key)
     * @returns intValue - timer length
     */
    async getNotiInterval(userEmail) {
        let q = "SELECT notiInterval FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);
        let intValue = await this.gettingInteger(data)

        return parseInt(intValue)
    }

    /**
     * Sets how long the timer is set (minute)
     * @param {string} userEmail email (primary key)
     * @param {number} newInt new timer length (minute)
     * @returns true if no error
     */
    async setNotiInterval(userEmail, newInt) {
        let q = "UPDATE userPreferences SET notiInterval=" + newInt
        
        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * @todo do this method when we decide notification sounds
     * @param {string} userEmail email (primary key)
     */
    async getNotiSound(userEmail) {

    }

    /**
     * @todo do this method when we decide notification sounds
     * @param {string} userEmail email (primary key)
     * @param {*} newSound new sound to set to
     */
    async setNotiSound(userEmail, newSound) {

    }

    /**
     * Gets the boolean value for notiSoundOn
     * @param {string} userEmail email (primary key)
     * @returns boolean - notiSoundOn
     */
    async getNotiSoundOn(userEmail) {
        let q = "SELECT notiSoundOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);
        let bVal = await this.gettingInteger(data)

        return Boolean(Number(bVal))
    }

    /**
     * Sets the boolean value for notiSoundOn
     * @param {string} userEmail email (primary key)
     * @param {boolean} boolValue set the boolValue
     * @returns true if no error
     */
    async setNotiSoundOn(userEmail, boolValue) {
        let i = boolValue ? true : false;
        let q = "UPDATE userPreferences SET notiSoundOn=" + i

        return await this.dbPromise(false, q, userEmail)
    }

    /**
     * Gets the boolean value of dataUsageOn
     * @param {string} userEmail email (primary key)
     * @returns boolean - dataUsageOn
     */
    async getDataUsageOn(userEmail) {
        let q = "SELECT dataUsageOn FROM UserPreferences"
        let data = await this.dbPromise(true, q, userEmail);
        let bVal = await this.gettingInteger(data)

        return Boolean(Number(bVal))
    }

    /**
     * Sets the boolean value for dataUsageOn
     * @param {string} userEmail email (primary key)
     * @param {boolean} boolValue set DataUsageOn
     * @returns true if no error
     */
    async setDataUsageOn(userEmail, boolValue) {
        let i = boolValue ? true : false;
        let q = "UPDATE userPreferences SET dataUsageOn=" + i
        console.log("boolValue = " + boolValue + "; i = " + i)

        return await this.dbPromise(false, q, userEmail)
    }

    async close() {
        this.pool.end()
    }

    /**
     * Getter/Setter for DB's userPreferences using Promises
     * @param {boolean} isGet is getter method?
     * @param {string} str first part of query
     * @param {*string} userEmail email (primary key)
     * @returns 
     */
    async dbPromise(isGet, str, userEmail) {
        let q = str + " WHERE email='" + userEmail + "'"

        let results = await new Promise((resolve, reject) => this.pool.query(q, function(err, result) {
            if (err) { reject(err) }
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
}


//-------------

module.exports = db;
