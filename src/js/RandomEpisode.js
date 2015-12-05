'use strict';

export function getRandomEpisode() {
    var unwatchedSeasons = [];
    var unwatchedEpisodes;

    for (var i = 0; i < JSON.parse(localStorage.getItem('totalSeasons')); i++) {
        unwatchedEpisodes = JSON.parse(localStorage.getItem('SouthParkSeason' + (i + 1).toString()));

        if (unwatchedEpisodes && unwatchedEpisodes.length != 0) {
            unwatchedSeasons[unwatchedSeasons.length] = i + 1;
        }
    }
    var seasonIndex = randomInt(1, unwatchedSeasons.length);

    unwatchedEpisodes = JSON.parse(localStorage.getItem('SouthParkSeason' + unwatchedSeasons[seasonIndex]));

    var episodeIndex = randomInt(1, unwatchedEpisodes.length);

    return {
        season: trim(unwatchedSeasons[seasonIndex]),
        episode: trim(unwatchedEpisodes[episodeIndex])
    };
}

function trim(seriesInfo) {
    if (seriesInfo < 10)
        return '0' + seriesInfo.toString();

    return seriesInfo.toString();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
