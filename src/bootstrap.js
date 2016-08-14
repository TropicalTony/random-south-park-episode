import bugsnag from 'bugsnag';
import mixpanel from 'mixpanel';
import database from 'database';
import provider from 'provider';
import historian from 'historian';
import master from 'master';

bugsnag.init();
mixpanel.init();
database.init();
provider.init();
historian.init();
master.init();
