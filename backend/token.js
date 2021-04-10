"use strict";

var jwt = require('jsonwebtoken');
var atob = require('atob');

class token {
    constructor() {}

    /**
     * Creates a token
     * @param {String} email 
     * @returns token
     */
    async createToken(email) {

        let secret = 'TOPSECRETTTTT';
        let  now = Math.floor(Date.now() / 1000),
        iat = (now - 10),
        expiresIn = 3600,
        expr = (now + expiresIn),
        notBefore = (now - 10),
        jwtId = Math.random().toString(36).substring(7);
        
        var payload = 
        {
            iat: iat,
            jwtid : jwtId,
            audience : 'TEST',
            data : email
        };           

        let token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn : expiresIn}, async function(err, token) {     
            if(err) {
                console.log("Error occurred while generating token");
                return false;
            }
            else if (token != false) {
                console.log("You have logged in");
                console.log(token);
                return token;
            }
            else {
                console.log("Could not create token.")
                return false;
            }
        });

        return token
    }

    async getEmailFromToken(userToken)
    {
        var token = userToken;
        try 
        {
            var parsed_token = JSON.parse(atob(token.split('.')[1]));
            return parsed_token.data;
        } 
        catch (e) 
        {
            return null;
        }
    }
}
module.exports = token;