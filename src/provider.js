import _ from 'lodash';
import axios from 'axios';
import database from 'database';

// Fallback code when ipinfo is not responding
let userCountryCode = 'EE';

/**
 * Episode provider related functions
 *
 * Providers are KissCartoon and South Park CC.
 */
export default {

    /**
     * Register user location based on IP address
     */
    init: () => {
        registerUserCountry();
    },

    /**
     * Test if given url is related to our providers
     *
     * @param {String} url
     * @return {Boolean}
     */
    isSouthparkUrl: (url) => {
        return /southpark.cc.com\/full-episodes/.test(url) || /kisscartoon.me\/Cartoon\/South-Park-Season/.test(url);
    },

    /**
     * Get list of our provders and their helper functions
     *
     * @return {Object[]} providers
     *  @return {String} providers[].rootUrl
     *  @return {Function} providers[].parseUrl Helps to parse out season and episode numbers
     */
    getAllPossibleProviders: () => {
        return [{
            rootUrl: 'http://southpark.cc.com/full-episodes/',
            parseUrl: parseSouthParkCCSeasonAndEpisode
        }, {
            rootUrl: 'http://kisscartoon.me/Cartoon/South-Park-Season',
            parseUrl: parseKissCartoonSeasonAndEpisode
        }];
    },

    /**
     * Get provider url for given season and episode
     *
     * @param {Number} season
     * @param {Number} episode
     * @return {String} url
     */
    getUrl: (season, episode) => {
        if (_.includes(database.getLessFortunateCountries(), userCountryCode))
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

function parseSouthParkCCSeasonAndEpisode(url) {
    const found = url.match(/s\d+e\d+/);

    if (!found)
        return {};

    return {
        season: parseInt(found[0].match(/\d+/g)[0]),
        episode: parseInt(found[0].match(/\d+/g)[1])
    };
}

function parseKissCartoonSeasonAndEpisode(url) {
    return {
        season: parseInt(url.slice(48,50)),
        episode: parseInt(url.slice(60,62))
    };
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
