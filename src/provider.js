import _ from 'lodash';
import axios from 'axios';
import Promise from 'bluebird';
import browser from 'browser';

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

    getSeenEpisodes: () => {
        return Promise.all([
            registerSeenEpisodesOnSouthParkCC(),
            registerSeenEpisodesOnKissCartoon()
        ]).then((results) => {
            return _.flatten(results);
        });
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

function registerSeenEpisodesOnSouthParkCC() {
    return registerSeenEpisodes('http://southpark.cc.com/full-episodes/s', parseSouthParkCCSeasonAndEpisode);
}

function registerSeenEpisodesOnKissCartoon() {
    return registerSeenEpisodes('http://kisscartoon.me/Cartoon/South-Park-Season', parseKissCartoonSeasonAndEpisode);
}

function registerSeenEpisodes(query, parse) {
    return new Promise((resolve) => {
        browser.searchFromHistory(query, (results) => {
            let seenEpisodes = [];
            results.map((result) => seenEpisodes.push(parse(result.url)));

            resolve(seenEpisodes);
        });
    });
}

function parseSouthParkCCSeasonAndEpisode(url) {
    const found = url.match(/s\d+e\d+/);

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
