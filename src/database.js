import _ from 'lodash';
import firebase from 'firebase';

// Fallback data when Firebase is too slow or not connecting
let data = {episodes: [
    {season: 1, episode: 1},
    {season: 1, episode: 2},
    {season: 1, episode: 3},
    {season: 5, episode: 4},
    {season: 5, episode: 5},
    {season: 5, episode: 6},
    {season: 10, episode: 7},
    {season: 10, episode: 8},
    {season: 10, episode: 9}
]};

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
     * @return {Object[]} episodes
     *  @return {Number} episodes[].season
     *  @return {Number} episodes[].episode
     */
    getEpisodes: () => {
        return data.episodes;
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
     * Get episode notification that needs to be shown
     *
     * @return {Object} episodeNotification
     */
    getEpisodeNotification: () => {
        return data.episodeNotification || {};
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
    data = snapshot.val();
    data.episodes = flatten(data.seasons);
}

function deleteConnection() {
    firebase.app().delete();
}

function flatten(seasons) {
    let result = [];

    _.map(seasons, (season, seasonNr) => {
        if (season)
            _.map(season.episodes, (episode, episodeNr) => {
                if (episode)
                    result.push({season: parseInt(seasonNr), episode: parseInt(episodeNr)});
            });
    });
    return result;
}
