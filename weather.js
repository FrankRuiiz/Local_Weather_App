var weather_info = $('#weather_info');
var latitude;
var longitude;
var temperature = null;
var conditions_desc = null;

function displayWeather(data) {
    temperature = data.main.temp;
    conditions_desc = data.weather[0].description;
    var icon_code = data.weather[0].icon,
        wind_speed = data.wind.speed,
        wind_direction = data.wind.deg,
        icon_img = $('<img>', {
            src: 'http://openweathermap.org/img/w/' + icon_code + '.png'
        });

    $('.icon').append(icon_img);
    $('#weather .temperature').text(convertKelvToFahr(temperature));
    $('#conditions').text('Conditions: ' + conditions_desc);
    $('#winds .direction').text(convertWindDirection(wind_direction));
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
    $.getJSON('http://ipinfo.io', function(data){
        var loc_city = data.city;
        var loc_state = data.region;
        var loc_array = data.loc.split(',');
        latitude = loc_array[0];
        longitude = loc_array[1];
        getWeather();
        displayLocation( loc_city + ', ' + loc_state);
    });
}


function getWeather() {
    var weatherKey = '05f04e04a675ecee84735203175cede4';
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=' + weatherKey,
        method: 'POST',
        success: function (response) {
            console.log('in success function', response);
            displayWeather(response);
            updateBackground(conditions_desc);
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

    if ($temp.hasClass('F')) {
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
function convertWindDirection(deg) {
    var val = parseInt((deg / 22.5) + 0.5),
        dirArray = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirArray[val % 16];
}


function updateBackground(cond) {
    console.log(cond);
    var $appBg = $('#background');
    if (cond === 'clear sky') {
        $appBg.addClass('clear_bg');
    }
    else if (cond === 'broken clouds' || cond === 'scattered clouds' || cond === 'few clouds' || cond === 'overcast clouds') {
        $appBg.addClass('cloudy_bg');
    }
    else if (cond === 'shower rain' || cond === 'rain') {
        $appBg.addClass('rain_bg');
    }
    else if (cond === 'thunderstorm') {
        $appBg.addClass('stormy_bg');
    }
    else if (cond === 'snow') {
        $appBg.addClass('snowy_bg');
    }
    else if (cond === 'mist') {
        $appBg.addClass('misty_bg');
    }
}


$(document).ready(function () {
    getCoordsDetails();

    $('#toggle_temp').on('click', function () {
        toggleTempMetric();
    });
});