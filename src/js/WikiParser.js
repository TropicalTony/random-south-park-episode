'use strict';

export function parseInfoFromWiki(xmlDoc) {
    var parsed = {};

    // TODO @tonis refactor these next 4 lines of parsing html
    var html = xmlDoc.getElementsByClassName('wikitable plainrowheaders');
    html = html[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    var totalSeasons = html.length - 2;

    html = xmlDoc.getElementsByClassName('wikitable plainrowheaders');

    parsed.episodeNames = parseEpisodeNames(html, totalSeasons);
    parsed.seasonLengths = parseSeasonLengths(html, totalSeasons);
    parsed.unwatchedEpisodes = calculateEpisodeList(totalSeasons, parsed.seasonLengths);
    parsed.hasSeriesInfo = true;
    parsed.totalSeasons = totalSeasons;

    return parsed;
}

function parseEpisodeNames(html, totalSeasons) {
    var names = [];

    for (var i = 0; i < totalSeasons; i++) {
        var episodeNames = [];
        var episodeTable = getEpisodeTableFrom(html, i);

        for (var j = 0; j < episodeTable.length - 1; j++)
            episodeNames.push(episodeTable[j + 1].getElementsByTagName('td')[1].textContent);

        names.push(episodeNames);
    }
    return names;
}

function parseSeasonLengths(html, totalSeasons) {
    var seasonLengths = [];

    for (var i = 0; i < totalSeasons; i++) {
        seasonLengths.push(getEpisodeTableFrom(html, i).length - 1);
    }
    return seasonLengths;
}

function getEpisodeTableFrom(html, index) {
    return html[index + 2].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
}

function calculateEpisodeList(totalSeasons, seasonLengths) {
    var episodes = [];

    for (var t = 0; t < totalSeasons; t++) {
        episodes.push([]);

        for (var s = 0; s < seasonLengths[t]; s ++)
            episodes[t].push(s + 1);
    }
    return episodes;
}