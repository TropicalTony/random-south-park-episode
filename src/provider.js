import axios from 'axios';
import _ from 'lodash';

// Fallback code when ipinfo is not responding
let userCountryCode = 'EE';
const limitedCountries = ['US'];

export default {

    init: () => {
        registerUserCountry();
    },

    isSouthparkUrl: (url) => {
        return /southpark.cc.com\/full-episodes/.test(url) || /kisscartoon.me\/Cartoon\/South-Park-Season/.test(url);
    },

    getUrl: (season, episode) => {
        if (_.includes(limitedCountries, userCountryCode))
            return getKissCartoonUrl(season, episode);
        else
            return getSouthparkCCUrl(season, episode);
    }
};

function registerUserCountry() {
    axios.get('http://ipinfo.io').then((response) => {
        userCountryCode = response.data.country;
    });
}

function getKissCartoonUrl(season, episode) {
    return `http://kisscartoon.me/Cartoon/South-Park-Season-${pad(season)}/Episode-${pad(episode, 3)}`;
}

function getSouthparkCCUrl(season, episode) {
    return `http://southpark.cc.com/full-episodes/s${pad(season)}e${pad(episode)}`;
}

function pad(num, size = 2) {
    var s = num + '';

    while (s.length < size)
        s = '0' + s;

    return s;
}
