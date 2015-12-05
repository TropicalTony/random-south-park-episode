'use strict';

export function parseDataFromWiki(xmlDoc) {
    var data = xmlDoc.getElementsByClassName('wikitable plainrowheaders');

    data = data[0].getElementsByTagName('tbody');
    data = data[0].getElementsByTagName('tr');

    var totalSeasons = data.length - 2;
    var seasonLengths = [];

    //Saving episode names, episodes per season.
    data = xmlDoc.getElementsByClassName('wikitable plainrowheaders');

    for (var i = 0; i < totalSeasons; i++) {
        var episodeTable = data[i + 2].getElementsByTagName('tbody');
        episodeTable = episodeTable[0].getElementsByTagName('tr');
        var episodeNames = [];
        seasonLengths[i] = episodeTable.length - 1;

        for (j = 0; j < episodeTable.length - 1; j++) {
            var episodeName = episodeTable[j + 1].getElementsByTagName('td')[1].textContent;
            episodeNames[j] = episodeName;
        }

        var episodeArray = [];

        for (var j = 0; j < episodeTable.length - 1; j++) {
            episodeArray[j] = j + 1;
        }
        var spSeason = 'SouthParkSeason' + (i + 1).toString();

        localStorage.setItem(spSeason, JSON.stringify(episodeArray));
        localStorage.setItem('EpisodeNames' + (i + 1).toString(), JSON.stringify(episodeNames));
    }
    if (JSON.parse(localStorage.getItem('SouthParkSeason' + totalSeasons.toString())) != null) {
        var seasonsInit = true;
        localStorage.setItem('hasSeasons', JSON.stringify(seasonsInit));
        localStorage.setItem('totalSeasons', JSON.stringify(totalSeasons));
        localStorage.setItem('seasonLengths', JSON.stringify(seasonLengths));

        console.log('Seasons successfully initalized.');
    } else {
        console.log('Something went wrong initalizing seasons.');
    }
}
