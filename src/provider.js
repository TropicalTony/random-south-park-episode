import axios from 'axios';

// Fallback code when ipinfo is not responding
let userCountryCode = 'EE';

/**
 * Episode provider related functions
 *
 * Current provider is South Park CC.
 */
export default {
    /**
     * Get user country code by ip address.
     */
    init: () => {
        axios.get('http://ipinfo.io').then((response) => {
            userCountryCode = response.data.country;
        });
    },

    /**
     * Given provider root url.
     */
    getRootUrl: () => {
        if (userCountryCode === 'US') {
            return 'http://hulu.com/watch/';
        }
        return 'http://southpark.cc.com/full-episodes/';
    },

    /**
     * Test if given url is related to our provider
     *
     * @param {String} url
     * @return {Boolean}
     */
    matchesUrl: (url) => {
        if (userCountryCode === 'US') {
            return (/hulu\.com\/watch/).test(url);
        }
        return (/southpark\.cc\.com\/full-episodes/).test(url);
    },

    /**
     * Get provider url for given season and episode
     *
     * @param {Number} season
     * @param {Number} episode
     * @param {Number} huluId
     * @return {String} url
     */
    getUrl: ({season, episode, huluId}) => {
        if (userCountryCode === 'US') {
            return `http://hulu.com/watch/${huluId}`;
        }
        return `http://southpark.cc.com/full-episodes/s${pad(season)}e${pad(episode)}`;
    },

    /**
     * Parse given url for getting season and episode numbers
     *
     * @param {String} url
     * @return {Object} result
     */
    parseUrl: (url) => {
        if (userCountryCode === 'US') {
            return parseHuluUrl(url);
        }
        return parseCcUrl(url);
    }
};

function parseHuluUrl(url) {
    const found = url.match(/watch\/([0-9]+)/);

    if (!found)
        return {};

    return {huluId: parseInt(found[1], 10)};
}

function parseCcUrl(url) {
    const found = url.match(/s\d+e\d+/);

    if (!found)
        return {};

    return {
        season: parseInt(found[0].match(/\d+/g)[0], 10),
        episode: parseInt(found[0].match(/\d+/g)[1], 10)
    };
}

function pad(num, size = 2) {
    let s = String(num);

    while (s.length < size)
        s = '0' + s;

    return s;
}
