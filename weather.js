

var Local_Weather_app = function() {
    var self = this;
    this.weather_info = $('#weather_info');
    this.latitude = null;
    this.longitude = null;
    this.temperature = null;
    this.conditions_desc = null;

    this.init = function() {
        this.getCoordsDetails();
    };

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

    this.getWeather = function() {
        var weatherKey = '05f04e04a675ecee84735203175cede4';
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + self.latitude + '&lon=' + self.longitude + '&APPID=' + weatherKey,
            method: 'POST',
            success: function (response) {
                console.log('in success function', response);
                self.displayWeather(response);
                self.updateBackground(self.conditions_desc);
            }
        });
    };

    this.displayLocation = function(loc) {
        var loc_h2 = $('<h2>', {
            text: loc,
            class: 'text-center'
        });
        $('#location').append(loc_h2);
    };

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

    this.convertKelvToFahr = function(kelvin) {
        return Math.round(1.8 * (parseInt(kelvin) - 273) + 32) + ' ' + 'F';
    };

    this.convertKelvToCelc = function(kelvin) {
        return parseInt(kelvin) - 273 + ' ' + 'C';
    };

    this.convertWindDirection = function(deg) {
        var val = parseInt((deg / 22.5) + 0.5),
            dirArray = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return dirArray[val % 16];
    };

    this.updateBackground = function(cond) {
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
    };

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

$(document).ready(function() {
    var app = new Local_Weather_app();
    app.init();

    $('#toggle_temp').on('click', function () {
        app.toggleTempMetric();
    });
});
