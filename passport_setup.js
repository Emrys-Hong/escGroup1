// we added this line because we need to define a strategy our passport will use to authenticate our users. Since we are using email and password (stored in our own db), we are going to use passport-local
let LocalStrategy = require('passport-local').Strategy;

/************************* Validating password ************************/
let bcrypt = require('bcrypt');
let models = require('./models');

const validPassword = function(user,password){
    return bcrypt.compareSync(password,user.password);
}
module.exports = function(passport){
    // serializeUser determines which handler to the user object is to be saved in the session
    passport.serializeUser(function(user,done){
        done(null,user.userId)
    });
    // deserializeUser will retrieve that object using that handler
    passport.deserializeUser(function(id, done) {
        models.user.findOne({
            where: {
                'userId' : id
            }
        }).then(user =>{
            if (user == null){
                done(new Error('Wrong user id.'))
            }done(null,user);
        })
    });
    // we added this statement so that the setup know that we are using LocalStrategy to auth
    passport.use(new LocalStrategy({
        // 'email' and 'password' are the names of our 2 js object that will be parsed from login.pug
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true     // this was added to respond to req.
    },
    // we are adding this function to validate email and password
    function(req,email,password,done){
        return models.user.findOne({
            where: {
                'email' : email
            },
        }).then(user => {
            /* Perform all the error-catches. if none caught, then email and password should validate! */
            if (user == null) {
                req.flash('message','Incorrect credentials.')
                return done(null, false)
            }else if (user.password == null || user.password == undefined){
                req.flash('message','You must reset your password')
                return done(null, false)
            }else if(!validPassword(user, password)){
                req.flash('message','Incorrect credentials')
                return done(null,false)
            }return done(null,user); 
        }).catch(err => {       // we continue to catch errors even though we should have included them in the conditions above. this is to prevent any problems that might come across that wasn't caught by our conditions (i.e. internal server/database errors)
            done(err,false)
        })
    }))
}
