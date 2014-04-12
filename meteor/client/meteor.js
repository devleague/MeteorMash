// Session for 'songCursor' = page
Session.setDefault('songCursor', 0);

// Initiates manage session //
Meteor.autorun(function(){

  // import published docs. from server //
  Meteor.subscribe("songs",Session.get('songCursor'));
  Meteor.subscribe("counts");

});

// On start up watches songlist and gets geo-location //
Meteor.startup (function() {

  // Cursor of song collection //
  var songList = Songs.find( {}, {sort: { counter:-1 } });
  
});// ends meteor.startup



// Sets session if location found //
function foundLocation (location) {

  // coordinates of user //
  Session.set('lat',location.coords.latitude);
  Session.set('lon',location.coords.longitude);

  // Sets url to send to google //
  var locationUrl  = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+Session.get('lat')+","+Session.get('lon')+"&sensor=false&key=AIzaSyAqdbtbbf_utGmNIWecy6K156be9BmMapE";

  // POSTING geolocation //
  Meteor.http.call("post", locationUrl, function (err, location) {

   // Renders location //
    Template.data.components = function () {

      console.log("google");

      return location.data.results[4].formatted_address;

    };

  });

}// ends foundLocation


// else noLocation found user denied access //
function noLocation () {
  
  alert('no location');

}


Template.currentSong.current = function () {
  return Songs.findOne({status: "now"});
}

Template.leaderSong.leader = function () {
  return Songs.find({}, {sort: {counter:-1}, limit:1}).fetch()[0];
}


// Renders published songs //
Template.songList.songs = function () {

  return Songs.find( {}, { sort: { counter: -1 } });

};// ends Template.songList.songs


// Even listener for button click //
Template.navbar.events ({

  // When clicked song is sent to mongo //
  'click #addSong': function (event, template) {

    event.preventDefault();

    // template data, if any, is available in 'this' //
    var songName = template.find( "#songName" ).value;

    Songs.insert( { 'name' : songName, 'counter': 0 } );

    return false;
  },

  'submit #loginform': function (event, template) {
    event.preventDefault();
    var partyname = template.find('#partyName').value;
    var password = template.find('#partyPassword').value;
    Meteor.loginWithPassword(partyname,password,function(err){
      console.log(err);
    });
  }

});// ends Template.navbar.events

// Event listener to render songs for pagination //
Template.songList.events ({

  // Show previous 10 songs //
  'click .previous': function (evt, tmpl) {

    if ( Number( Session.get( 'songCursor' ) ) > 9 ) {
       
       Session.set('songCursor', Number( Session.get( 'songCursor' ) ) - 10);
    
    }

  },

  // Show next 10 songs //
  'click .next' : function (evt, tmpl) {

    Session.set( 'songCursor' , Number( Session.get( 'songCursor' ) + 10 ));

  }

});// ends Template.songList.events


// Event listener to render songs for pagination //
Template.songList.events ({

  // Show previous 10 songs //
  'click .previous': function (evt, tmpl) {

    if ( Number( Session.get( 'songCursor' ) ) > 9 ) {
       
       Session.set('songCursor', Number( Session.get( 'songCursor' ) ) - 10);
    
    }

  },

  // Show next 10 songs //
  'click .next' : function (evt, tmpl) {

    Session.set( 'songCursor' , Number( Session.get( 'songCursor' ) + 10 ));

  }

});// ends Template.songList.events


// Listening for upvotes //
Template.song.events ({

  // Clicked set session //
  'click li' : function() {

    Session.set( "is_selected" , this._id );

    //console.log('cookies');

  },

  // When clicked counter increases //
  'click button.upvote' : function(event, template){


    // updates mongo //
    Songs.upsert (

      { "_id" : this._id },

      // mongo increment //
      { $inc : { "counter" : 1 } },

      // Handle errors //
      function (err) {


        if ( typeof err !== 'undefined' ) {
          
          console.log(err);

        }

      }

    );

  },
  
  // When downvoted decrease counter //
  'click button.downvote' : function(event, template) {

    
    var checkCounter = Songs.findOne({"_id" : this._id});

    if (checkCounter.counter !== -10){
    // Updates mongo //
      Songs.upsert(

        { "_id" : this._id },
        
        // Decrease vote counter //
        { $inc : { "counter" : -1 } },
        
        // Handle errors //
        function (err) {

          if ( typeof err !== 'undefined' ) {

            console.log(err);
            
          }

        }

      );
    }

  }

});// ends Template.songs.events


Template.user_loggedout.events({
  "click #login": function(e, tmpl){
    Meteor.login
  }
});