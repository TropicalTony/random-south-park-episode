import browser from 'browser';

describe('browser', () => {
    describe('onInstallOrUpdate()', () => {
        describe('on Firefox', () => {
            beforeEach(() => {
                window.chrome = {
                    runtime: {}
                };
            });

            it('does nothing', () => {
                expect(browser.onInstallOrUpdate).not.toThrow();
            });
        });

        describe('on Chrome and Opera', () => {
            beforeEach(() => {
                window.chrome = {
                    runtime: {
                        onInstalled: {
                            addListener: jasmine.createSpy('chrome onInstalled addListener')
                        }
                    }
                };
            });

            it('passes callback to chrome', () => {
                const callback = () => {};

                browser.onInstallOrUpdate(callback);

                expect(window.chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(callback);
            });
        });
    });

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

    describe('searchFromHistory()', () => {
        beforeEach(() => {
            window.chrome = {
                history: {
                    search: jasmine.createSpy('chrome history search')
                }
            };
            jasmine.clock().mockDate(new Date(1993, 9, 26));
        });

        it('passes params', () => {
            const callback = () => {};

            browser.searchFromHistory('https://southpark.com', callback);

            expect(window.chrome.history.search).toHaveBeenCalledWith({
                text: 'https://southpark.com',
                maxResults: 1000,
                startTime: 743806800000,
                endTime: 751582800000
            }, callback);
        });
    });
});
