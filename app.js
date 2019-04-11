const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3123',
    database: 'hw7'
});
app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

connection.connect();

connection.query('select * from assists', function (err, rows, fields) {
    if (err) throw err

    rows.array.forEach(element => {
        console.log(element);
    });
});
const getQuery = 'SELECT club, pos, max_assists, player, avg_assists 
FROM assists
WHERE a =?, pos =? ';
app.get('/hw7', function (req, res) {
    console.log('GET on hw7 with query = ' + req.query);
    console.log('club = ' + req.query.club);
    console.log('pos = ' + req.query.pos);
    connection.query(getQuery, [req.query.club, req.query.pos], function (err, results, fields) {
        console.log('err = ' + err);
        console.log('results = ' + results);

        console.log('fields = ' + fields);
    });
});

// connection.end();

app.listen(port, () => console.log(`Listening on port ${port}!`));