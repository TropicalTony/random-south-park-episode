'use strict';
import {initLocalStorage, updateLocalStorage} from './WikiParser';
import {History} from './History';

const NAMESPACE = 'randomSpEpisodeExt';

export function hasToInitSeriesInfo() {
    return !get('hasSeriesInfo');
}

export function hasToUpdateSeriesInfo() {
    return get('updateDate') && get('updateDate') <= Date.now();
}

export function useOfficalSite() {
    return get('useOfficalSite');
}

export function initSeriesInfo() {

    initLocalStorage(() => {
        initHistory();
        setUpdateDate();
        setSyncTime();
    });
}
    
export function updateSeriesInfoAnd(callback) {
    updateLocalStorage(() => {
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

export function saveSeriesInfo(info) {
    set('totalSeasons', info.totalSeasons);
    set('seasonLengths', info.seasonLengths);
    set('episodeNames', info.episodeNames);
    set('unwatchedEpisodes', info.unwatchedEpisodes);
    set('hasSeriesInfo', info.hasSeriesInfo);
    set('useOfficalSite', true);
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
