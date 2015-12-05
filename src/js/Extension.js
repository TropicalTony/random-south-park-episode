'use strict';

import {getRandomEpisode} from './RandomEpisode';
import {hasToInitSeriesInfo, initSeriesInfoAnd, markAsWatched} from './Storage';

export function Extension() {

    function continueOnClick() {
        if (!hasToInitSeriesInfo())
            initSeriesInfoAnd(show);
        else
            show();
    }

    function show() {
        var random = getRandomEpisode();
        var url = 'http://southpark.cc.com/full-episodes/s' + random.season + 'e' + random.episode;

        openEpisode(url);
        markAsWatched(random.season, random.episode);
    }

    function openEpisode(url) {
        chrome.tabs.getSelected(null, function (tab) {
            var activeUrl = tab.url;

            if (activeUrl == 'chrome://newtab/' || /http:\/\/southpark.cc.com\/full-episodes/.test(activeUrl))
                chrome.tabs.update(tab.id, {url: url});
            else
                chrome.tabs.create({ url: url });
        });
    }

    return {

        init: function () {
            chrome.browserAction.onClicked.addListener(continueOnClick);
        }
    };
}
