export default {

    onInstallOrUpdate: (callback) => {
        // Not supported in Firefox yet
        if (!chrome.runtime.onInstalled)
            return;

        chrome.runtime.onInstalled.addListener(callback);
    },

    onIconClick: (callback) => {
        chrome.browserAction.onClicked.addListener(callback);
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
