/**
 * Local_Weather_App constructor function
 * @param key
 * @constructor
 */
var Local_Weather_app = function(key) {
    /**
     * variables to be used throughout the app
     */
    var self = this;
    this.weather_api_key = null;
    this.latitude = null;
    this.longitude = null;
    this.temperature = null;
    this.conditions_desc = null;

    /**
     * gets the api key from a config json file and then calls the function to get the user's current location details
     * @param key
     */
    this.init = function(key) {
        this.weather_api_key = key;
        this.getCoordsDetails();
    };

    /**
     * gets location information from ipinfo.io, most importantly the latitude and longitude coords which are used in the weather api call
     */
    this.getCoordsDetails = function() {
        $.getJSON('http://ipinfo.io', function(data){
            var loc_city = data.city;
            var loc_state = data.region;
            var loc_array = data.loc.split(',');
            self.latitude = loc_array[0];
            self.longitude = loc_array[1];
            self.getWeather();
            self.displayLocation( loc_city + ', ' + loc_state);
        });
    };

    /**
     * call to openweathermap.org, where all current location data will come from
     */
    this.getWeather = function() {
        var key = self.weather_api_key;
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + self.latitude + '&lon=' + self.longitude + '&APPID=' + key,
            method: 'POST',
            success: function (response) {
                self.displayWeather(response);
                self.updateBackground(self.conditions_desc);
            }
        });
    };

    /**
     * displays current location
     * @param loc
     */
    this.displayLocation = function(loc) {
        var loc_h2 = $('<h2>', {
            text: loc,
            class: 'text-center'
        });
        $('#location').append(loc_h2);
    };

    /**
     * displays weather information
     * @param data
     */
    this.displayWeather = function(data) {
        self.temperature = data.main.temp;
        self.conditions_desc = data.weather[0].description;
        var icon_code = data.weather[0].icon,
            wind_speed = data.wind.speed,
            wind_direction = data.wind.deg,
            icon_img = $('<img>', {
                src: 'http://openweathermap.org/img/w/' + icon_code + '.png'
            });

        $('.icon').append(icon_img);
        $('#weather .temperature').text(this.convertKelvToFahr(self.temperature));
        $('#conditions').text('Conditions: ' + self.conditions_desc);
        $('#winds .direction').text(this.convertWindDirection(wind_direction));
        $('#winds .speed').text(wind_speed + ' ' + 'knots');
    };

    /**
     * function for converting Kelvins to fahrenheit
     * @param kelvin
     * @returns {string}
     */
    this.convertKelvToFahr = function(kelvin) {
        return Math.round(1.8 * (parseInt(kelvin) - 273) + 32) + ' ' + 'F';
    };

    /**
     * function for converting Kelvins to celcius
     * @param kelvin
     * @returns {string}
     */
    this.convertKelvToCelc = function(kelvin) {
        return parseInt(kelvin) - 273 + ' ' + 'C';
    };

    /**
     * function for converting wind degree to compass direction
     * @param deg
     * @returns {string}
     */
    this.convertWindDirection = function(deg) {
        var val = parseInt((deg / 22.5) + 0.5),
            dirArray = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return dirArray[val % 16];
    };

    /**
     * function for changing the app background depending on weather description data
     * @param cond
     */
    this.updateBackground = function(cond) {
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
    };

    /**
     * function for toggling the temperature metric on click
     */
    this.toggleTempMetric = function() {
        var $temp = $('.temperature');

        if ($temp.hasClass('F')) {
            $temp.removeClass('F');
            $temp.text(this.convertKelvToCelc(this.temperature));
            $temp.addClass('C');
        }
        else {
            $temp.removeClass('C');
            $temp.text(this.convertKelvToFahr(this.temperature));
            $temp.addClass('F');
        }
    }

};

/**
 *  when the document is finished loading function
 */
$(document).ready(function() {
    var key = null;
    var app = new Local_Weather_app();

    $.getJSON('config.json', function(data){
        key = data.weatherAppKey;
        app.init(key);
    });

    $('#toggle_temp').on('click', function () {
        app.toggleTempMetric();
    });
});
