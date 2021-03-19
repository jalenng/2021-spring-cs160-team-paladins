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

        console.log("=> Connenction Pool Created");
    }

    // Creates a new user (inserts into db)
    async createUser(givenEmail, givenPass) {

        let q = "INSERT INTO Users (email, pass) VALUES ('" + givenEmail + "', '" + givenPass + "')";

        let results = await new Promise((resolve, reject) => this.pool.query(q, function(err) {
            if (err) {
                resolve(false)
            }
            else {
                resolve(true)
            }
        }))

        return results;

    }

    // Checks LogIn Information
    async checkLogIn(givenEmail, givenPass) {
        
        let q = "SELECT email, pass FROM Users WHERE email='" + givenEmail + "'";

        // Getting the result of the query
        let results = await new Promise((resolve, reject) => this.pool.query(q, function(err, result) {
            if (err) {
                reject(err)
            }
            else {
                let splits = (JSON.stringify(result)).split('\"', 9); 
                resolve([splits[3], splits[7]]);        // [email, password]
            }
        }));

        if (givenEmail === results[0] && givenPass === results[1]) { 
            //console.log("You have logged in.") 
            return true
        }
        else { 
            //console.log("Wrong email or password."); 
            return false
        }

    }


}


//-------------

module.exports = db;
