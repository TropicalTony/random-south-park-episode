import bugsnag from 'bugsnag';
import mixpanel from 'mixpanel';
import database from 'database';
import provider from 'provider';
import main from 'main';

bugsnag.init();
mixpanel.init();
database.init();
provider.init();
main.init();
