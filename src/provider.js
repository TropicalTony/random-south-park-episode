/**
 * Episode provider related functions
 *
 * Current provider is South Park CC.
 */
export default {

    /**
     * Test if given url is related to our providers
     *
     * @param {String} url
     * @return {Boolean}
     */
    isSouthparkUrl: (url) => {
        return /southpark.cc.com\/full-episodes/.test(url);
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
        return getSouthparkCCUrl(season, episode);
    }
};

function parseSouthParkCCSeasonAndEpisode(url) {
    const found = url.match(/s\d+e\d+/);

    if (!found)
        return {};

    return {
        season: parseInt(found[0].match(/\d+/g)[0]),
        episode: parseInt(found[0].match(/\d+/g)[1])
    };
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
