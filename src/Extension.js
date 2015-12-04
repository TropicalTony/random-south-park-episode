'use strict';

import {getRandomEpisode} from './RandomEpisode';
import {initSeasons, removeEpisodeFromStorage} from './Storage';

class Extension {

    constructor() {
        chrome.browserAction.onClicked.addListener(this.go);
    }

    go() {
        if (JSON.parse(localStorage.getItem('hasSeasons')) != true)
            initSeasons();

        var randomEpisode = getRandomEpisode();
        var season = randomEpisode.season;
        var episode = randomEpisode.episode;
        var url = 'http://southpark.cc.com/full-episodes/s' + trim(season) + 'e' + trim(episode);

        removeEpisodeFromStorage(season, episode);
        openEpisodeFrom(url);
    }
};

function trim(episode) {
    if (episode < 10)
        return '0' + episode.toString();

    return episode.toString();
}

function openEpisodeFrom(url) {
    chrome.tabs.getSelected(null, function (tab) {
        var activeUrl = tab.url;

        if (activeUrl == 'chrome://newtab/' || /http:\/\/southpark.cc.com\/full-episodes/.test(activeUrl))
            return chrome.tabs.update(tab.id, {url: url});

        chrome.tabs.create({ url: url });  
    }); 
}

new Extension();
