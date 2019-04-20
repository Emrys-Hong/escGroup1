function deleteticket(ticketId){
    $.ajax({
        url: '/ticket/' + ticketId + '/delete-json',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ticketId}), // JSON.stringify is used to send data over to server. the server side will have a JSON.parse(string)
        type: 'POST',
        success: ((res) => {
            // Replace follow button with unfollow.
            console.log("Result: ", res)
            $("#"+ticketId).remove();         // we are using a $ sign here. it means we are making a call to JQuery. $.ajax --> function belonging to JQUERY
                                            // When we use $("#"+ticket.id), it is necessary to use "#" to indicate that we are looking for an element with that particular ID
        }),
        error: ((error) => {
            console.log("Error:",error);
        })
    })
}

/**
 * ajax allows us to make a HTTP request to our webserver using javascript
 * also sending and receiving data in a form of JSON objects
 * 
 * why we use AJAX is so that the function is done on the background without having to make any change
 * 
 * Success, Error are response from the server.
 * However, if the script is successful, since the action is done on the background, we are not going to leave the webpage.
 *  We expect to have the email removed after the successful operation...
 *  We need to modify the currently served HTML page displayed in the browser. 
 *      we do this dynamically in javascript and delete the HTML that corresponds with the email.
 *      the currently served HTML browser is called DOM (Document Object Model).
 * 
 *  Jquery has convenient functions that help us manipulate the DOM, such as remove() function in `line 11`.
 *      we are looking for a HTML element with $("#" + ticketID)
 *      however, for jquery to find that element, we must assign an ID to each line of email it displays. to do that, we add the attribute to the for loop in landing.pug
 */