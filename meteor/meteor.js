
if (Meteor.isClient) {
  // var lattitude = location.coords.lattitude;
  // var lon = location.coords.longitude;
  Session.set('loc','?');

  Template.hello.greeting = function () {
    return "Welcome to meteor.";
  };

  Template.hello.greeting = function(){
    var output;
    var string;
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({checkGeo: function(){
      this.unblock();
 
    }});  
  });
}
