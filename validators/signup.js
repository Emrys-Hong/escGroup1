let validator = require('validator');
let models = require('../models');


/** this is going to rcv an error object that is empty and it is going to populate as we find errors in each form input fields 
 * the errors we will find is given in req field
 * 

 THIS IS A SYNCHRONOUS PIECE OF CODE
*/
const validateCreateUserFields = function(errors, req){
    if (!validator.isEmail(req.body.email)){
        errors["email"] = "Please use valid email!";
    }
    if (!validator.isAscii(req.body.password)){
        errors["password"] = "Invalid characters in password, try another one!";
    }
    if (!validator.isLength(req.body.password, {min: 8})){
        errors["password"] = "Ensure that your password has a minimum of 8 characters";
    }

    if (!validator.equals(req.body.password,req.body.password2)){                   // have not included in test cases
        console.log(validator.equals(req.body.password,req.body.password2))
        errors["password2"] = "Those passwords didn't match. Try again."
    }
    if (!validator.isNumeric(req.body.phoneNumber) || !validator.isLength(req.body.phoneNumber, {min:8, max:8})){
        errors["phoneNumber"] = "Key in a valid phone number with 8 digits (i.e. 91234567). Omit all special characters and spaces."
    }
    
}
/** we do not need to add in return email because email is already an object that will display the errors for us, if necessary, automatically */


/**program execution:
 * when we define our body for validateuser, when we query our database, this piece of code is an asynchronous
 * piece of code. 
 * 
 * this means it will execute some time in the future, which also means we will execute the code some time in the future.
 * 
 * on the other hand, validateCreateUserFields is a synchronous piece of code. that means the conditions will be performed sequentially.
 * 
 * Our form requires both the synchronous validateCreateUserFields function, and the asynchronous validateUser functio by
 * fusing the 2 of the functions together.
 * 
 * to do that, we need to use a concept called Promise, and make the entire body asynchronous
 * to make use of both in a single function, we need to define a Promise that will define both functions in a single body.  
 */
exports.validateUser = function(errors, req){
    return new Promise(function(resolve, reject){
        validateCreateUserFields(errors,req);
        return models.user.findOne({
            where: {
                email: req.body.email
            }
        }).then( u => {
            if (u !== null){
                errors["email"] = "Email is already in use. Please login using your email or reset your password"
            }
            resolve(errors);
        })
    })
}