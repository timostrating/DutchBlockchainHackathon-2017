var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('express-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var mysql    = require('mysql2');


var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine','ejs');

app.use(session({ secret: 'ForABetterTomorrow' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(express.static(__dirname + '/views'));

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('overview', function (){
	});
	socket.on('Actuators',function(){
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});






require('./app/routes.js')(app,passport);
require('./app/passport')(passport);


http.listen(port,function(){
	console.log('Boot initiated');
	console.log('initializing web port 3000');
});

