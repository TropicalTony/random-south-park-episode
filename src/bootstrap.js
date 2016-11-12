import bugsnag from 'bugsnag';
import mixpanel from 'mixpanel';
import provider from 'provider';
import database from 'database';
import main from 'main';

/**
 * Collection of init calls
 */
bugsnag.init();
mixpanel.init();
provider.init();
database.init();
main.init();
