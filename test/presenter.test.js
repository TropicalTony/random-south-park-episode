import presenter from 'presenter';

describe('presenter', () => {
    let tabUrl, isSouthparkUrl;
    let openTabSpy, updateTabSpy, mixpanelSpy;

    beforeEach(() => {
        openTabSpy = jasmine.createSpy('browser.openTab');
        updateTabSpy = jasmine.createSpy('browser.updateTab');
        mixpanelSpy = {trackShowEpisode: jasmine.createSpy('mixpanel.trackShowEpisode')};
        isSouthparkUrl = false;

        presenter.__set__({
            browser: {
                getActiveTab: (callback) => {
                    callback({id: 123, url: tabUrl});
                },
                openTab: openTabSpy,
                updateTab: updateTabSpy
            },
            mixpanel: mixpanelSpy,
            provider: {
                isSouthparkUrl: () => {
                    return isSouthparkUrl;
                }
            }
        });
    });

    describe('show()', () => {
        it('on same tab when new tab page is active', () => {
            tabUrl = 'chrome://newtab/';

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(updateTabSpy).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
        });

        it('on same tab when south park episode page is active', () => {
            tabUrl = 'http://southpark.cc.com/full-episodes/s01e02';
            isSouthparkUrl = true;

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(updateTabSpy).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
        });

        it('on new tab otherwise', () => {
            tabUrl = 'chrome://extensions';

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(openTabSpy).toHaveBeenCalledWith('http://southpark.cc.com/full-episodes/s08e03');
        });

        it('tracks event', () => {
            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(mixpanelSpy.trackShowEpisode).toHaveBeenCalledWith({
                season: 8,
                episode: 3,
                url: 'http://southpark.cc.com/full-episodes/s08e03'
            });
        });
    });
});
