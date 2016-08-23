import _ from 'lodash';
import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import presenter from 'presenter';
import provider from 'provider';

const NOTIFIED_EPISODE_STORAGE_KEY = 'notifiedEpisode';

/**
 * Notifications manager
 */
export default {

    /**
     * Get notification from db and decide if to show it or not
     */
    notifyOnNeed: () => {
        browser.canShowNotification(notify);
    }
};

function notify() {
    const notification = database.getEpisodeNotification();

    if (notification && !hasBeenNotified(notification))
        showEpisodeNotification(notification);
}

function hasBeenNotified(notification) {
    if (!browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY))
        return false;

    return _.isEqualWith(notification, browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY), (objValue, othValue) => {
        return objValue.season === othValue.season && objValue.episode === othValue.episode;
    });
}

function showEpisodeNotification(notification) {
    markNotified(notification);

    browser.createNotification(notification);

    browser.onNotificationButtonsClick(handleOk(notification), handleCancel(notification));
    browser.onNotificationClose(() => mixpanel.trackCancelNotification(notification));
}

function markNotified(notification) {
    mixpanel.trackShowNotification(notification);
    browser.setToStorage({
        key: NOTIFIED_EPISODE_STORAGE_KEY,
        value: notification
    });
}

function handleOk(notification) {
    return () => {
        presenter.show(getEpisodeObj(notification));
        browser.clearNotification();
        mixpanel.trackOkNotification(notification);
    };
}

function handleCancel(notification) {
    return () => {
        browser.clearNotification();
        mixpanel.trackCancelNotification(notification);
    };
}

function getEpisodeObj({season, episode}) {
    return {season, episode, url: provider.getUrl(season, episode)};
}
