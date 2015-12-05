'use strict';

import {parseDataFromWiki} from './WikiParser';

export function hasToInitSeriesInfo() {
    return !JSON.parse(localStorage.getItem('hasSeasons'));
}

export function initSeriesInfoAnd(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://en.wikipedia.org/wiki/List_of_South_Park_episodes', true);
    xhr.responseType = 'document';

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var xmlDoc = xhr.responseXML;

            if (xmlDoc)
                parseDataFromWiki(xmlDoc);

            callback();
        }
    }
    xhr.send();
}

export function markAsWatched(season, episode) {
    var episodes = JSON.parse(localStorage.getItem('SouthParkSeason' + season.toString()));

    if (episodes && isInArray(episode, episodes)) {
        episodes.splice(episodes.indexOf(episode), 1);

        localStorage.setItem('SouthParkSeason' + season.toString(), JSON.stringify(episodes));
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
