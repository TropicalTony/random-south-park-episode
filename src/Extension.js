'use strict';

class Extension {

    constructor() {
        chrome.browserAction.onClicked.addListener(this.go);
    }



    go() {
        //Checking if seasons are initalized in local storage.
        if(JSON.parse(localStorage.getItem('hasSeasons')) != true){
            initSeasons();
        }

        var randomEpisode = getRandomEpisode();
        var season = randomEpisode.season;
        var episode = randomEpisode.episode;
        var url = 'http://southpark.cc.com/full-episodes/s' + episodeToString(season) + 'e' + episodeToString(episode);
        removeEpisodeFromStorage(season, episode);
        console.log("wtf");
        chrome.tabs.create({ url: url });
        
    }
};

new Extension();
