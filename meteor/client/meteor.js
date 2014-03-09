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

  // Session.set('loc','?');
  // var output;
  // output = Session.get('loc');
  // navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

  // Cursor of song collection //
  var songList = Songs.find( {}, {sort: { counter:-1 } });
  
  // songList.observe ({
    
  //   added: function (document) {

  //   }, // Use either added() OR(!) addedAt()

  //   removed: function (oldDocument) {

  //   }, // Use either removed() OR(!) removedAt()

  //   movedTo: function (document, fromIndex, toIndex, before) {

  //     if (toIndex == 0) {

  //       Songs.update( { _id : document._id }, { $set : { "nowPlaying" : true } }, function (err) {
          
  //         console.log(err);

  //       });

  //       console.log(document);
  //     }

  //   }

  // });

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

// Template.count.counter = function(){

// }

Template.currentSong.current = function () {
  return Songs.findOne({status: "now"});
}

// Renders published songs //
Template.songList.songs = function () {


  return Songs.find( {}, { sort: { counter: -1 } });

};// ends Template.songList.songs



// Renders Pagination for the next button //
Template.songList.nextText = function () {

  // Shows next 20 for user navigation //
  return ( Number( Session.get( 'songCursor' ) ) + 10 ) + " - " + ( Number( Session.get( 'songCursor' )) + 20);

};// ends Template.songList.nextText


// Renders pagination for previous button //
Template.songList.previousText = function () {

  // Checks if the collection is empty //
  if( Number( Session.get( "songCursor" )) < 10) {
    
    // show nothing //
    return '';

  }

  // else if there is, show the previous 10 //
  return ( Number( Session.get( 'songCursor' )) - 10) + " - " + ( Number( Session.get( 'songCursor' ) ));

};// ends Template.songList.previousText


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

// Template.register.events({
//   'submit #register-form': function(event, template){
//     event.preventDefault();
//     var partyName = template.find('#account-partyName').value;
//     var partyPass = template.find('#account-partyPass').value;
//     var partyEmail = template.find('#account-email').value;
//     Accounts.createUser({
//       username: partyName,
//       password: partyPass,
//       email: partyEmail,
//     }, function (error) {
//       if(error){
//         //inform the user failed
//       }else{

//       }
//     });
//     return false;
//   }
// });

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

    // Downvoted removes song from mongo //
    if ( this.counter <= -9 ) {

      // mongo remove by id //
      Songs.remove(this._id);

    }

    else

      {
        
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