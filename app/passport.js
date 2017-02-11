var LocalStrategy = require('passport-local').Strategy;
var configAuth = require('./auth');

var mysql = require('mysql2');
var crypto = require('crypto');



module.exports = function(passport){

	//+================+
	//| SERIALIZE      |
	//+================+
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		var connection = mysql.createConnection({
			host		: configAuth.mysql.host,
			user		: configAuth.mysql.user,
			password	: configAuth.mysql.password,
			database	: configAuth.mysql.database,
		});
		connection.execute("SELECT * FROM `UserAccounts` WHERE `id`=? ",[id],function(err,rows){
			if (err)
				return done(err);
			if (rows.length) {
				connection.end();
				return done(err, rows[0]);
			}
		});
	});
	//+================+
	//| Local passport |
	//+================+
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		// series of config tests
		if (email !== req.body.emver ){
			return done(null, false, req.flash('signupMessage', 'That email is not the same.'));
		}else
		if (password !== req.body.pwver){
			return done(null, false, req.flash('signupMessage', 'That password does not match.'));
		}else{
			var connection = mysql.createConnection({
				host		: configAuth.mysql.host,
				user		: configAuth.mysql.user,
				password	: configAuth.mysql.password,
				database	: configAuth.mysql.database,
			});
			connection.execute("SELECT * FROM `UserAccounts` WHERE `email`=?",[email],function(err,rows){
				if (err)
					connection.end();
					return done(err);
				if (rows.length) {
					connection.end();
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}else{
					connection.execute("SELECT * FROM `UserAccounts` WHERE `Username`=?",[req.body.username],function(err,rows){
						if (err)
							connection.end();
							return done(err);
						if (rows.length) {
							connection.end();
							return done(null, false, req.flash('signupMessage', 'That username is in use.'));
						}else{
							var Cpassword = crypto.createHash('sha256').update(password).digest('base64');
							var valid = "";
							var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
							for(var i = 0; i < 8; i++) {
								valid += possible.charAt(Math.floor(Math.random() * possible.length));
							}
							var newUserMysql      = new Object();
							newUserMysql.Username = req.body.username;
							newUserMysql.email    = email;
							newUserMysql.password = Cpassword; // use the generateHash function in our user model
							//connection.execute("INSERT INTO `UserAccounts`(`Username`, `password`, `email`, `valid`) VALUES (?,?,?,?)",[req.body.username,password,email,valid],function(err,rows){ // use this as db progresses
							connection.execute("INSERT INTO `UserAccounts`(`Username`,`password`, `email`, `validationEmail`) VALUES (?,?,?,?)",[req.body.username,Cpassword,email,valid],function(err,rows){
								newUserMysql.id = rows.insertId;
								connection.end();
								return done(null, newUserMysql);
							});	
						}
					});
				}
			});
		}
	}));
	//+================+
	//| Local passport |
	//+================+
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		var Cpassword = crypto.createHash('sha256').update(password).digest('base64');
		var connection = mysql.createConnection({
			host		: configAuth.mysql.host,
			user		: configAuth.mysql.user,
			password	: configAuth.mysql.password,
			database	: configAuth.mysql.database,
		});
		connection.execute("SELECT * FROM `UserAccounts` WHERE `email`=?",[email],function(err,rows){
			if (err){
				connection.end();
				return done(null,false,req.flash('loginMessage',err));
			}
			if (!rows.length){
				connection.end();
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}
			if (!( rows[0].password == Cpassword)){
				connection.end();
			    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			}
			connection.end();
			return done(null, rows[0]);
		});
	}));
};