import browser from 'browser';
import mixpanel from 'mixpanel';
import database from 'database';

export default function startTheParty() {
    mixpanel.init();
    database.init();

    browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
    browser.onIconClick(showEpisode);
}

function showEpisode() {
    const url = 'http://southpark.cc.com/full-episodes/s08e03';

    browser.getActiveTab((tab) => {
        if (isNewTab(tab.url) || isSouthParkCC(tab.url))
            browser.updateTab(tab.id, url);
        else
            browser.openTab(url);
    });
    mixpanel.trackShowEpisode({
        provider: 'southpark.cc.com',
        season: 8,
        episode: 3
    });
}

function isNewTab(url) {
    return url === 'chrome://newtab/';
}

function isSouthParkCC(url) {
    return /http:\/\/southpark.cc.com\/full-episodes/.test(url);
}
