var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3123',
    database: 'hw7'
});

connection.connect()

connection.query('select * from assists', function (err, rows, fields) {
    if (err) throw err

    rows.array.forEach(element => {
        console.log(element);
    });
})

connection.end()
