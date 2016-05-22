

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
    getWeather();
}

function locFail(msg) {
    console.log(msg.code);
}


var weatherKey = '05f04e04a675ecee84735203175cede4';
var globalResponse;


function getWeather() {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=' + weatherKey,
        method: 'POST',
        success: function(result) {
            console.log('in success function');
            console.log(result);
            globalResponse = result;
        }
    });
}



$(document).ready(function() {
  getCoords();
});