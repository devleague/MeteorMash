var Songs = new Meteor.Collection('Songs');

if (Meteor.isClient) {

  Template.hello.events({
    'click input#addSong': function (event, template) {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      var songName = template.find("#songName").value;
      Songs.insert({'name' : songName, 'counter': 0});
    }
  });

  Template.song_list.songs = function() {
    return Songs.find({}, {sort: {counter: -1}});
  //   return [];
  };

  // Template.song_list.sort = function() {
  //   return Songs.find({}, {sort: {counter: -1}}); 
  // }

  Template.song.events({
    'click li' : function() {
      Session.set("is_selected", this._id);
      console.log('cookies');
    },
    'click a.upvote' : function(event, template){
      //console.log("starting find:"+this._id);
      Songs.upsert(
        {"_id":this._id},
        { $inc : {"counter" : 1 }},
        function(err){
          if(typeof err !== 'undefined'){
            console.log(err);
          }
        }
      );
    },
    
    'click a.downvote' : function(event, template) {
      if(this.counter < -10) {
        Songs.remove(this._id);
      } else {
        Songs.upsert(
          {"_id":this._id},
          { $inc : {"counter" : -1}},
          function(err) {
            if(typeof err !== 'undefined') {
              console.log(err);
            }
          }
        );
      }  
    }
  })
};
