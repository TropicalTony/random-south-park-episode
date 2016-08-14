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

export default {

    init: () => {
        loadData();
    },

    reload: () => {
        loadData();
    },

    getEpisodes: () => {
        return flatten(data.seasons);
    },

    getLessFortunateCountries: () => {
        return data.lessFortunateCountries;
    },

    getNotifications: () => {
        return data.notifications || {};
    }
};

function loadData() {
    // Wait for app disconnect before connecting again
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
    // this means first element in array is undefined, super weird
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
