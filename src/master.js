import browser from 'browser';
import mixpanel from 'mixpanel';
import database from 'database';
import episodePicker from 'episodePicker';
import episodeProvider from 'episodeProvider';

export default {
    init: () => {
        browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
        browser.onIconClick(handleIconClick);
    }
}

function handleIconClick() {
    database.reload();
    showEpisode();
}

function showEpisode() {
    episodePicker.pick((episode) => {
        browser.getActiveTab((tab) => {
            if (isNewTab(tab.url) || episodeProvider.isSouthparkUrl(tab.url))
                browser.updateTab(tab.id, episode.url);
            else
                browser.openTab(episode.url);
        });
        mixpanel.trackShowEpisode(episode);
    });
}

function isNewTab(url) {
    return url === 'chrome://newtab/';
}
