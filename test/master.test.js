import startTheParty from 'master';

describe('master', () => {
    let updateExtension, clickOnIcon, tabUrl, openTabSpy, updateTabSpy;
    let mixpanelSpy, databaseInitSpy;

    beforeEach(() => {
        openTabSpy = jasmine.createSpy('browser.openTab');
        updateTabSpy = jasmine.createSpy('browser.updateTab');
        mixpanelSpy = {
            init: jasmine.createSpy('mixpanel.init'),
            trackInstallOrUpdate: jasmine.createSpy('mixpanel.trackInstallOrUpdate'),
            trackShowEpisode: jasmine.createSpy('mixpanel.trackShowEpisode')
        };
        databaseInitSpy = jasmine.createSpy('database.init');

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
            database: {
                init: databaseInitSpy
            },
        });
        startTheParty();
    });

    it('inits Mixpanel', () => {
        expect(mixpanelSpy.init).toHaveBeenCalledWith();
    });

    it('inits database', () => {
        expect(databaseInitSpy).toHaveBeenCalledWith();
    });

    describe('update extension', () => {
        it('is tracked', () => {
            updateExtension({reason: 'update'});
            expect(mixpanelSpy.trackInstallOrUpdate).toHaveBeenCalledWith({reason: 'update'});
        });
    });

    describe('open episode', () => {
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
                episode: 3
            });
        });
    });
});
