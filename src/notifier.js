import browser from 'browser';
import episodeNotifier from 'notifiers/episode-notifier';
import reviewNotifier from 'notifiers/review-notifier';

export default {
    /**
     * Show either review or episode notification
     */
    notify: () => {
        browser.canShowNotification(() => reviewNotifier.show() || episodeNotifier.show());
    }
};
