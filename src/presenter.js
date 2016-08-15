import browser from 'browser';
import mixpanel from 'mixpanel';
import provider from 'provider';

/**
 * Service that handles showing episode
 */
export default {

    /**
     *
     * Opens episode in new tab or current and tracks event in
     * mixpanel.
     */
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
