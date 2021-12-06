var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Id ou senha incorreta! Por favor tente novamente.');
			}			
			response.end();
		});
	} else {
		response.send('Digite o ID e a senha!');
		response.end();
	}
});

app.get('/dashboard', function(request, response) {
	if (request.session.loggedin) {
		response.send('Bem vindo, ' + request.session + 'admin!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);