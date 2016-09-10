import bugsnag from 'bugsnag-js';

/**
 * Wrapper for bugsnag library
 */
export default {
    /**
     * Setup bugsnag
     */
    init: () => {
        bugsnag.apiKey = '9ce2f39164f9fe3beb1ec88df10cf7b9';
        bugsnag.beforeNotify = (error) => {
            error.stacktrace = error.stacktrace.replace(
                /chrome-extension:\/\/.*\/dist\//g,
                'https://github.com/syyfilis/random-south-park-episode/dist/'
            );
        };
    },

    /**
     * Notify exception
     *
     * @param {Error} e
     */
    notify: (e) => {
        bugsnag.notifyException(e);
    }
};
