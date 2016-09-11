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
     *
     * @param {Object} episode
     *  @param {String} episode.url
     *  @param {Number} episode.season
     *  @param {Number} episode.episode
     */
    show: (episode) => {
        browser.getActiveTab((tab) => {
            if (isNewTab(tab.url) || provider.matchesUrl(tab.url))
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
