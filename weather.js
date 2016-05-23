

var weather_info = $('#weather_info');
var latitude;
var longitude;
var temperature = null;

var msg = 'Sorry, we were unable to get your location';

function getCoords() {
    if( Modernizr.geolocation ) {
        navigator.geolocation.getCurrentPosition(locSuccess, locFail);
    }
    else {
        weather_info.empty().text(msg);
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
    temperature = data.main.temp;
    var icon_code = data.weather[0].icon,
        wind_speed = data.wind.speed,
        wind_direction = data.wind.deg,
        conditions_desc = data.weather[0].description,
        icon_img = $('<img>', {
            src: 'http://openweathermap.org/img/w/' + icon_code + '.png'
        });

    $('.icon').append(icon_img);
    $('#weather .temperature').text(convertKelvToFahr(temperature));
    $('#conditions').text(conditions_desc);
    $('#winds .direction').text(windDirection(wind_direction));
    $('#winds .speed').text(wind_speed + ' ' + 'knots');
}

function displayLocation(location) {
    var loc_h2 = $('<h2>', {
        text: location,
        class: 'text-center'
    });
    $('#location').append(loc_h2);
}


function getCoordsDetails() {
    var mapsKey = 'AIzaSyBGhh5LPrtzsHP-WKreyAU6aLlr0mMtXcg';
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + mapsKey,
        method: 'POST',
        success: function(response) {
            console.log(response);
            var location = response.results[1].formatted_address;
            displayLocation(location);
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



// Temperature functions
function convertKelvToFahr(kelvin) {
    return Math.round(1.8 * (parseInt(kelvin) - 273) + 32) + ' ' + 'F';
}

function convertKelvToCelc(kelvin) {
    return parseInt(kelvin) - 273 + ' ' + 'C';
}


function toggleTempMetric() {
    var $temp = $('.temperature');

    if($temp.hasClass('F')) {
        $temp.removeClass('F');
        $temp.text(convertKelvToCelc(temperature));
        $temp.addClass('C');
    }
    else {
        $temp.removeClass('C');
        $temp.text(convertKelvToFahr(temperature));
        $temp.addClass('F');
    }
}

// wind direction function
function windDirection(deg) {
    var val = parseInt((deg /22.5) + 0.5),
        dirArray = ['N','NNE','NE','ENE','E','ESE', 'SE', 'SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirArray[val % 16];
}



$(document).ready(function() {
  getCoords();
    
   $('#toggle_temp').on('click', function() {
       toggleTempMetric();
   }) ;
});