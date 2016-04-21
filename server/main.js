Chats.allow({
    insert: function (userId, doc) {
        return !!userId;
    },
    update: function (userId, doc, fields, modifier) {
        return !!userId;
    },
    remove: function (userId, doc) {
        return !!userId;
    },
    fetch: []
});

// Publications
Meteor.publish("Users", function () {
    return Meteor.users.find({}, {fields: {"services": 0, "emails": 0}});
});

Meteor.publish("Chats", function () {
    return Chats.find({
        $or: [
            {user1Id: this.userId},
            {user2Id: this.userId}
        ]
    });

});

// Add avatar URL to user profile uppon user creation
Accounts.onCreateUser((options, user) => {
    console.log("Creating user " + user.username + " with password: '" + options.password + "' and username/email: " + options.email);
    user.profile = {};
    user.emails = [{address: options.email, verified: false}];
    user.password = options.password;
    return user;
});

////
// METHODS
////
Meteor.methods({
    createChat: (user1, user2) => {
        if (!this.userId) {
            throw new Meteor.Error("logged-out", "The user must be logged in to post a comment.");
        }

        // Check if users exist on the database
        if (Meteor.users.find({_id: user1}) && Meteor.users.find({_id: user2})) {
            console.log("Inserting a chat...")
            Chats.insert({user1Id: user1, user2Id: user2}, function (err, result) {
                if (err) {
                    return err;
                }
                else {
                    console.log("Chat " + result + " created!");
                    return result;
                }
            });
        }
    }, //end of createChat

    updateMessages: (chatId, messages) => {
        Chats.update(chatId, messages);
    }
});
