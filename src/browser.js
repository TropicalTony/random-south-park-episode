const NOTIFICATION_ID = 'random-south-park-episode';

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

    searchFromHistory: (text, timeRangeInDays, callback) => {
        // Not supported in Firefox 48
        if (!chrome.history.search)
            return callback([]);

        const start  = new Date().setDate(new Date().getDate()) - 24 * 60 * 60 * 1000 * timeRangeInDays;
        const end = new Date().setDate(new Date().getDate());

        chrome.history.search({
            text: text,
            maxResults: 1000,
            startTime: start,
            endTime: end
        }, callback);
    },

    setToStorage: ({key, value}) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getFromStorage: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },

    createNotification: ({title, message, ok, cancel}, handleOk, handleCancel) => {
        // Not supported in Firefox
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
