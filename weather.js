

var myLoc = $('#loc');
var latitude;
var longitude;

var msg = 'Sorry, we were unable to get your location';

function getCoords() {
    if( Modernizr.geolocation ) {
        navigator.geolocation.getCurrentPosition(locSuccess, locFail);
    }
    else {
        myLoc.textContent = msg;
    }
}

function locSuccess(position) {
    latitude = position.coords.latitude;
    console.log(latitude);
    longitude = position.coords.longitude;
    console.log(longitude);
}

function locFail(msg) {
    console.log(msg.code);
}


$(document).ready(function() {
  getCoords();
});