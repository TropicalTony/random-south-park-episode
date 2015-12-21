'use strict';

import {RandomEpisode} from './RandomEpisode';
import {hasToInitSeriesInfo, hasToUpdateSeriesInfo, initSeriesInfoAnd, updateSeriesInfoAnd, markAsWatched} from './Storage';

export class Extension {

    constructor() {
        this.addListener();
    }

    addListener() {
        if (chrome)
            chrome.browserAction.onClicked.addListener(() => this.continueOnClick());
        else
            setTimeout(this.addListener, 250);
    }

    continueOnClick() {
        if (hasToInitSeriesInfo())
            initSeriesInfoAnd(() => this.show());
        else if (hasToUpdateSeriesInfo())
            updateSeriesInfoAnd(() => this.show());
        else
            this.show();
    }

    show() {
        var random = new RandomEpisode().generate();
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
