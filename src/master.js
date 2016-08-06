import browser from 'browser';
import mixpanel from 'mixpanel';
import database from 'database';
import episodePicker from 'episodePicker';

export default function startTheParty() {
    mixpanel.init();
    database.init();

    browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
    browser.onIconClick(showEpisode);
}

function showEpisode() {
    const episode = episodePicker.pick();

    browser.getActiveTab((tab) => {
        if (isNewTab(tab.url) || isSouthParkCC(tab.url))
            browser.updateTab(tab.id, episode.url);
        else
            browser.openTab(episode.url);
    });
    mixpanel.trackShowEpisode(episode);
}

function isNewTab(url) {
    return url === 'chrome://newtab/';
}

function isSouthParkCC(url) {
    return /http:\/\/southpark.cc.com\/full-episodes/.test(url);
}
