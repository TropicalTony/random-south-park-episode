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
        firebase.initializeApp({
            databaseURL: 'https://shining-inferno-2925.firebaseio.com',
            apiKey: '8JkC3cdKxhrZjfyfmbAMabKu7qL9o950ojlxedPy'
        });
        loadData();
    },

    getEpisodes: () => {
        return flatten(data.seasons);
    },

    reload: () => {
        loadData();
    }
};

function loadData() {
    firebase.database().ref('/').on('value', (snapshot) => {
        const rawdata = snapshot.val();

        data.seasons = {};

        // Firebase returns array of seasons rather than object,
        // this means first element in array is undefined, super weird
        _.map(rawdata.seasons, (season, key) => {
            if (season)
                data.seasons[key] = season;
        });
    });
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
