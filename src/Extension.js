'use strict';

class Extension {

    constructor() {
        chrome.browserAction.onClicked.addListener(this.go);
    }

    go() {
        // TODO
        var season = '05';
        var episode = '08';
        var url = 'http://southpark.cc.com/full-episodes/s' + season + 'e' + episode;

        chrome.tabs.create({ url: url });
    }
};

new Extension();
