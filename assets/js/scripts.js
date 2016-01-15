// jQuery ($)
window.$ = window.jQuery = require('jquery');
var moment = require('moment');

// unnamed requirements
require('bootstrap-sass');

$('[data-toggle="tooltip"]').tooltip();

function setColor(hours, minutes, seconds) {
    var hslVal = parseInt((minutes + '' + seconds) / 5959 * 359),
        hslSat =  20 + parseInt(hours / 23 * 60, 10), //don't go before 20 and after 80 to have white every time and stay visible
        hslLig = hslSat,
        whiteOrNot = '#fff',
        minPourc = 100 - (minutes / 60 * 100),
        secPourc = minPourc - (seconds / 60 * minPourc) + '%';
        minPourc = minPourc + '%';

    $('body').css({
        'background-color': "hsl(" + hslVal + ', ' + hslSat + '%, ' + hslLig + '%)',
        'color': whiteOrNot
    });
}

function updateTime() {
    var hours = moment().format('HH'),
        minutes = moment().format('mm'),
        seconds = moment().format('ss');

    $('#time .hour').html(hours);
    $('#time .minute').html(minutes);
    $('#time .second').html(seconds);

    $('#date').html(moment().format('dddd, MMMM Do YYYY'));

    if (parseInt(moment().format('ss'), 10) % 2) {
        $('#time .seperator i').html('&#149;');
    } else {
        $('#time .seperator i').html('&nbsp;');
    }

    setColor(hours, minutes, seconds);
}

var weather_underground_api_key = 'dc203fba39f6674e';
var _location;

var getLocationFromIP = function() {
    console.log('');
    console.log('Fetching location from ip');

    $.ajax({
        url: 'http://api.wunderground.com/api/' + weather_underground_api_key + '/geolookup/q/autoip.json',
        type: 'GET',
        dataType: 'jsonp',
    })
    .done(function(data) {
        _location = data.location;
        $('#location').text(_location.city + ', ' + _location.country_name);

        getNow();
        getWeather();
    });
}

var getNow = function() {
    console.log('Fetching current conditions for ' + _location.city + ', ' + _location.country_name);

    $.ajax({
        url: 'http://api.wunderground.com/api/' + weather_underground_api_key + '/conditions/q/' + _location.l + '.json',
        type: 'GET',
        dataType: 'jsonp',
    })
    .done(function(data) {
        var current = data.current_observation;

        var el = $('#weather div#now')
        var icon = current.icon_url;

        $(el).find('.has-tooltip').attr('data-original-title', current.weather);
        $(el).find('.weather-icon').text(conditionCode(icon));
        $(el).find('.temperature').html('<strong>' + current.temp_c + '</strong>');
        $(el).find('span.text').text('Now');

        $('title').html(current.temp_c + '&deg; | Currently');
    });
}

var getWeather = function() {
    console.log('Fetching forecast for ' + _location.city + ', ' + _location.country_name);

    $.ajax({
        url: 'http://api.wunderground.com/api/' + weather_underground_api_key + '/forecast10day/q/' + _location.l + '.json',
        type: 'GET',
        dataType: 'jsonp',
    })
    .done(function(data) {
        var forecast = data.forecast.simpleforecast.forecastday;

        $('#weather > div:not(#now)').each(function(index, el) {
            var current = forecast[index];
            var icon = current.icon_url;

            $(el).find('.has-tooltip').attr('data-original-title', current.conditions);
            $(el).find('.weather-icon').text(conditionCode(icon));
            $(el).find('.temperature').html('<strong>' + current.high.celsius + '</strong> &nbsp; ' + current.low.celsius);
            $(el).find('span.text').text(current.date.weekday);
        });
    });
}

var conditionCode = function (icon_url) {
    var matcher = /\/(\w+).gif$/;
    var code = matcher.exec(icon_url);

    if (code) {
        code = code[1];
    } else {
        // We can't find the code
        code = null;
    }

    switch (code) {
        case 'chanceflurries':
        case 'chancesnow':
            return 'p';

        case '/ig/images/weather/flurries.gif':
            return ']';

        case 'chancesleet':
            return '4';

        case 'chancerain':
            return '7';

        case 'chancetstorms':
            return 'x';

        case 'tstorms':
        case 'nt_tstorms':
            return 'z';

        case 'clear':
        case 'sunny':
            return 'v';

        case 'cloudy':
            return '`';

        case 'flurries':
        case 'nt_flurries':
            return ']';

        case 'fog':
        case 'hazy':
        case 'nt_fog':
        case 'nt_hazy':
            return 'g';

        case 'mostlycloudy':
        case 'partlysunny':
        case 'partlycloudy':
        case 'mostlysunny':
            return '1';

        case 'sleet':
        case 'nt_sleet':
            return '3';

        case 'rain':
        case 'nt_rain':
            return '6';

        case 'snow':
        case 'nt_snow':
            return 'o';

        // Night Specific

        case 'nt_chanceflurries':
            return 'a';

        case 'nt_chancerain':
            return '8';

        case 'nt_chancesleet':
            return '5';

        case 'nt_chancesnow':
            return '[';

        case 'nt_chancetstorms':
            return 'c';

        case 'nt_clear':
        case 'nt_sunny':
            return '/';

        case 'nt_cloudy':
            return '2';

        case 'nt_mostlycloudy':
        case 'nt_partlysunny':
        case 'nt_partlycloudy':
        case 'nt_mostlysunny':
            return '2';
    }
};

getLocationFromIP();
setInterval(getLocationFromIP, 60 * 1000);

setInterval(updateTime, 250);
