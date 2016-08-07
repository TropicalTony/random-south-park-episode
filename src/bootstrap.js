import mixpanel from 'mixpanel';
import database from 'database';
import provider from 'provider';
import master from 'master';
import bugsnag from 'bugsnag';

bugsnag.init();
mixpanel.init();
database.init();
provider.init();
master.init();
