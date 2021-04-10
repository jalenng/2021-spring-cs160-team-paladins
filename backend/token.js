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
        jwtId = Math.random().toString(36).substring(7);
        
        var payload = 
        {
            iat: iat,
            jwtid : jwtId,
            audience : 'TEST',
            data : email
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
     * @returns email
     */
     async getEmailFromToken(userToken)
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

/*
async function test() {
    let d = new token();
    let tt = await d.createToken('basic@gmail.com').then((res) => { return res });
    console.log('TOKNE: ' + tt)    
    console.log('')

    let ttt = await d.getEmailFromToken(tt).then((res) => { return res });
    console.log('Email: ' + ttt)
}

test()
*/





