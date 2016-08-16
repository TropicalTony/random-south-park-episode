import _ from 'lodash';
import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import presenter from 'presenter';
import provider from 'provider';

const NOTIFIED_STORAGE_KEY = 'notified';

/**
 * Notifications manager
 */
export default {

    /**
     * Get notifications from db and decide what notification to show
     */
    notifyOnNeed: () => {
        browser.canShowNotification(() => {
            const notifications = database.getNotifications();

            if (notifications.watch && !hasBeenNotified(notifications.watch))
                showWatchNotification(notifications.watch);
        });
    }
};

function hasBeenNotified(notification) {
    if (!browser.getFromStorage(NOTIFIED_STORAGE_KEY))
        return false;

    return _.isEqualWith(notification, browser.getFromStorage(NOTIFIED_STORAGE_KEY), (objValue, othValue) => {
        return objValue.title === othValue.title && objValue.message === othValue.message;
    });
}

function showWatchNotification(notification) {
    mixpanel.trackShowNotification(notification);
    markNotified(notification);

    browser.createNotification(notification);
    browser.onNotificationButtonsClick(() => {
        presenter.show(getEpisodeObj(notification));
        browser.clearNotification();
        mixpanel.trackOkNotification(notification);
    }, () => {
        browser.clearNotification();
        mixpanel.trackCancelNotification(notification);
    });
    browser.onNotificationClose(() => {
        mixpanel.trackCancelNotification(notification);
    });
}

function getEpisodeObj({season, episode}) {
    return {season, episode, url: provider.getUrl(season, episode)};
}

function markNotified(notification) {
    browser.setToStorage({
        key: NOTIFIED_STORAGE_KEY,
        value: notification
    });
}
