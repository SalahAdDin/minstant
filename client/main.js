// subscribe to the chats collection
Meteor.subscribe("Chats");
Meteor.subscribe("Users");

///
// helper functions
///
Template.available_user_list.helpers({
    users: function () {
        return Meteor.users.find({});
    },
    count: ()=> {
        return Meteor.users.find().count();
    },
    chunk: function (chunkSize) {
        var R = [];
        var users = Meteor.users.find().fetch();
        var count = Meteor.users.find().count();
        for (var i = 0, len = count; i < len; i += chunkSize)
            R.push(users.slice(i, i + chunkSize));
        return R;
    }
});

Template.available_user.helpers({});


Template.chat_page.helpers({
    messages: function () {
        var chat = Chats.findOne({_id: Session.get("chatId")});
        return chat.messages;
    },
    other_user: function () {
        var chat = Chats.findOne({_id:Session.get("chatId")});
        if(chat.user1Id === Meteor.userId())
            return chat.user2Id;
        else
            return chat.user1Id;
    }

});

Template.chat_message.helpers({});

Template.navbar.helpers({
    avatar: function () {
        return Meteor.user().profile.avatar;
    }
});

///
// EVENTS
///
Template.chat_page.events({
// this event fires when the user sends a message on the chat page
    'submit .js-send-chat': function (event) {
        // stop the form from triggering a page reload
        event.preventDefault();
        // see if we can find a chat object in the database
        // to which we'll add the message
        var chat = Chats.findOne({_id: Session.get("chatId")});
        if (chat) {// ok - we have a chat to use
            var msgs = chat.messages; // pull the messages property
            if (!msgs) {// no messages yet, create a new array
                msgs = [];
            }
            // is a good idea to insert data straight from the form
            // (i.e. the user) into the database?? certainly not.
            // push adds the message to the end of the array
            msgs.push({
                avatar: Meteor.user().profile.avatar,
                username: Meteor.user().username,
                userid: Meteor.userId(),
                text: event.target.chat.value,
                onDate: new Date()
            });
            // reset the form
            event.target.chat.value = "";
            // put the messages array onto the chat object
            chat.messages = msgs;
            // update the chat object in the database.
            Meteor.call("updateMessages", chat._id, chat);
        }
    }
});
