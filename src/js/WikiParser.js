'use strict';

import {saveSeriesInfo, get, set, initHistory} from './Storage';

export function updateSeasonInfo(seasonsObject) {
    var parsed = {};

    parsed.episodeNames = parseEpisodeNames(seasonsObject);
    parsed.seasonLengths = parseSeasonLengths(seasonsObject);
    parsed.totalSeasons = parsed.seasonLengths.length;

    set('totalSeasons', parsed.totalSeasons);
    set('seasonLengths', parsed.seasonLengths);
    set('episodeNames', parsed.episodeNames);

    if (get('useOfficalSite') === null)
        set('useOfficalSite', true);
}

export function buildLocalStorage(seasonsObject) {
    var parsed = {};
    parsed.episodeNames = parseEpisodeNames(seasonsObject);
    parsed.seasonLengths = parseSeasonLengths(seasonsObject);
    parsed.unwatchedEpisodes = calculateEpisodeList(parseSeasonLengths(seasonsObject));
    parsed.hasSeriesInfo = true;
    parsed.totalSeasons = parsed.seasonLengths.length;
    saveSeriesInfo(parsed);
}

function parseEpisodeNames(seasonsObject) {
    var names = [];

    for(var season in seasonsObject) {
        var currentSeason = seasonsObject[season];
        var episodeList = [];
        for (var episode in currentSeason) {
            episodeList.push(currentSeason[episode]);
        }
        names.push(episodeList);
    }
    return names;
}

function parseSeasonLengths(seasonsObject) {
    var seasonLengths = [];

    for (var season in seasonsObject) {
        seasonLengths.push(seasonsObject[season].length - 1)
    }
    return seasonLengths;
}

export function calculateEpisodeList(seasonLengths) {
    var episodes = [];

    for (var t = 0; t < seasonLengths.length; t++) {
        episodes.push([]);

        for (var s = 0; s < seasonLengths[t]; s ++)
            episodes[t].push(s + 1);
    }
    return episodes;
}
