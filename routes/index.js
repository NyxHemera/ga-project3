var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');


// Home Page
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Play On Words', message: req.flash(), loggedIn: currentUser });
});


// Signup Page
router.route('/signup')
	.get(function(req, res, next) {
		res.render('signup.ejs', { message: req.flash(), loggedIn: currentUser });
	})
	.post(function(req, res, next) {
		var signUpStrategy = passport.authenticate('local-signup', {
			successRedirect: '/users/',
			failureRedirect: '/signup',
			failureFlash: true
		});
		return signUpStrategy(req, res, next);
	});

// Login Page
router.route('/login')
	.get(function(req, res, next) {
		res.render('login.ejs', { message: req.flash(), loggedIn: currentUser });
	})
	.post(function(req, res, next) {
		User.findOne({'local.email': req.body.email}, function(err, user) {
			if(err) return console.log(err);
			if(!user) {
				res.redirect('/login');
			}else {
				var loginProperty = passport.authenticate('local-login', {
					successRedirect: '/users/'+ user._id,
					failureRedirect: '/login',
					failureFlash: true
				});
				return loginProperty(req, res, next);
			}
		});
	});


router.route('/wordcloud')
	.get(function(req, res, next) {
		res.render('tests/wordcloud.ejs', {});
	});

// Logout
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
