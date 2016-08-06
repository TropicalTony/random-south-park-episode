import browser from 'browser';
import mixpanel from 'mixpanel-browser';

export default function startTheParty() {
    mixpanel.init('d33e9ef8ecb715fef9439208bcbb63b7');
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
    mixpanel.track('Show episode', {
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
