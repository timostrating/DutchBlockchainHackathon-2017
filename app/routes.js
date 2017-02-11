module.exports = function(app,passport){
	//+================+
	//| show index     |
	//+================+
	app.get('/',function(req,res){
		res.render('index.ejs');
	});
	app.get('/2',function(req,res){
		res.render('user2.ejs');
	});
	//+================+
	//| Local Login    |
	//+================+
	app.get('/login',function(req,res){
		res.render('login.ejs',{message: req.flash('loginMessage')});
	});
	app.post('/login',passport.authenticate('local-login',{
		successRedirect: '/user',
		failureRedirect: '/login',
		failureFlash: true
	}));
	//+================+
	//| Local Register |
	//+================+
	app.get('/register',function(req,res){
		res.render('register.ejs',{message: req.flash('signupMessage')});
	});
	app.post('/register',passport.authenticate('local-signup',{
		successRedirect: '/user',
		failureRedirect: '/register',
		failureFlash: true
	}));
	//+===============+
	//| handle other  |
	//+===============+
	app.get('/user',isLoggedIn,function(req,res){
		res.render('user.ejs',{user:req.user});
	});
	app.get('/logout',function(req,res){
		req.logout();
		res.redirect('/');
	});
};
function isLoggedIn(req,res,next){
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}