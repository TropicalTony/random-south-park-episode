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
        let serving = false;

        browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
        browser.onIconClick(() => {
            if (!serving) {
                serving = true;

                handleIconClick(() => {
                    serving = false;
                });
            }
        });
    }
};

function handleIconClick(finished) {
    try {
        picker.pick((episode) => {
            presenter.show(episode);
            notifier.notify();
            finished();
        });
        database.reload();
        user.registerUsage();
        mixpanel.trackIconClick();
    } catch (e) {
        bugsnag.notify(e);
        throw e;
    }
}
