// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Export a function, so that we can pass 
// the app and io instances from the app.js file:

const models = require('../models');


exports.room = function(req, res){

	// choose a room
	res.render('chat/room' , { hostname: hostname });
};

exports.create = function(req,res){

	// Generate unique id for the room
	var id = Math.round((Math.random() * 1000000));

	// Redirect to the random room
	res.redirect('/chat/'+id);
}

exports.chat = function(req,res){

	// Render the chant.html view
	res.render('chat/chat', { hostname: hostname });
}

exports.select = function(req, res) {
	return models.user.findAll({
        where : {
            is_admin         : true
        }
    }).then(admins=> {
        res.render('chat/select', {admins: admins, user: req.user});
    });
	
}

exports.chat_with_specific_admin = function(req, res) {
	res.render('chat/chat', {user: req.user, admin_id: req.params.admin_id})
}

/*******************
 * these functions are for chat with any admin
 */
exports.all_admin_redirect = function(req, res) {
	res.redirect('/chat/user/' + req.params.user_id);
}

exports.chat_with_any_admin = function(req, res) {
	res.render('chat/chat', {user:req.user});
}