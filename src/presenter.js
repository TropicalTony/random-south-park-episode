import browser from 'browser';
import mixpanel from 'mixpanel';
import provider from 'provider';

export default {
    show: (episode) => {
        browser.getActiveTab((tab) => {
            if (isNewTab(tab.url) || provider.isSouthparkUrl(tab.url))
                browser.updateTab(tab.id, episode.url);
            else
                browser.openTab(episode.url);
        });
        mixpanel.trackShowEpisode(episode);
    }
};

function isNewTab(url) {
    return url === 'chrome://newtab/';
}
