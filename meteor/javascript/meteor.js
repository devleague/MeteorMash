var Songs = new Meteor.Collection('Songs');

if (Meteor.isClient) {
  // var lattitude = location.coords.lattitude;
  // var lon = location.coords.longitude;
  Session.set('loc','?');

  Template.meteor.rendered = function(){
    var output;
    navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
    output = Session.get('loc');
    return Session.get('loc');
  };

  function foundLocation(location){
    Session.set('lat',location.coords.latitude);
    Session.set('lon',location.coords.longitude);

    
  }

  function noLocation(){
    alert('no location');
  }
  // Template.form.data(){
  //   var "https://maps.googleapis.com/maps/api/geocode/json?latlng="+Session.get('lat')+","+Session.get('lon')+"&sensor=false&key=AIzaSyAqdbtbbf_utGmNIWecy6K156be9BmMapE"
  // }]
  var locationUrl  = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+Session.get('lat')+","+Session.get('lon')+"&sensor=false&key=AIzaSyAqdbtbbf_utGmNIWecy6K156be9BmMapE";

  Meteor.http.call("post", locationUrl, function(err, location){
    console.log(location.data.results[4].formatted_address);
    Template.data.components = function(){
      return location.data.results[4].formatted_address;
    }
  });
 Template.meteor.events({
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
      Songs.upsert(
        {"_id":this._id},
        { $inc : {"counter" : -1}},
        function(err) {
          if(typeof err !== 'undefined') {
            console.log(err);
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({checkGeo: function(){
      this.unblock();
 
    }});  
  });
}
