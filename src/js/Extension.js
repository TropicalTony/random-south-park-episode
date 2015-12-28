'use strict';

import {RandomEpisode} from './RandomEpisode';
import {hasToInitSeriesInfo, hasToUpdateSeriesInfo, initSeriesInfo, updateSeriesInfoAnd, markAsWatched, syncHistory} from './Storage';

export class Extension {

    constructor() {
        if (hasToInitSeriesInfo())
            initSeriesInfo();

        this.addListener();
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
        var url = 'http://southpark.cc.com/full-episodes/s' + random.season + 'e' + random.episode;

        markAsWatched(random.season, random.episode);
        this.openEpisode(url);
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
