'use strict';

import {setWatchedEpisodesFromHistory, syncHistory, set, get} from '../js/Storage';
import {calculateEpisodeList} from '../js/WikiParser';

document.getElementById('seasonList').onchange = function () {
    document.getElementById('episodeList').innerHTML = '';
    buildEpisodeList();
};

document.getElementById('resetAll').onclick = function () {
    var resetedList = calculateEpisodeList(get('totalSeasons'), get('seasonLengths'));
    set('unwatchedEpisodes', resetedList);
    buildEpisodeList();
}

document.getElementById('resetHistory').onclick = function () {
    var resetedList = calculateEpisodeList(get('totalSeasons'), get('seasonLengths'));
    set('unwatchedEpisodes', resetedList);
    setWatchedEpisodesFromHistory(new Date().setDate(new Date().getDate()) - 24 * 60 * 60 * 1000 * 90, buildEpisodeList);
}

function init() {
    syncHistory(buildCheckAllButton);
    initGA();
}

function buildSeasonList() {
    var div = document.getElementById('seasonList');

    for (var i = 0; i < get('totalSeasons'); i++) {
        var optionValue = document.createElement('option');
        optionValue.text = 'Season ' + (i + 1).toString();
        optionValue.value = (i + 1).toString();
        div.appendChild(optionValue);
    }
    buildEpisodeList();
}

function buildCheckAllButton() {
    var checkAll = document.getElementById('checkAll');
    var checkAllInput = document.createElement('input');
    checkAllInput.type = 'checkbox';
    checkAllInput.id = 'checkAllBox'
    checkAll.appendChild(checkAllInput);
    checkAllInput.onclick = function () {
        var seasonToCheck = getActiveSeason();
        var checkedSeason = get('unwatchedEpisodes');
        if (checkAllInput.checked === true) {
            checkedSeason[seasonToCheck - 1] = [];
            set('unwatchedEpisodes', checkedSeason);

        } else {
            buildFullSeason(seasonToCheck);
        }
        document.getElementById('episodeList').innerHTML = '';
        buildEpisodeList();

    }

    var labelCheckAll = document.createElement('label');
    labelCheckAll.id = 'checkAllLable';
    labelCheckAll.appendChild(document.createTextNode('Check/Uncheck all'));
    checkAll.appendChild(labelCheckAll);
    buildSeasonList();
}

function checkAllButtonStatus(season) {
    if (get('unwatchedEpisodes')[season - 1].length === 0) {
        document.getElementById('checkAllBox').checked = true;
    } else {
        document.getElementById('checkAllBox').checked = false;
    }
}

function buildEpisodeList() {
    var season = getActiveSeason();
    checkAllButtonStatus(season);
    document.getElementById('episodeList').innerHTML = '';
    var div = document.getElementById('episodeList');

    var currentSeason = get('unwatchedEpisodes')[season - 1];
    var episodeNames = get('episodeNames')[season - 1];

    for (var i = 0; i < get('seasonLengths')[season - 1]; i++) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = 'Episode' + (i + 1).toString();
        checkbox.onclick = function () {
            save()
        };
        checkbox.id = i + 1;

        if (currentSeason.indexOf(i + 1) === -1) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        div.appendChild(checkbox);

        var label = document.createElement('label');
        label.htmlFor = i + 1;
        label.appendChild(document.createTextNode(i + 1 + '. ' + episodeNames[i].replace(/['"]+/g, '')));

        div.appendChild(label);
        div.appendChild(document.createElement('br'));

    }
}

function save() {
    var selectedSeason = getActiveSeason();
    var newEpisodes = [];

    for (var i = 0; i < get('seasonLengths')[selectedSeason - 1]; i++)
        if (!document.getElementById((i + 1).toString()).checked)
            newEpisodes.push(i + 1);

    var unwatchedEpisodes = get('unwatchedEpisodes');
    unwatchedEpisodes[selectedSeason - 1] = newEpisodes;

    set('unwatchedEpisodes', unwatchedEpisodes);
    checkAllButtonStatus(selectedSeason);
}

function buildFullSeason(season) {
    var fullSeason = [];
    for (var i = 0; i < get('seasonLengths')[season - 1]; i++) {
        fullSeason[i] = i + 1;
    }
    var unwatchedEpisodes = get('unwatchedEpisodes');
    unwatchedEpisodes[season - 1] = fullSeason;
    set('unwatchedEpisodes', unwatchedEpisodes);
}

function getActiveSeason() {
    if (document.getElementById('seasonList').value == undefined)
        return 1;
    return document.getElementById('seasonList').value;
}

function initGA() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-71620285-4', 'auto');
    ga('set', 'checkProtocolTask', function(){});
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/options.html');
}

init();
