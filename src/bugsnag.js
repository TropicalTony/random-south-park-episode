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
        bugsnag.beforeNotify = function (error) {
            error.stacktrace = error.stacktrace.replace(/chrome-extension:/g, 'chromeextension:');
        }
    }
};
