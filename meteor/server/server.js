Meteor.publish("songs",function(songcursor){
	return Songs.find({},{limit:10, skip:songcursor, sort:{counter: -1}});
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