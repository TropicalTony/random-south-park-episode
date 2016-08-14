const NOTIFICATION_ID = 'random-south-park-episode';

export default {

    // Not supported in Firefox yet
    onInstallOrUpdate: (callback) => {
        if (!chrome.runtime.onInstalled)
            return;

        chrome.runtime.onInstalled.addListener(callback);
    },

    onIconClick: (callback) => {
        chrome.browserAction.onClicked.addListener(callback);
    },

    getActiveTab: (callback) => {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => callback(tabs[0]));
    },

    updateTab: (tabId, url) => {
        chrome.tabs.update(tabId, {url: url});
    },

    openTab: (url) => {
        chrome.tabs.create({ url: url });
    },

    // Not supported in Firefox 48
    searchFromHistory: (text, lastVisitTime, callback) => {
        if (!chrome.history.search)
            return callback([]);

        chrome.history.search({text, maxResults: 1000, startTime: lastVisitTime}, callback);
    },

    setToStorage: ({key, value}) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getFromStorage: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },

    // Not supported in Firefox
    createNotification: ({title, message, ok, cancel}, handleOk, handleCancel) => {
        if (!chrome.notifications.onButtonClicked)
            return;

        chrome.notifications.create(NOTIFICATION_ID, {
            type: 'basic',
            iconUrl: '../images/icon-48.png',
            title: title,
            message: message,
            buttons: [
                {title: ok},
                {title: cancel}
            ]
        });
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            if (buttonIndex === 0)
                handleOk();
            else
                handleCancel();
        });
    },

    clearNotification: () => {
        chrome.notifications.clear(NOTIFICATION_ID);
    }
};
