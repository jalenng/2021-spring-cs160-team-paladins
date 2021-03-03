'user strict'

var sql = require('mysql')

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'mydb'
});

connection.connect(function(err) {
    if (err) throw error;
    else console.log('worked')
});

module.exports = connection;

