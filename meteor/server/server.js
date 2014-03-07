

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

