import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import notifier from 'notifier';
import picker from 'picker';
import presenter from 'presenter';

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
}

function handleIconClick() {
    database.reload();
    notifier.notifyOnNeed();
    picker.pick((episode) => presenter.show(episode));
    mixpanel.trackIconClick();
}
