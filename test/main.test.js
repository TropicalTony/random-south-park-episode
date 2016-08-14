import main from 'main';

describe('main', () => {
    let updateExtension, clickOnIcon, tabUrl, isSouthparkUrl
    let openTabSpy, updateTabSpy, mixpanelSpy, databaseSpy;

    beforeEach(() => {
        openTabSpy = jasmine.createSpy('browser.openTab');
        updateTabSpy = jasmine.createSpy('browser.updateTab');
        mixpanelSpy = {
            trackInstallOrUpdate: jasmine.createSpy('mixpanel.trackInstallOrUpdate'),
            trackShowEpisode: jasmine.createSpy('mixpanel.trackShowEpisode')
        };
        databaseSpy = {
            reload: jasmine.createSpy('database.reload')
        };
        isSouthparkUrl = false;

        main.__set__({
            browser: {
                onInstallOrUpdate: (callback) => {
                    updateExtension = callback;
                },
                onIconClick: (callback) => {
                    clickOnIcon = callback;
                },
                getActiveTab: (callback) => {
                    callback({id: 123, url: tabUrl});
                },
                openTab: openTabSpy,
                updateTab: updateTabSpy
            },
            mixpanel: mixpanelSpy,
            database: databaseSpy,
            picker: {
                pick: (callback) => {
                    callback({
                        url: 'http://southpark.cc.com/full-episodes/s08e03',
                        season: 8,
                        episode: 3,
                        provider: 'southpark.cc.com'
                    });
                }
            },
            provider: {
                isSouthparkUrl: () => {
                    return isSouthparkUrl;
                }
            }
        });
        main.init();
    });

    describe('update extension', () => {
        it('is tracked', () => {
            updateExtension({reason: 'update'});
            expect(mixpanelSpy.trackInstallOrUpdate).toHaveBeenCalledWith({reason: 'update'});
        });
    });

    describe('on icon click', () => {
        it('reloads database', () => {
            clickOnIcon();
            expect(databaseSpy.reload).toHaveBeenCalled();
        });

        describe('show episode', () => {
            it('on same tab when new tab page is active', () => {
                tabUrl = 'chrome://newtab/';

                clickOnIcon();
                expect(updateTabSpy).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
            });

            it('on same tab when south park episode page is active', () => {
                tabUrl = 'http://southpark.cc.com/full-episodes/s01e02';
                isSouthparkUrl = true;

                clickOnIcon();
                expect(updateTabSpy).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
            });

            it('on new tab otherwise', () => {
                tabUrl = 'chrome://extensions';

                clickOnIcon();
                expect(openTabSpy).toHaveBeenCalledWith('http://southpark.cc.com/full-episodes/s08e03');
            });

            it('tracks event', () => {
                clickOnIcon();
                expect(mixpanelSpy.trackShowEpisode).toHaveBeenCalledWith({
                    provider: 'southpark.cc.com',
                    season: 8,
                    episode: 3,
                    url: 'http://southpark.cc.com/full-episodes/s08e03'
                });
            });
        });
    });
});
