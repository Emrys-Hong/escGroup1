const models = require('../models');
var os = require("os");
var hostname = os.hostname();

exports.show_tickets_queued = function(req, res, next) {
    return models.ticket.findAll({
        where : { tag : 0 },
        include: [ models.user , models.message]
    }).then(tickets => {
        res.render('ticket/admin_0', { title: 'Tickets - Queued', tickets: tickets, user: req.user , subtitle: "queued" , hostname: hostname });
        })
};

exports.show_tickets_inprogress = function(req, res, next) {
    return models.ticket.findAll({
        where : { tag : 1 },
        include: [ models.user , models.message ]
    }).then(tickets => {
            res.render('ticket/admin_1', { title: 'Tickets - In Progress', tickets: tickets, user: req.user  , subtitle: "in-progress" , hostname: hostname });
        })
};

exports.show_tickets_solved = function(req, res, next) {
    return models.ticket.findAll({
        where : { tag : 2 },
        include: [ models.user , models.message ]
    }).then(tickets => {
            res.render('ticket/admin_2', { title: 'Tickets - Solved', tickets: tickets, user: req.user  , subtitle: "solved" , hostname: hostname });
        })
};

exports.show_ticket_messages = function(req, res, next) {
    return models.ticket.findOne({
        where : { ticketId : req.params.ticket_id },
        include: [ models.user , models.message ]
    }).then(ticket => {
        console.log("\n\n" + JSON.stringify(ticket) + "HEHAHAASD SDASD \n\n\n\n\n\n")
        res.render('ticket/ticket_messages', { title: 'Responding Tickets', ticket : ticket, user: req.user  , hostname: hostname });
    }).catch(err=>console.log("No ticket found: " + err));
};

exports.post_message = function(req, res, next) {
    const FULLNAME = req.user.firstName + " " + req.user.lastName;
    const TICKET_PAGE = "/tickets/" + req.user.userId +"/" + req.params.ticket_id;
    return models.ticket.findOne({
        where   : { ticketId : req.params.ticket_id },
        include : [ models.message ]
    }).then (ticket => {
        if (ticket.tag !== 1){
            ticket.update({
                tag :   1
            }).then( () => {
                return models.message.create({
                    fk_userId   : req.user.userId,
                    fk_ticketId : ticket.ticketId,
                    content     : req.body.content,
                    is_admin    : req.user.is_admin,
                    fullName    : FULLNAME,
                    email       : req.user.email,
                    phoneNumber : req.user.phoneNumber
                }).then(() => { res.redirect(TICKET_PAGE); })
            }).catch(err => { new Error("i cannot create message")})
        } else {
                return models.message.create({
                    fk_userId   : req.user.userId,
                    fk_ticketId : ticket.ticketId,
                    content     : req.body.content,
                    is_admin    : req.user.is_admin,
                    fullName    : FULLNAME,
                    email       : req.user.email,
                    phoneNumber : req.user.phoneNumber
                }).then(() => { res.redirect(TICKET_PAGE); })
        }
    }).catch(err => { new Error (err, "Unable to post message...")})
}

exports.delete_ticket = function(req, res, next) {
    return models.ticket.destroy({
        where: {
            ticketId: req.params.ticket_id
        }
    }).then(result => {
        res.redirect('/tickets');
    });
};

exports.delete_ticket_json = function(req, res, next) {
    return models.ticket.destroy({
        where: {
            ticketId: req.params.ticket_id
        }
    }).then(result => {
        res.send({ msg: "Success" }); // it sends a JSON object
    });
};