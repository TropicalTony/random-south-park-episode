import mixpanel from 'mixpanel';
import database from 'database';
import episodeProvider from 'episodeProvider';
import master from 'master';
import bugsnag from 'bugsnag';

bugsnag.init();
mixpanel.init();
database.init();
episodeProvider.init();
master.init();
