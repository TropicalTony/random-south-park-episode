'use strict';

class Extension {

    constructor() {
        chrome.browserAction.onClicked.addListener(this.go);
    }



    go() {
        if(JSON.parse(localStorage.getItem('hasSeasons')) != true){
            initSeasons();
        }
        
        var randomEpisode = getRandomEpisode();
        var season = randomEpisode.season;
        var episode = randomEpisode.episode;
        var url = 'http://southpark.cc.com/full-episodes/s' + episodeToString(season) + 'e' + episodeToString(episode);

        chrome.tabs.create({ url: url });
    }
};

new Extension();
