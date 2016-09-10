import bugsnag from 'bugsnag';
import mixpanel from 'mixpanel';
import database from 'database';
import main from 'main';

/**
 * Collection of init calls
 */
bugsnag.init();
mixpanel.init();
database.init();
main.init();
