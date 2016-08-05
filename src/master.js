import browser from 'browser';

export default function startTheParty() {
    browser.onIconClick(openEpisode);
}

function openEpisode() {
    const url = 'http://southpark.cc.com/full-episodes/s08e03';

    browser.getActiveTab((tab) => {
        if (isNewTab(tab.url) || isSouthParkCC(tab.url))
            browser.updateTab(tab.id, url);
        else
            browser.openTab(url);
    });
}

function isNewTab(url) {
    return url === 'chrome://newtab/';
}

function isSouthParkCC(url) {
    return /http:\/\/southpark.cc.com\/full-episodes/.test(url);
}
