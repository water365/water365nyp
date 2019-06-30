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


// getting all users from database

app.get('/users', cors(corsOptions), function (request, response) {
    console.log('connected to students');
    db.query('select * from Users;', function (err2, result, fields) {
        if (!err2) {
            console.log("result");
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        } else {
            console.log(err2);
        }
    });
});

// getting specific user from users table 

app.get('/users/:id', cors(corsOptions), function (request, response) {
    console.log('connected to students');
    var id = request.params.id;
    var sql = "SELECT * FROM Users WHERE userid = ?";
    db.query(sql, id, function (err2, result, fields) {
        if (!err2) {
            console.log("result");
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        } else {
            console.log(err2);
        }
    });
});

// getting all water usage data of specific user from database

app.get('/users/:id/usage', cors(corsOptions), function (request, response) {
    console.log('connected to students');
    var id = request.params.id;
    var sql = "SELECT * FROM `Usage` WHERE userid = ?";
    db.query(sql, id, function (err2, result, fields) {
        if (!err2) {
            console.log("result");
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        } else {
            console.log(err2);
        }
    });
});

// getting all water usage records from database

app.get('/usages', cors(corsOptions), function (request, response) {
    console.log('connected to students');
    var sql = "SELECT * FROM `Usage`;";
    db.query(sql, function (err2, result, fields) {
        if (!err2) {
            console.log("result");
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        } else {
            console.log(err2);
        }
    });
});

// getting specific usage data from database

app.get('/usage/:id', cors(corsOptions), function (request, response) {
    console.log('connected to students');
    var id = request.params.id;
    var sql = "SELECT * FROM `Usage` WHERE usage_id = ?";
    db.query(sql, id, function (err2, result, fields) {
        if (!err2) {
            console.log("result");
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        } else {
            console.log(err2);
        }
    });
});

// using for login process on app by authenticating username and password

app.post('/login', cors(corsOptions), function (request, response) {
    console.log('on login page');
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    var sql = "SELECT * FROM Users WHERE username = ? AND `password` = ?";
    db.query(sql, [username, password], function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            console.log(json);
            response.send(json);
        }
    });
});