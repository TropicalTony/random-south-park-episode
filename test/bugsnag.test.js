import bugsnag from 'bugsnag';

describe('bugsnag', () => {
    let originalBugsnag;

    beforeEach(() => {
        originalBugsnag = {
            notifyException: jasmine.createSpy('notifyException')
        };

        bugsnag.__set__({
            bugsnag: originalBugsnag,
        });
        bugsnag.init();
    });

    it('sets bugsnag api key', () => {
        expect(originalBugsnag.apiKey).toBe('9ce2f39164f9fe3beb1ec88df10cf7b9');
    });

    it('overwrites bugsnag before notify', () => {
        const error = {
            stacktrace: 'chrome-extension://kmasklmdlakmd/dist/background.js'
        };
        originalBugsnag.beforeNotify(error);

        expect(error.stacktrace).toBe('https://github.com/syyfilis/random-south-park-episode/dist/background.js');
    });

    describe('notify()', () => {
        it('notifies given exception', () => {
            bugsnag.notify('Error');
            expect(originalBugsnag.notifyException).toHaveBeenCalledWith('Error');
        });
    });
});
