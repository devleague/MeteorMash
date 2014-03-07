Session.setDefault('songCursor', 0);
Meteor.autorun(function(){
  Meteor.subscribe("songs",Session.get('songCursor'));
  Meteor.subscribe("counts");
});

Meteor.startup(function(){
  // Session.set('loc','?');
  // var output;
  // output = Session.get('loc');
  // navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
  var songList = Songs.find({}, {sort: {counter:-1}});
  songList.observe({
    added: function (document) {

    }, // Use either added() OR(!) addedAt()
    removed: function (oldDocument) {
      // ...
    }, // Use either removed() OR(!) removedAt()
    movedTo: function (document, fromIndex, toIndex, before) {
      if(toIndex == 0){
        Songs.update({_id: document._id}, { $set : {"nowPlaying": true}},function(err){
          console.log(err);
        });
        console.log(document);
      };
    }
  });

})

function foundLocation(location){
  Session.set('lat',location.coords.latitude);
  Session.set('lon',location.coords.longitude);
  var locationUrl  = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+Session.get('lat')+","+Session.get('lon')+"&sensor=false&key=AIzaSyAqdbtbbf_utGmNIWecy6K156be9BmMapE";

  Meteor.http.call("post", locationUrl, function(err, location){
    Template.data.components = function(){
      console.log("google");
      return location.data.results[4].formatted_address;
    }
  });
}

function noLocation(){
  alert('no location');
}

// Template.count.counter = function(){

// }
Template.songList.songs = function(){
  return Songs.find({},{sort:{counter:-1}});
}

Template.songList.nextText=function(){
  return (Number(Session.get('songCursor')) + 10) + " - " + (Number(Session.get('songCursor')) + 20) 

}

Template.songList.previousText=function(){
  if(Number(Session.get("songCursor"))< 10){
    return '';
  }
  return (Number(Session.get('songCursor')) - 10) + " - " + (Number(Session.get('songCursor'))) 
}

Template.navbar.events({
  'click #addSong': function (event, template) {
    // template data, if any, is available in 'this'
    var songName = template.find("#songName").value;
    Songs.insert({'name' : songName, 'counter': 0});
  }
});


Template.songList.events({
  'click .previous': function(evt, tmpl){
    if(Number(Session.get('songCursor')) > 9){
       Session.set('songCursor', Number(Session.get('songCursor')) - 10);
    }
  },

  'click .next': function(evt, tmpl){
    Session.set('songCursor', Number(Session.get('songCursor')+10));
  }

})

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
    if(this.counter <= -9) {
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