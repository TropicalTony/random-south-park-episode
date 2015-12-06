'use strict';

import {parseInfoFromWiki} from './WikiParser';
import {History} from './History';

const NAMESPACE = 'randomSpEpisodeExt';

export function hasToInitSeriesInfo() {
    // TODO @tonis lets update data from wiki after a given date
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

            setWatchedEpisodesFromHistory();
            callback();
        }
    }
    xhr.send();
}

export function markAsWatched(season, episode) {
    var unwatchedEpisodes = get('unwatchedEpisodes');

    if (unwatchedEpisodes[season - 1].indexOf(episode) === -1)
        return;

    unwatchedEpisodes[season - 1].splice(unwatchedEpisodes.indexOf(episode), 1);
    set('unwatchedEpisodes', unwatchedEpisodes);
}

export function getUnwatchedEpisodes() {
    return get('unwatchedEpisodes');
}

function saveSeriesInfo(info) {
    set('hasSeriesInfo', info.hasSeriesInfo);
    set('totalSeasons', info.totalSeasons);
    set('seasonLengths', info.seasonLengths);
    set('episodeNames', info.episodeNames);
    set('unwatchedEpisodes', info.unwatchedEpisodes);
}

function setWatchedEpisodesFromHistory() {
    // TODO date limit @tonis
    var historyLimit = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

    new History(historyLimit).search(function (seen) {
        for (var i = 0; i < seen.length; i ++)
            markAsWatched(seen[i].season, seen[i].episode);
    });
}

function set(key, data) {
    localStorage.setItem(NAMESPACE + '.' + key, JSON.stringify(data));
}

function get(key) {
    return JSON.parse(localStorage.getItem(NAMESPACE + '.' + key));
}
