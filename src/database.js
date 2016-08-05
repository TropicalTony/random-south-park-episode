import firebase from 'firebase';

firebase.initializeApp({
    databaseURL: 'https://shining-inferno-2925.firebaseio.com'
});

const db = firebase.database();

db.ref('/').on('value', function() {});
