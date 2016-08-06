import firebase from 'firebase';

// Fallback data when Firebase is too slow or not connecting
let data = {
    seasons: {
        10: {episodes: { 1: {}, 5: {}, 10: {} }}
    }
};

export default {

    init: () => {
        firebase.initializeApp({
            databaseURL: 'https://shining-inferno-2925.firebaseio.com',
            apiKey: '8JkC3cdKxhrZjfyfmbAMabKu7qL9o950ojlxedPy'
        });
        firebase.database().ref('/').on('value', (snapshot) => {
            data = snapshot.val();
        });
    },

    getSeasons: () => {
        return data.seasons;
    }
};
