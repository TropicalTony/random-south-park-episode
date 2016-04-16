'use strict';

import {parseInfoFromWiki} from './WikiParser';
import {History} from './History';

const NAMESPACE = 'randomSpEpisodeExt';

export function hasToInitSeriesInfo() {
    return !get('hasSeriesInfo');
}

export function hasToUpdateSeriesInfo() {
    return get('updateDate') && get('updateDate') <= Date.now();
}

export function initSeriesInfo(callback) {

    callWikiAnd((xmlDoc) => {
        initHistory();
        saveSeriesInfo(parseInfoFromWiki(xmlDoc));
        setUpdateDate();
        setSyncTime();
    });

        if (callback)
            callback();
    };


export function updateSeriesInfoAnd(callback) {
    callWikiAnd((xmlDoc) => {
        updateSeriesInfo(parseInfoFromWiki(xmlDoc));
        setUpdateDate();
        callback();
    });
}

export function markAsWatched(season, episode) {
    var unwatchedEpisodes = get('unwatchedEpisodes');
    episode = parseInt(episode);

    if (unwatchedEpisodes[season - 1].indexOf(episode) === -1)
        return;

    unwatchedEpisodes[season - 1].splice(unwatchedEpisodes[season - 1].indexOf(episode), 1);
    set('unwatchedEpisodes', unwatchedEpisodes);
}

export function getUnwatchedEpisodes() {
    return get('unwatchedEpisodes');
}

function initHistory() {
    if (get('hasSeriesInfo') != true) {
        setWatchedEpisodesFromHistory(new Date().setDate(new Date().getDate()) - 24*60*60*1000*90);
    }

}
function callWikiAnd(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://en.wikipedia.org/wiki/List_of_South_Park_episodes', true);
    xhr.responseType = 'document';

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.responseXML && xhr.responseXML != undefined)
            callback(xhr.responseXML);
            
    };
    xhr.send();
}

function saveSeriesInfo(info) {
    set('totalSeasons', info.totalSeasons);
    set('seasonLengths', info.seasonLengths);
    set('episodeNames', info.episodeNames);
    set('unwatchedEpisodes', info.unwatchedEpisodes);
    set('hasSeriesInfo', info.hasSeriesInfo);
}

function updateSeriesInfo(info) {
    var unwatchedEpisodes = get('unwatchedEpisodes');

    for (; info.totalSeasons > get('totalSeasons'); info.totalSeasons --)
        unwatchedEpisodes.push(info.unwatchedEpisodes[info.totalSeasons - 1]);

    var lastSavedSeasonLength = get('seasonLengths')[get('totalSeasons') - 1];
    var thatSeasonCurrentLength = info.seasonLengths[get('totalSeasons') - 1];

    for (; lastSavedSeasonLength + 1 <= thatSeasonCurrentLength; lastSavedSeasonLength ++)
        unwatchedEpisodes[get('totalSeasons') - 1].push(lastSavedSeasonLength + 1);

    info.unwatchedEpisodes = unwatchedEpisodes;

    saveSeriesInfo(info);
}

export function setWatchedEpisodesFromHistory(startTime, callback) {
    new History(startTime).search(function (seen) {
        for (var i = 0; i < seen.length; i ++)
            markAsWatched(seen[i].season, seen[i].episode);

        if (callback)
            callback();
    });
}

function setSyncTime() {
    set('lastSyncTime', new Date().setDate(new Date().getDate()) );
}
export function syncHistory(callback) {
    setWatchedEpisodesFromHistory(get('lastSyncTime'), callback);
    setSyncTime();
}

function setUpdateDate() {
    set('updateDate', new Date().setDate(new Date().getDate() + 7));
}

export function set(key, data) {
    localStorage.setItem(NAMESPACE + '.' + key, JSON.stringify(data));
}

export function get(key) {
    return JSON.parse(localStorage.getItem(NAMESPACE + '.' + key));
}
