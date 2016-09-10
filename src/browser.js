import bowser from 'bowser';

const NOTIFICATION_ID = 'random-south-park-episode';

/**
 * Wrapper for browser API related actions
 */
export default {

    /**
     * Listen to install and update events
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled
     * (not supported in Firefox yet)
     *
     * @param {Function} callback
     */
    onInstallOrUpdate: (callback) => {
        if (!chrome.runtime.onInstalled)
            return;

        chrome.runtime.onInstalled.addListener(callback);
    },

    /**
     * Listen to icon clicks
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction/onClicked
     *
     * @param {Function} callback
     */
    onIconClick: (callback) => {
        chrome.browserAction.onClicked.addListener(callback);
    },

    /**
     * Get currently active tab object
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/query
     *
     * @param {Function} callback Gives first active tab object
     */
    getActiveTab: (callback) => {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => callback(tabs[0]));
    },

    /**
     * Update given tab url
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/update
     *
     * @param {String} tabId
     * @param {String} url
     */
    updateTab: (tabId, url) => {
        chrome.tabs.update(tabId, {url: url});
    },

    /**
     * Open new tab with given url
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
     *
     * @param {String} url
     */
    openTab: (url) => {
        chrome.tabs.create({ url: url });
    },

    /**
     * Search text from browser history and give back results with callback
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/history/search
     * (not supported in Firefox 48)
     *
     * @param {String} text
     * @param {Double} text
     */
    searchFromHistory: (text, lastVisitTime, callback) => {
        if (!chrome.history.search)
            return callback([]);

        chrome.history.search({text, maxResults: 1000, startTime: lastVisitTime}, callback);
    },

    /**
     * Save data to localstorage
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
     *
     * @param {Object}
     *  @param {String} key
     *  @param {*} value
     */
    setToStorage: ({key, value}) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * Get saved data from localstorage
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
     *
     * @param {String} key
     * @return {*} value
     */
    getFromStorage: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },

    /**
     * Decide if we can and have rights to show notifications in a browser
     *
     * See https://developer.chrome.com/apps/notifications#method-getPermissionLevel
     * (notifications are not fully supported in Firefox and Opera)
     *
     * @callback callback Triggered when we can show notifications
     */
    canShowNotification: (callback) => {
        if (!chrome.notifications.getPermissionLevel || bowser.name === 'opera')
            return;

        chrome.notifications.getPermissionLevel((level) => {
            if (level === 'granted')
                callback();
        });
    },

    /**
     * Create notification
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications/create
     *
     * @param {Object}
     *  @param {String} title Notification title
     *  @param {String} message Notification body message
     *  @param {String} ok Okey button message
     *  @param {String} cancel Cancel button message
     */
    createNotification: ({title, message, ok, cancel}) => {
        chrome.notifications.create(NOTIFICATION_ID, {
            type: 'basic',
            iconUrl: '../images/icon-48.png',
            title,
            message,
            buttons: [
                {title: ok},
                {title: cancel}
            ]
        });

    },

    /**
     * Handle notification button clicks
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications/onButtonClicked
     *
     * @param {Function} handleOk Callback when ok button is clicked
     * @param {Function} handleCancel Callback when cancel button is clicked
     */
    onNotificationButtonsClick: (handleOk, handleCancel) => {
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            if (notificationId !== NOTIFICATION_ID)
                return;

            if (buttonIndex === 0)
                handleOk();
            else
                handleCancel();
        });
    },

    /**
     * Handles notification close
     *
     * See https://developer.chrome.com/apps/notifications#event-onClosed
     *
     * @callback when notification is closed by user
     */
    onNotificationClose: (callback) => {
        chrome.notifications.onClosed.addListener((notificationId, byUser) => {
            if (notificationId === NOTIFICATION_ID && byUser)
                callback();
        });
    },

    /**
     * Clear current notification
     *
     * See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications/clear
     */
    clearNotification: () => {
        chrome.notifications.clear(NOTIFICATION_ID);
    }
};
