import _ from 'lodash';
import firebase from 'firebase';

// Fallback data when Firebase is too slow or not connecting
let data = {
    seasons: {
        1: {episodes: { 1: {}, 2: {}, 3: {} }},
        5: {episodes: { 4: {}, 5: {}, 6: {} }},
        10: {episodes: { 7: {}, 8: {}, 9: {} }},
        15: {episodes: { 10: {}, 11: {}, 12: {} }}
    }
};

/**
 * Service for communicating with Firebase
 */
export default {

    /**
     * Load initial data from Firebase
     */
    init: () => {
        loadData();
    },

    /**
     * Reload data from Firebase
     */
    reload: () => {
        loadData();
    },

    /**
     * Gets all season-epsiodes
     *
     * Before giving them we need to flatten object tree
     * into array of objects
     *
     * @return {Object[]} episodes
     *  @return {Number} episodes[].season
     *  @return {Number} episodes[].episode
     */
    getEpisodes: () => {
        return flatten(data.seasons);
    },

    /**
     * Get countries that can't watch South Park CC
     *
     * @return {String[]} countries
     */
    getLessFortunateCountries: () => {
        return data.lessFortunateCountries;
    },

    /**
     * Get different notifications that need to be shown
     *
     * @return {Object} notifications
     *  @return {Object} notifications.watch
     */
    getNotifications: () => {
        return data.notifications || {};
    }
};

function loadData() {
    // Wait for previous connection to be removed before connecting again
    if (!_.isEmpty(firebase.apps))
        return setTimeout(loadData, 50);

    makeConnection();

    firebase.database().ref('/').on('value', _.flow(setData, deleteConnection));
}

function makeConnection() {
    firebase.initializeApp({
        databaseURL: 'https://random-south-park-episode.firebaseio.com',
        apiKey: 'AIzaSyBaKw13z1Rp98tbysXMsV8dI68mx38LOcU'
    });
}

function setData(snapshot) {
    const rawdata = snapshot.val();
    const seasons = {};

    // Firebase returns array of seasons rather than object,
    // this means first element in array is undefined
    _.map(rawdata.seasons, (season, key) => {
        if (season)
            seasons[key] = season;
    });
    data = rawdata;
    data.seasons = seasons;
}

function deleteConnection() {
    firebase.app().delete();
}

function flatten(seasons) {
    let result = [];

    _.map(seasons, (season, seasonNr) => {
        _.map(season.episodes, (episode, episodeNr) => {
            result.push({season: parseInt(seasonNr), episode: parseInt(episodeNr)});
        });
    });
    return result;
}
