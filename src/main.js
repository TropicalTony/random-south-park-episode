import browser from 'browser';
import bugsnag from 'bugsnag';
import database from 'database';
import mixpanel from 'mixpanel';
import notifier from 'notifier';
import picker from 'picker';
import presenter from 'presenter';
import user from 'user';

/**
 * Extension starting point
 */
export default {

    /**
     * Tracks extension install-update and icon clicks
     */
    init: () => {
        browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
        browser.onIconClick(handleIconClick);
    }
};

function handleIconClick() {
    try {
        picker.pick((episode) => presenter.show(episode));

        database.reload();
        user.registerUsage();
        mixpanel.trackIconClick();
        notifier.notify();
    } catch (e) {
        bugsnag.notify(e);
        throw e;
    }
}
