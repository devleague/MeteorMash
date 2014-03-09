

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
	
	return Songs.find( {},{ limit : 10, skip : songcursor , sort : { counter : -1 } });

});

// Meteor.publish("counts",function(){
// 	var self = this;
// 	var count = Meteor.uuid();
// 	var count = Songs.find().count();
// 	self.set('count',{count: count});

// 	var handle = Songs.find().observe({
// 		added: function (document) {
// 			count++;
// 			self.set('count', {count: count});
// 			self.flush();
// 		}, // Use either added() OR(!) addedAt()
// 		removed: function (oldDocument) {
// 			count--;
// 			self.set('count', {count: count});
// 			self.flush();
// 		}, // Use either removed() OR(!) removedAt()
// 	});

// 	self.complete();
// 	self.flush();
// 	self.onStop(function () {
// 		handle.stop();
// 	});
// });

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
