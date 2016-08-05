import browser from 'browser';

describe('browser', () => {
    describe('onIconClick()', () => {
        beforeEach(() => {
            window.chrome = {
                browserAction: {
                    onClicked: {
                        addListener: jasmine.createSpy('chrome onClicked addListener')
                    }
                }
            };
        });

        it('passes callback to chrome', () => {
            const callback = () => {};

            browser.onIconClick(callback);

            expect(window.chrome.browserAction.onClicked.addListener).toHaveBeenCalledWith(callback);
        });
    });

    describe('getActiveTab()', () => {
        let queryConfig;
        let queryCallback;

        beforeEach(() => {
            window.chrome = {
                tabs: {
                    query: (config, callback) => {
                        queryConfig = config;
                        queryCallback = callback;
                    }
                }
            };
        });

        it('passes config', () => {
            browser.getActiveTab();

            expect(queryConfig).toEqual({currentWindow: true, active: true});
        });

        it('gives first tab to callback', () => {
            const callback = jasmine.createSpy('getActiveTab() callback');

            browser.getActiveTab(callback);
            queryCallback(['tab 0', 'tab 1']);

            expect(callback).toHaveBeenCalledWith('tab 0');
        });
    });

    describe('updateTab()', () => {
        beforeEach(() => {
            window.chrome = {
                tabs: {
                    update: jasmine.createSpy('chrome tabs update')
                }
            };
        });

        it('passes params', () => {
            const tabId = 123;

            browser.updateTab(tabId, 'https://southpark.com');

            expect(window.chrome.tabs.update).toHaveBeenCalledWith(tabId, {url: 'https://southpark.com'});
        });
    });

    describe('openTab()', () => {
        beforeEach(() => {
            window.chrome = {
                tabs: {
                    create: jasmine.createSpy('chrome tabs create')
                }
            };
        });

        it('passes params', () => {
            browser.openTab('https://southpark.com');

            expect(window.chrome.tabs.create).toHaveBeenCalledWith({url: 'https://southpark.com'});
        });
    });
});
