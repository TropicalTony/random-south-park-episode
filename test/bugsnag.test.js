import bugsnag from 'bugsnag';

describe('bugsnag', () => {
    let originalBugsnag;

    beforeEach(() => {
        originalBugsnag = {};

        bugsnag.__set__({
            bugsnag: originalBugsnag
        });
        bugsnag.init();
    });

    it('sets bugsnag api key', () => {
        expect(originalBugsnag.apiKey).toBe('9ce2f39164f9fe3beb1ec88df10cf7b9');
    });

    it('overwrites bugsnag before notify', () => {
        const error = {
            stacktrace: 'chrome-extension://test'
        };
        originalBugsnag.beforeNotify(error)

        expect(error.stacktrace).toBe('chromeextension://test');
    });
});
