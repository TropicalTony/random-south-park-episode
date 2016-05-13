'use strict';

import {buildLocalStorage, updateSeasonInfo} from './WikiParser';
import {History} from './History';
import Firebase from 'firebase';

const NAMESPACE = 'randomSpEpisodeExt';

export function hasToInitSeriesInfo() {
    return !get('hasSeriesInfo');
}

export function hasToUpdateSeriesInfo() {
    if(get('useOfficalSite') === null)
        return true;
    return get('updateDate') && get('updateDate') <= Date.now();
}

export function useOfficalSite() {
    return get('useOfficalSite');
}

export function initSeriesInfo() {
    getSeasonsObject(buildLocalStorage);
    setUpdateDate();
    setSyncTime();
}

export function updateSeriesInfoAnd(callback) {
        getSeasonsObject(updateSeasonInfo);
        setUpdateDate();
        callback();

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
    setWatchedEpisodesFromHistory(new Date().setDate(new Date().getDate()) - 24*60*60*1000*90);
}

export function saveSeriesInfo(info) {
    set('totalSeasons', info.totalSeasons);
    set('seasonLengths', info.seasonLengths);
    set('episodeNames', info.episodeNames);
    set('unwatchedEpisodes', info.unwatchedEpisodes);
    set('hasSeriesInfo', info.hasSeriesInfo);
    set('useOfficalSite', true);
    initHistory();
}

export function setWatchedEpisodesFromHistory(startTime, callback) {
    new History(startTime).search(function (seen) {
        for (var i = 0; i < seen.length; i ++)
            if (seen[i].season != undefined && seen[i].episode != undefined) {
                markAsWatched(seen[i].season, seen[i].episode);
            }

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

function getSeasonsObject(callback) {
    var myFirebaseRef = new Firebase('https://shining-inferno-2925.firebaseio.com');

    myFirebaseRef.child('/').on('value', function(snapshot) {
        callback(snapshot.val());
    });
}
