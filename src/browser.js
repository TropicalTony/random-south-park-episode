export default {

    onIconClick: (callback) => {
        return chrome.browserAction.onClicked.addListener(callback);
    },

    getActiveTab: (callback) => {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            callback(tabs[0]);
        });
    },

    updateTab: (tabId, url) => {
        chrome.tabs.update(tabId, {url: url});
    },

    openTab: (url) => {
        chrome.tabs.create({ url: url });
    }
};
