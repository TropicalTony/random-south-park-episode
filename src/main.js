import browser from 'browser';
import database from 'database';
import mixpanel from 'mixpanel';
import notifier from 'notifier';
import picker from 'picker';
import presenter from 'presenter';

export default {
    init: () => {
        browser.onInstallOrUpdate(mixpanel.trackInstallOrUpdate);
        browser.onIconClick(handleIconClick);
    }
}

function handleIconClick() {
    database.reload();
    notifier.notifyOnNeed();
    picker.pick((episode) => presenter.show(episode));
}
