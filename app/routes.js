module.exports = function(app,passport){

	//+================+
	//| show index     |
	//+================+
	app.get('/',function(req,res){
		res.render('index.ejs');
	});

	//+================+
	//| Local Login    |
	//+================+
	app.get('/login', function(req,res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});
	app.post('/login',passport.authenticate('local-login',{
		successRedirect: '/user',
		failureRedirect: '/user',
		failureFlash: true
	}));

	//+================+
	//| Local Register |
	//+================+
	app.get('/register', function(req,res){
		res.render('register.ejs',{message: req.flash('signupMessage')});
	});
	app.post('/register',passport.authenticate('local-signup',{
		successRedirect: '/user',
		failureRedirect: '/user',
		failureFlash: true
	}));

	//+===============+
	//|    Account    |
	//+===============+
	app.get('/user', isLoggedIn,function(req,res){
		res.render('user.ejs',{user:req.user});
	});
	app.get('/logout', function(req,res){
		req.logout();
		res.redirect('/');
	});

	app.get('/live', function(req,res){
		res.render('live.ejs');
	});

	app.get('/history', function(req,res){
		res.render('history.ejs');
	});

	app.get('/dev', function(req,res){
		res.render('user.ejs',{"user":{"id":09809,"username":"henk"}});
	});

	//+================+
	//|     prices     |
	//+================+
	app.get('/prices', function(req,res){
		res.render('prices.ejs');
	});

	//+===============+
	//|     other     |
	//+===============+
	app.get('*', function(req,res){
		res.render('404.ejs');
	});
};

function isLoggedIn(req, res, next){
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}
