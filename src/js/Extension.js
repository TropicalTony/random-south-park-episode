'use strict';

import {parseInfoFromWiki} from './WikiParser';
import {RandomEpisode} from './RandomEpisode';
import {hasToInitSeriesInfo, hasToUpdateSeriesInfo, initSeriesInfo, updateSeriesInfoAnd, markAsWatched, syncHistory} from './Storage';
var Firebase = require("firebase");

export class Extension {

    constructor() {
        this.initGoogleAnalytics();

        if (hasToInitSeriesInfo())
            initSeriesInfo();

        this.addListener();
    }

    initGoogleAnalytics() {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-71620285-4', 'auto');
        ga('set', 'checkProtocolTask', function(){});
        ga('require', 'displayfeatures');
    }

    addListener() {
        if (chrome && chrome.browserAction)
            chrome.browserAction.onClicked.addListener(() => this.continueOnClick());
        else
            setTimeout(this.addListener, 250);
    }

    continueOnClick() {
        if (hasToInitSeriesInfo())
            setTimeout(() => this.continueOnClick(), 250);
        else if (hasToUpdateSeriesInfo())
            updateSeriesInfoAnd(() => this.start());
        else
            this.start();
    }

    start() {
        syncHistory(new RandomEpisode().generateAnd((random) => this.show(random)));
    }

    show(random) {
        parseInfoFromWiki();
        var url = 'http://southpark.cc.com/full-episodes/s' + random.season + 'e' + random.episode;

        markAsWatched(random.season, random.episode);
        this.openEpisode(url);

        ga('send', 'event', 'Usage', 'Show episode', 'S' + random.season + 'E' + random.episode);
    }

    openEpisode(url) {
        chrome.tabs.getSelected(null, function (tab) {
            var activeUrl = tab.url;

            if (activeUrl == 'chrome://newtab/' || /http:\/\/southpark.cc.com\/full-episodes/.test(activeUrl))
                chrome.tabs.update(tab.id, {url: url});
            else
                chrome.tabs.create({ url: url });
        });
    }
}
