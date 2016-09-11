/**
 * Episode provider related functions
 *
 * Current provider is South Park CC.
 */
export default {
    /**
     * South Park CC url without season and episode info
     */
    rootUrl: 'http://southpark.cc.com/full-episodes/',

    /**
     * Test if given url is related to our provider
     *
     * @param {String} url
     * @return {Boolean}
     */
    matchesUrl: (url) => {
        return (/southpark.cc.com\/full-episodes/).test(url);
    },

    /**
     * Get provider url for given season and episode
     *
     * @param {Number} season
     * @param {Number} episode
     * @return {String} url
     */
    getUrl: (season, episode) => {
        return getSouthparkCCUrl(season, episode);
    },

    /**
     * Parse given url for getting season and episode numbers
     *
     * @param {String} url
     * @return {Object} result
     *  @return {Number} result.season
     *  @return {Number} result.episode
     */
    parseUrl: (url) => {
        const found = url.match(/s\d+e\d+/);

        if (!found)
            return {};

        return {
            season: parseInt(found[0].match(/\d+/g)[0], 10),
            episode: parseInt(found[0].match(/\d+/g)[1], 10)
        };
    }
};

function getSouthparkCCUrl(season, episode) {
    return `http://southpark.cc.com/full-episodes/s${pad(season)}e${pad(episode)}`;
}

function pad(num, size = 2) {
    let s = String(num);

    while (s.length < size)
        s = '0' + s;

    return s;
}
