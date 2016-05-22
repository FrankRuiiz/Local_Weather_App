

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
    getCoordsDetails();
    getWeather();
}

function locFail(msg) {
    console.log(msg.code);
}



function displayWeather(data) {

}


function getCoordsDetails() {
    var mapsKey = 'AIzaSyBGhh5LPrtzsHP-WKreyAU6aLlr0mMtXcg';
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + mapsKey,
        method: 'POST',
        success: function(response) {
            console.log('in get coords details success function', response);
            //displayLocation(response);
        }
    });
}



function getWeather() {
    var weatherKey = '05f04e04a675ecee84735203175cede4';
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=' + weatherKey,
        method: 'POST',
        success: function(response) {
            console.log('in success function', response);
            displayWeather(response);
        }
    });
}



$(document).ready(function() {
  getCoords();
});