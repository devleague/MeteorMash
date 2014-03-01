if (Meteor.isClient) {
  Session.set('loc','?');

  Template.hello.greeting = function () {
    return "Welcome to meteor.";
  };

  Template.hello.greeting = function(){
    var output;
    navigator.geolocation.watchPosition(foundLocation, noLocation);
    output = Session.get('loc');
    return Session.get('loc');
  };

  function foundLocation(location){
    console.log(location);
    Session.set('loc','lat: '+location.coords.latitude +', lon: '+location.coords.longitude);
 
  }

  function noLocation(){
    alert('no location');
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
