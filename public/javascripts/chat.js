$(function (user) {
  // getting the id of the room from the url
  if (window.location.pathname.includes('/chat/admin'))
    // var id = Number(window.location.pathname.match(/\/chat\/admin\/(\d+)$/)[1]);
    var id = window.location.pathname.split('/')[3];
  else
    var id = window.location.pathname.split('/')[3];
  // connect to the socket
  var socket = io();

  // variables which hold the data for each person
  var name = "",
    email = "",
    img = "",
    friend = "";

  // cache some jQuery objects
  var section = $(".section"),
    footer = $("footer"),
    onConnect = $(".connected"),
    inviteSomebody = $(".invite-textfield"),
    personInside = $(".personinside"),
    chatScreen = $(".chatscreen"),
    left = $(".left"),
    noMessages = $(".nomessages"),
    tooManyPeople = $(".toomanypeople");

  // some more jquery objects
  var chatNickname = $(".nickname-chat"),
    leftNickname = $(".nickname-left"),
    loginForm = $(".loginForm"),
    yourName = $("#yourName"),
    yourEmail = $("#yourEmail"),
    hisName = $("#hisName"),
    hisEmail = $("#hisEmail"),
    chatForm = $("#chatform"),
    textarea = $("#message"),
    messageTimeSent = $(".timesent"),
    chats = $(".chats");

  // these variables hold images
  var ownerImage = $("#ownerImage"),
    leftImage = $("#leftImage"),
    noMessagesImage = $("#noMessagesImage");

  // on connection to server get the id of person's room
  socket.on("connect", function () {
    socket.emit("load", '#{user}', id);
  });

  // save the gravatar url
  socket.on("img", function (data) {
    img = data;
  });

  // receive the names and avatars of all people in the chat room
  socket.on("peopleinchat", function (data) {

    
    console.log('emrys: user.firstName', user.firstName);


    if (data.number === 0) {
      name = user.firstName;
      email = user.email;
      showMessage("inviteSomebody");
      socket.emit("login", { user: name, avatar: email, id: id });
    } else if (data.number === 1) {
      name = user.firstName;
      email = user.email;
      socket.emit("login", { user: name, avatar: email, id: id });
    } else {
      showMessage("tooManyPeople");
    }
  });

  // Other useful
  socket.on("startChat", function (data) {
    console.log(data);
    if (data.boolean && data.id == id) {
      chats.empty();

      if (name === data.users[0]) {
        showMessage("youStartedChatWithNoMessages", data);
      } else {
        showMessage("heStartedChatWithNoMessages", data);
      }

      chatNickname.text(friend);
    }
  });

  socket.on("leave", function (data) {
    if (data.boolean && id == data.room) {
      showMessage("somebodyLeft", data);
      chats.empty();
    } 
  });

  socket.on("tooMany", function (data) {
    if (data.boolean && name.length === 0) {
      showMessage("tooManyPeople");
    }
  });

  socket.on("receive", function (data) {
    showMessage("chatStarted");

    if (data.msg.trim().length) {
      createChatMessage(data.msg, data.user, data.img, moment());
      scrollToBottom();
    }
  });

  textarea.keypress(function (e) {
    // Submit the form on enter

    if (e.which == 13) {
      e.preventDefault();
      chatForm.trigger("submit");
    }
  });

  chatForm.on("submit", function (e) {
    e.preventDefault();

    // Create a new chat message and display it directly

    showMessage("chatStarted");

    if (textarea.val().trim().length) {
      createChatMessage(textarea.val(), name, img, moment());
      scrollToBottom();

      // Send the message to the other person in the chat
      socket.emit("msg", { msg: textarea.val(), user: name, img: img });
    }
    // Empty the textarea
    textarea.val("");
  });

  // Update the relative time stamps on the chat messages every minute

  setInterval(function () {
    messageTimeSent.each(function () {
      var each = moment($(this).data("time"));
      $(this).text(each.fromNow());
    });
  }, 60000);

  // Function that creates a new chat message

  function createChatMessage(msg, user, imgg, now) {
    var who = "";

    if (user === name) {
      who = "me";
    } else {
      who = "you";
    }

    var li = $(
      "<li class=" +
      who +
      ">" +
      '<div class="image">' +
      "<img src=" +
      imgg +
      " />" +
      "<b></b>" +
      '<i class="timesent" data-time=' +
      now +
      "></i> " +
      "</div>" +
      "<p></p>" +
      "</li>"
    );

    // use the 'text' method to escape malicious user input
    li.find("p").text(msg);
    li.find("b").text(user);

    chats.append(li);

    messageTimeSent = $(".timesent");
    messageTimeSent.last().text(now.fromNow());
  }

  function scrollToBottom() {
    $("html, body").animate(
      { scrollTop: $(document).height() - $(window).height() },
      1000
    );
  }

  function showMessage(status, data) {
    if (status === "connected") {
      section.children().css("display", "none");
      onConnect.fadeIn(1200);
    } 
    
    else if (status === "inviteSomebody") {
      // Set the invite link content
      inviteSomebody.css('display', 'block');
      inviteSomebody.parent().css('display', 'block');
      
      onConnect.fadeOut(1200, function () {
        inviteSomebody.fadeIn(1200);
      });
    } 
    
    else if (status === "personinchat") {
      onConnect.css("display", "none"); // emrys
      // chatForm.css('display', 'none'); // emrys added
      // chatForm.css('visibility', 'hidden');
      personInside.fadeIn(1200);
      chatNickname.text(data.user);
      ownerImage.attr("src", data.avatar);
    } 
    
    else if (status === "youStartedChatWithNoMessages") {
      chatForm.parent().css('display', 'block'); 
      inviteSomebody.css('display', 'none');
      inviteSomebody.parent().css('display', 'none');
      noMessages.css('display', 'block');
      noMessages.parent().css('display', 'block');
      left.fadeOut(1200, function () {
        inviteSomebody.fadeOut(1200, function () {
          noMessages.fadeIn(1200);
          footer.fadeIn(1200);
        });
      });

      friend = data.users[1];
      noMessagesImage.attr("src", data.avatars[1]);
    } 
    
    else if (status === "heStartedChatWithNoMessages") {
      chatForm.parent().css('display', 'block'); 
      inviteSomebody.css('display', 'none');
      inviteSomebody.parent().css('display', 'none');
      noMessages.css('display', 'block');
      noMessages.parent().css('display', 'block');
      personInside.fadeOut(1200, function () {
        noMessages.fadeIn(1200);
        footer.fadeIn(1200);
      });

      friend = data.users[0];
      noMessagesImage.attr("src", data.avatars[0]);
    }

    else if (status === "chatStarted") {
      section.children().css("display", "none");
      chatForm.parent().css('display', 'block');// emrys
      chatScreen.css("display", "block");
    }

    else if (status === "somebodyLeft") {
      leftImage.attr("src", data.avatar);
      leftNickname.text(data.user);

      section.children().css("display", "none");
      footer.css("display", "none");
      left.parent().css('display', 'block'); // emrys
      left.fadeIn(1200);
      left.parent().css('display', 'block'); // emrys
    }

    else if (status === "tooManyPeople") {
      section.children().css("display", "none");
      tooManyPeople.fadeIn(1200);
    }
  }
});
