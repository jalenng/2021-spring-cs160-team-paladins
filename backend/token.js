"use strict";

var jwt = require('jsonwebtoken');
var atob = require('atob');

class token {
    constructor() {}

    /**
     * Creates a token based on user id
     * @param {String} id 
     * @returns token
     */
    async createToken(id) {

        let secret = 'TOPSECRETTTTT';
        let  now = Math.floor(Date.now() / 1000),
        iat = (now - 10),
        expiresIn = 3600,
        jwtId = Math.random().toString(36).substring(7);
        
        var payload = 
        {
            iat: iat,
            jwtid : jwtId,
            audience : 'TEST',
            data : id
        };    

        return new Promise((resolve) => {
            jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn : expiresIn}, function(err, token) {     
                if (token != false) { resolve(token) }
                else { resolve(false) }
            });
        })
    }

    /**
     * Gets the email value from a token
     * @param {String} userToken 
     * @returns id
     */
     async getIDFromToken(userToken)
     {
         try {
             let parsed_token = JSON.parse(atob(userToken.split('.')[1]));
             return parsed_token.data;
         } 
         catch (e) {
             return false;
         }
     }
}

module.exports = token;