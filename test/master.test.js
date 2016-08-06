import startTheParty from 'master';

describe('master', () => {
    let clickOnIcon, tabUrl, openTabSpy, updateTabSpy;
    let mixpanelInitSpy, mixpanelTrackSpy;

    beforeEach(() => {
        openTabSpy = jasmine.createSpy('browser.openTab');
        updateTabSpy = jasmine.createSpy('browser.updateTab');
        mixpanelInitSpy = jasmine.createSpy('mixpanel.init');
        mixpanelTrackSpy = jasmine.createSpy('mixpanel.track');

        startTheParty.__set__({
            browser: {
                onIconClick: (callback) => {
                    clickOnIcon = callback;
                },
                getActiveTab: (callback) => {
                    callback({id: 123, url: tabUrl});
                },
                openTab: openTabSpy,
                updateTab: updateTabSpy
            },
            mixpanel: {
                init: mixpanelInitSpy,
                track: mixpanelTrackSpy
            }
        });
        startTheParty();
    });

    it('inits Mixpanel with token', () => {
        expect(mixpanelInitSpy).toHaveBeenCalledWith('d33e9ef8ecb715fef9439208bcbb63b7');
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
            expect(mixpanelTrackSpy).toHaveBeenCalledWith('Show episode', {
                provider: 'southpark.cc.com',
                season: 8,
                episode: 3
            });
        });
    });
});
