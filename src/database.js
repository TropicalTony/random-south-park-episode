import firebase from 'firebase';

let data;

export default {

    init: () => {
        firebase.initializeApp({
            databaseURL: 'https://shining-inferno-2925.firebaseio.com',
            apiKey: '8JkC3cdKxhrZjfyfmbAMabKu7qL9o950ojlxedPy'
        });
        firebase.database().ref('/').on('value', (snapshot) => {
            data = snapshot;
        });
    }
};
