'use strict';

import {parseInfoFromWiki} from './WikiParser';

let namespace = 'randomSpEpisodeExt';

export function hasToInitSeriesInfo() {
    return get('hasSeriesInfo');
}

export function initSeriesInfoAnd(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://en.wikipedia.org/wiki/List_of_South_Park_episodes', true);
    xhr.responseType = 'document';

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var xmlDoc = xhr.responseXML;

            if (xmlDoc)
                saveSeriesInfo(parseInfoFromWiki(xmlDoc));

            callback();
        }
    }
    xhr.send();
}

export function markAsWatched(season, episode) {
    var episodes = JSON.parse(localStorage.getItem('SouthParkSeason' + season.toString()));

    if (episodes && isInArray(episode, episodes)) {
        episodes.splice(episodes.indexOf(episode), 1);

        // TODO set('season' + season.toString(), JSON.stringify(episodes));
    }
}

function saveSeriesInfo(info) {
    set('hasSeriesInfo', info.hasSeriesInfo);
    set('totalSeasons', info.totalSeasons);
    set('seasonLengths', info.seasonLengths);

    // TODO
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function set(key, data) {
    localStorage.setItem(namespace + '.' + key, data);
}

function get(key) {
    return JSON.parse(localStorage.getItem(namespace + '.' + key));
}
