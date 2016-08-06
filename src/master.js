import browser from 'browser';
import mixpanel from 'mixpanel';
import database from 'database';
import episodePicker from 'episodePicker';
import provider from 'provider';

export default function startTheParty() {
    mixpanel.init();
    database.init();
    provider.init();

    browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
    browser.onIconClick(handleIconClick);
}

function handleIconClick() {
    database.reload();
    showEpisode();
}

function showEpisode() {
    const episode = episodePicker.pick();

    browser.getActiveTab((tab) => {
        if (isNewTab(tab.url) || provider.isSouthparkUrl(tab.url))
            browser.updateTab(tab.id, episode.url);
        else
            browser.openTab(episode.url);
    });
    mixpanel.trackShowEpisode(episode);
}

function isNewTab(url) {
    return url === 'chrome://newtab/';
}
