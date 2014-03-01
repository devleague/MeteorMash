var Songs = new Meteor.Collection('Songs');

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to meteormash.";
  };

  Template.hello.events({
    'click input#addSong': function (event, template) {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      var songName = template.find("#songName").value;
      Songs.insert({'name' : songName});
      template.find("#songName").value;
    }
  });

  Template.song_list.songs = function() {
    return Songs.find();
  };

  Template.song.events({
    'clicka#upvote' : function(){
      var count = 0;
      count++;
      console.log(count);
    },
    'click li' : function() {
      Session.set("is_selected", this._id);
    },
  
  });
    Template.song.is_selected = function() {
      return Session.equals("is_selected", this._id) ? "selected" : "";

    };
}

if (Meteor.isServer) {
  console.log("Server is on")
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
