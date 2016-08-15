import bugsnag from 'bugsnag';
import mixpanel from 'mixpanel';
import database from 'database';
import provider from 'provider';
import main from 'main';

/**
 * Collection of init calls that are not unit tested
 */
bugsnag.init();
mixpanel.init();
database.init();
provider.init();
main.init();
