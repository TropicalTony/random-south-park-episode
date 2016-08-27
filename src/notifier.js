import _ from 'lodash';
import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import presenter from 'presenter';
import provider from 'provider';
import user from 'user';

const NOTIFIED_EPISODE_STORAGE_KEY = 'notifiedEpisode';
const NOTIFIED_REVIEW_STORAGE_KEY = 'notifiedReview';

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

    if (notification && !hasEpisodeBeenNotified(notification))
        showEpisodeNotification(notification);
    else if (browser.isChrome() && user.getUsageCount() > 50 && !hasReviewBeenNotified())
        showReviewNotification();
}

function hasEpisodeBeenNotified(notification) {
    if (!browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY))
        return false;

    return _.isEqualWith(notification, browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY), (objValue, othValue) => {
        return objValue.season === othValue.season && objValue.episode === othValue.episode;
    });
}

function hasReviewBeenNotified() {
    return browser.getFromStorage(NOTIFIED_REVIEW_STORAGE_KEY);
}

function showEpisodeNotification(notification) {
    browser.createNotification(notification);

    browser.onNotificationButtonsClick(handleEpisodeOk(notification), handleCancel(notification));
    browser.onNotificationClose(() => mixpanel.trackCancelNotification(notification));

    markNotified(NOTIFIED_EPISODE_STORAGE_KEY, notification);
}

function showReviewNotification() {
    const notification = {
        title: 'How about a rating in the extension store?',
        message: 'You can help us gain more users by giving us a rating :)',
        ok: 'Rate the extension',
        cancel: 'Leave me alone!'
    };
    browser.createNotification(notification);
    browser.onNotificationButtonsClick(handleReviewOk(notification), handleCancel(notification));
    browser.onNotificationClose(() => mixpanel.trackCancelNotification(notification));

    markNotified(NOTIFIED_REVIEW_STORAGE_KEY, notification);
}

function handleEpisodeOk(notification) {
    return () => {
        presenter.show(getEpisodeObj(notification));
        browser.clearNotification();
        mixpanel.trackOkNotification(notification);
    };
}

function handleReviewOk(notification) {
    return () => {
        browser.openTab('https://chrome.google.com/webstore/detail/random-south-park-episode/gnejpgpadafimefcjbhnglbnfbboakjf/reviews');
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

function markNotified(key, notification) {
    mixpanel.trackShowNotification(notification);
    browser.setToStorage({key, value: notification});
}
