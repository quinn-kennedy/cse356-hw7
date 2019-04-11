const express = require('express');
const bodyParser = require('body-parser');
var Memcached = require('memcached');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3123',
    database: 'hw7'
});
var app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const port = 80;
connection.connect();

const getQuery = 'SELECT * FROM assists WHERE club=? AND POS =?;';
let memcached = new Memcached("127.0.0.1:11211")

app.get('/hw7', function (req, res) {
    //    console.log('GET on hw7 with query = ' + req.query);
    //    console.log('club = ' + req.query.club);
    //    console.log('pos = ' + req.query.pos);

    const queryJSON = JSON.stringify(req.query);

    memcached.get(queryJSON, function (err, data) {
        if (data) {
            // console.log(data);
            return res.json(data);
        } else {
            console.log('not in mc');
            connection.query(getQuery, [req.query.club, req.query.pos], function (err, results, fields) {
                //        console.log('err = ' + err);
                //        console.log('results = ' + results);
                //        console.log('fields = ' + fields);
                let topPlayer = results[0];
                let avg = 0;

                results.forEach(element => {
                    if (element.A > topPlayer.A) {
                        topPlayer = element;
                        //	console.log('new topPlayer = ' + topPlayer.Player);
                    } else if (element.A == topPlayer.A) {
                        topPlayer = element.GS > topPlayer.GS ? element : topPlayer;
                        //		console.log('new topPlayer = ' + topPlayer.Player);
                    }

                    avg += element.A;
                    //	    console.log('new Avg = ' + avg);
                });

                avg /= results.length;

                const jsonResult = {
                    club: req.query.club,
                    max_assists: topPlayer.A,
                    player: topPlayer.Player,
                    avg_assists: avg
                };

                // const str_json = JSON.stringify(jsonResult);
                memcached.set(queryJSON, jsonResult, 500, function (err) {
                    //console.log('err in set memc ' + err) 
                });
                res.json(jsonResult);
            });
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
