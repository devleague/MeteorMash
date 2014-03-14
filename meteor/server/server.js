Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {

    this.route('serverRoute', {
        where: 'server',
        path: '/secret',
        action: function () {
            var song = Songs.find({}, {sort: {counter:-1}, limit:1}).fetch()[0];
            Songs.update({"status": "now"}, { $set: {"status": "none"}})
            Songs.update({_id: song._id}, {$set: {counter: 0, status: "now"}});
            this.response.end('/home/pi/music/'+song.filename)
            }
            
    })
})

Meteor.publish( "nowPlaying", function () {

  var showAllSongs = Songs.find();

  showAllSongs.observe ({

    added : function (document) {

    },

    removed : function(oldDocument) {

    },

    movedTo : function (document, fromIndex, toIndex, before) {

      if ( toIndex == 0 ) {
    
        Songs.update( { _id : document._id }, { $set : { "nowPlaying" : true } }, function (err) {

          console.log(err);

        });

        console.log( document );
      
      }
    
    }
  
  });

});// ends Meteor.publish

Meteor.publish( "songs" , function ( songcursor ) {
  
  return Songs.find( {},{ sort : { counter : -1 } });
 // return Songs.find( {},{ limit : 10, skip : songcursor , sort : { counter : -1 } });

});


Meteor.methods({
    checkGeo: function(){
      this.unblock();
    },

    playSong: function(songName){
      createFile = spawn('afplay', ["../../../../../public/audio/"+songName]);

      createFile.stdout.on('data',function(data){
        console.log("stdout: " + data);
      });
      createFile.stderr.on('data',function(data){
        console.log("stderr: " + data);
      });
      createFile.on('exit',function(code){
        console.log("child process exited with code " + code)
      });
    }
});  
