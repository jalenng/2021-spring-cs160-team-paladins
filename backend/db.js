'user strict'

var sql = require('mysql')

var connection = mysql.createConnection({
    host : 'localhost:3000',
    user : 'root',
    password : '',
    database : 'mydb'
});

connection.connect(function(err) {
    if (err) throw error;
});

module.exports = connection;

