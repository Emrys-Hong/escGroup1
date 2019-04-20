var express = require('express');
var router = express.Router();

let user = require('../controllers/user');
let {email_verification} = require('../middleware/send_verification');
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
  

/* Login Page */
router.get('/login', user.show_login);
router.get('/signup', user.show_signup);
router.post('/login',user.login);
router.post('/signup',user.signup);
router.post('/logout', user.logout);
router.get('/logout', user.logout);
router.get('/forgot_password', user.show_forgot_password);
router.post('/forgot_password', user.forgot_password);

/* If User is not verified */
router.get('/not_verified', user.show_verify);
router.get('/send_email', email_verification);
router.post('/change_email', user.change_email);
router.get('/change_email', user.show_change_email);


router.get('/verify/:user_id', user.verify);

module.exports = router;
