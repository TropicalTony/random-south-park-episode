import browser from 'browser';
import mixpanel from 'mixpanel';
import user from 'user';

const NOTIFIED_REVIEW_STORAGE_KEY = 'notifiedReview';
const HARD_CORE_USAGE_LEVEL = 50;

export default {
    /**
     * Shows review notificaiton for hard core users
     *
     * @return {Boolean} did show or not
     */
    show: () => {
        if (user.getUsageCount() > HARD_CORE_USAGE_LEVEL && !hasBeenNotified()) {
            showNotification();

            return true;
        } else {
            return false;
        }
    }
};

function hasBeenNotified() {
    return browser.getFromStorage(NOTIFIED_REVIEW_STORAGE_KEY);
}

function showNotification() {
    const notification = {
        title: 'How about a review?',
        message: 'You can help us gain more users by giving us a review  in the extension store :)',
        ok: 'Write a review',
        cancel: 'How about NO!'
    };
    browser.createNotification(notification);
    browser.onNotificationButtonsClick(handleOk(notification), handleCancel(notification));
    browser.onNotificationClose(() => mixpanel.trackCancelNotification(notification));

    markNotified(notification);
}

function handleOk(notification) {
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

function markNotified(notification) {
    mixpanel.trackShowNotification(notification);
    browser.setToStorage({key: NOTIFIED_REVIEW_STORAGE_KEY, value: notification});
}
