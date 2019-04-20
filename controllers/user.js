let models = require('../models');
let bcrypt = require('bcrypt');
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');       // this allow us to display an error message on the page that is going to be rendered. it is a one-time

const { isEmpty } = require('lodash');
const { validateUser } = require('../validators/signup');

var os = require("os");
var hostname = os.hostname();

/* Verify User accounts */
exports.show_verify = function(req,res,next) {
	res.render('users/verify', { title: "ACNAPI Login" , hostname: hostname, user: req.user })
}

exports.verify = function(req,res,next) {
	return models.user.update({
		is_verified	: true
	}, { where : {
		userId : req.params.user_id
		}
	}).then(() => {
		res.redirect("/");
	})
}

exports.show_change_email = function(req,res,next) {
	res.render('users/change_email', { title: "ACNAPI Login" , hostname: hostname, user: req.user })
}

exports.change_email = function(req, res, next) {
	return models.user.update({
		email : req.body.email,
	}, { where: {
		userId: req.user.userId
		}
	}).then(update => {
		res.redirect("/");    // redirect homepage
	}).catch(err => console.log("error again!" + err));
};

/* Forgot Password */
exports.show_forgot_password = function(req, res, next) {
	if (req.user != null) res.redirect("/");
	else
		res.render('users/forgot_password', { title: "ACNAPI Login" , user: req.user })
};

/**
 * randomized string and return random combination
 * @param {*} length 
 */
function makeid(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()][';/.,|}{:?><`~";
  
	for (var i = 0; i < length; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
  }
  

exports.forgot_password = function(req, res, next) {
	
	return models.user.findOne({
		where: { 
			email			: req.body.email, 
			phoneNumber		: req.body.phoneNumber
		}
	}).then(user => {
		if (user != null) {
			var newPW = makeid(12);		// make a new password with 12 characters
			var forgotPassword = require('../middleware/forgotPassword')(req,res,next,newPW);
			console.log(newPW);
			return models.user.update({
				password	: generateHash(newPW)
			}, { 
				where : {
					email		: user.email,
					phoneNumber	: user.phoneNumber
				}
			}).then(async function(){
				console.log(newPW);
				await forgotPassword
				return res.redirect("/");
				
				
			})
		}
		else return res.redirect("/");
	})
};
	

/* Login + Signup user credentials */
/**formData is basically the values keyed in by the user in the form fields */
exports.show_login = function(req, res, next){
	res.render('users/login', { title: "ACNAPI Login" , formData: {}, hostname: hostname });
}
exports.show_signup = function(req, res, next){
	res.render('users/signup', { title: "ACNAPI Register", formData: {}, errors: {} , hostname: hostname });
}
/** we use const for functions that are local (i.e. other files do not need to use this particular functions) */
const rerender_signup = function(errors, req, res, next){
	res.render('users/signup', { title: "ACNAPI Register", formData: req.body, errors: errors , hostname: hostname });
}

const rerender_login = function(errors, req, res, next){
	res.render('users/login', { title: "ACNAPI Register", formData: req.body, errors: errors , hostname: hostname });
}

const generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null)
}

exports.signup = function(req, res, next) {
	let errors = {};
	return validateUser(errors, req).then(errors => {
		if (!isEmpty(errors)){      // if the error field is not empty,then it will re-render the signup page to show errors in field
			rerender_signup(errors, req, res, next)
		}
		else {
			return models.user.findOne({
				where: {
					is_admin: true
				}
			}).then(user => {
				let newUser;
				if (user != null) {
					newUser = models.user.build({
						email: req.body.email,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						phoneNumber: req.body.phoneNumber,
						password: generateHash(req.body.password)
					});
				}else {
					newUser = models.user.build({
						email: req.body.email,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						password: generateHash(req.body.password),
						is_admin: true,
						phoneNumber: req.body.phoneNumber,
					});
				}return newUser.save().then(result => {
					passport.authenticate('local', {
						successRedirect: "/",
						failureRedirect: "/users/signup",
						failureFlash: true
					})(req, res, next);
				})
			})
		}
	})
}

exports.login = function(req,res,next){
	let errors = {};
	return models.user.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (user == null) {
			errors["credentials"] = "Wrong credentials entered.\nClick on 'Forget Password' if you cannot remember your credentials"
			rerender_login(errors, req, res, next);
		}
		else {
			passport.authenticate('local', {
				successRedirect: "/",
				failureRedirect: "/users/login",
				failureFlash: true
			})(req, res, next);
		}
	});
}

exports.logout = function(req,res,next){
	req.logout();
	req.session.destroy();
	res.redirect('/');
}