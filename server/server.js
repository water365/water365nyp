var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

app.use(bodyParser.json());
app.use(methodOverride());

// Update the details if DB's details changed --important
var db = mysql.createPool({
    connectionLimit: 100,
    host: '182.50.133.88',
    user: '365water',
    password: 'waterthreesixfive365!',
    database: 'water365'
});

// Test for connections
db.getConnection(function (err) {
    console.log('Connecting mySQL....');
    if (err) {
        throw err;
    }
    console.log('mysql connected....');
    db.query('select * from `Usage`;', function (err2, result, fields) {
        if (!err2) {
            console.log(result);
        } else {
            console.log(err2);
        }
    });
});

// Basic things to include
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log("listening to Port", app.get("port"));
});

var cors = require('cors');
var moment = require('moment-timezone');

app.use(cors());

var allowedOrgins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8000',
    'http://localhost:8100'
];
var corsOptions = {
    origin: function (orgin, callback) {
        if (allowedOrgins.includes(orgin) || !orgin) {
            callback(null, true);

        } else {
            callback(new error('Origin not allowed by CORS'));
        }
    }

};
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), function (req, res) {
    res.json({
        message: 'This route is CORS-enabled for an allowed origin.'
    });
});

app.get('/students', cors(corsOptions), function (req, res) {
    console.log('connected to students');
    db.query('select * from `Usage`;', function (err, res, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        console.log(json);
        res.send(json);
    });
});