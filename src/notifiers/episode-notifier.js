import _ from 'lodash';
import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import presenter from 'presenter';
import provider from 'provider';
import Historian from 'historian';

const NOTIFIED_EPISODE_STORAGE_KEY = 'notifiedEpisode';

export default {
    /**
     * Shows episode notification
     */
    show: () => {
        const notification = database.getEpisodeNotification();

        if (!notification || hasEpisodeBeenNotified(notification)) {
            return;
        }
        new Historian().getSeenEpisodes().then((seenEpisodes) => {
            if (!hasSeenEpisode(notification, seenEpisodes))
                showNotification(notification);
        });
    }
};

function hasEpisodeBeenNotified(notification) {
    if (!browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY))
        return false;

    return _.isEqualWith(notification, browser.getFromStorage(NOTIFIED_EPISODE_STORAGE_KEY), (objValue, othValue) => {
        return objValue.season === othValue.season && objValue.episode === othValue.episode;
    });
}

function hasSeenEpisode({season, episode}, seenEpisodes) {
    for (let i = 0; i < seenEpisodes.length; i ++)
        if (seenEpisodes[i].season === season && seenEpisodes[i].episode === episode)
            return true;

    return false;
}

function showNotification(notification) {
    browser.createNotification(notification);

    browser.onNotificationButtonsClick(handleOk(notification), handleCancel(notification));
    browser.onNotificationClose(() => mixpanel.trackCancelNotification(notification));

    markNotified(notification);

    return true;
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

function markNotified(notification) {
    mixpanel.trackShowNotification(notification);
    browser.setToStorage({key: NOTIFIED_EPISODE_STORAGE_KEY, value: notification});
}
