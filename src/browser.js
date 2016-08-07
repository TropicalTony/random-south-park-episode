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
    },

    searchFromHistory: (text, callback) => {
        // 90 days in past
        const start  = new Date().setDate(new Date().getDate()) - 24 * 60 * 60 * 1000 * 90;
        const end = new Date().setDate(new Date().getDate());

        chrome.history.search({
            text: text,
            maxResults: 1000,
            startTime: start,
            endTime: end
        }, callback);
    }
};
