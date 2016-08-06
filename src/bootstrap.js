import mixpanel from 'mixpanel';
import database from 'database';
import provider from 'provider';
import master from 'master';

mixpanel.init();
database.init();
provider.init();
master.init();
