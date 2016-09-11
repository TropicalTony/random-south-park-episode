import presenter from 'presenter';

describe('presenter', () => {
    let tabUrl, isSouthparkUrl;
    let openTab, updateTab, isNewTab, mixpanel;

    beforeEach(() => {
        openTab = jasmine.createSpy('browser.openTab');
        updateTab = jasmine.createSpy('browser.updateTab');
        mixpanel = {
            trackShowEpisode: jasmine.createSpy('mixpanel.trackShowEpisode')
        };

        presenter.__set__({
            browser: {
                getActiveTab: (callback) => {
                    callback({id: 123, url: tabUrl});
                },
                openTab,
                updateTab,
                isNewTab: () => isNewTab
            },
            provider: {
                matchesUrl: () => {
                    return isSouthparkUrl;
                }
            },
            mixpanel
        });
    });

    describe('show()', () => {
        it('on same tab when new tab page is active', () => {
            isNewTab = true;

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(updateTab).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
        });

        it('on same tab when south park episode page is active', () => {
            isSouthparkUrl = true;

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(updateTab).toHaveBeenCalledWith(123, 'http://southpark.cc.com/full-episodes/s08e03');
        });

        it('on other tab otherwise', () => {
            isNewTab = false;
            isSouthparkUrl = false;

            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(openTab).toHaveBeenCalledWith('http://southpark.cc.com/full-episodes/s08e03');
        });

        it('tracks event', () => {
            presenter.show({season: 8, episode: 3, url: 'http://southpark.cc.com/full-episodes/s08e03'});
            expect(mixpanel.trackShowEpisode).toHaveBeenCalledWith({
                season: 8,
                episode: 3,
                url: 'http://southpark.cc.com/full-episodes/s08e03'
            });
        });
    });
});
