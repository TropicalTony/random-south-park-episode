import startTheParty from 'master';

describe('master', () => {
    let updateExtension, clickOnIcon, tabUrl, openTabSpy, updateTabSpy;
    let mixpanelSpy, databaseSpy;

    beforeEach(() => {
        openTabSpy = jasmine.createSpy('browser.openTab');
        updateTabSpy = jasmine.createSpy('browser.updateTab');
        mixpanelSpy = {
            init: jasmine.createSpy('mixpanel.init'),
            trackInstallOrUpdate: jasmine.createSpy('mixpanel.trackInstallOrUpdate'),
            trackShowEpisode: jasmine.createSpy('mixpanel.trackShowEpisode')
        };
        databaseSpy = {
            init: jasmine.createSpy('database.init'),
            reload: jasmine.createSpy('database.reload')
        };
        startTheParty.__set__({
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
            episodePicker: {
                pick: () => {
                    return {
                        url: 'http://southpark.cc.com/full-episodes/s08e03',
                        season: 8,
                        episode: 3,
                        provider: 'southpark.cc.com'
                    };
                }
            }
        });
        startTheParty();
    });

    it('inits Mixpanel', () => {
        expect(mixpanelSpy.init).toHaveBeenCalledWith();
    });

    it('inits database', () => {
        expect(databaseSpy.init).toHaveBeenCalledWith();
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
