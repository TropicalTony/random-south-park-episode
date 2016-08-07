import provider from 'provider';

describe('provider', () => {
    let ipInfoGetUrl, ipInfoCallback;

    beforeEach(() => {
        provider.__set__({
            axios: {
                get: (url) => {
                    ipInfoGetUrl = url;

                    return {
                        then: (callback) => {
                            ipInfoCallback = callback;
                        }
                    };
                }
            },
            browser: {
                searchFromHistory: (query, callback) => {
                    if (query === 'http://southpark.cc.com/full-episodes/s') {
                        callback([{
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }]);
                    } else if (query === 'http://kisscartoon.me/Cartoon/South-Park-Season') {
                        callback([{
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-01/Episode-003'
                        }, {
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-01/Episode-004'
                        }]);
                    }
                }
            }
        });
        provider.init();
    });

    it('requests user country code from ip info', () => {
        expect(ipInfoGetUrl).toBe('http://ipinfo.io');
    });

    describe('getSeenEpisodes()', () => {
        it('gets all show providers views from history', () => {
            provider.getSeenEpisodes().then((seenEpisodes) => {
                expect(seenEpisodes).toEqual([
                    {season: 1, episode: 1},
                    {season: 1, episode: 2},
                    {season: 1, episode: 3},
                    {season: 1, episode: 4}
                ]);
            });
        });
    });

    describe('isSouthparkUrl()', () => {
        it('is true when url is related to southpark cc', () => {
            expect(provider.isSouthparkUrl('http://southpark.cc.com/full-episodes/s02e11')).toBe(true);
        });

        it('is true when url is related to kisscartoon south park page', () => {
            expect(provider.isSouthparkUrl('http://kisscartoon.me/Cartoon/South-Park-Season-02/Episode-011')).toBe(true);
        });

        it('is false when url is not related to southpark', () => {
            expect(provider.isSouthparkUrl('http://youtube.com')).toBe(false);
        });
    });

    describe('getUrl()', () => {
        it('returns kiss cartoon url to US user', () => {
            setUserCountryCode('US');
            expect(provider.getUrl(1, 12)).toBe('http://kisscartoon.me/Cartoon/South-Park-Season-01/Episode-012');
        });

        it('returns southpark cc url to EE user', () => {
            setUserCountryCode('EE');
            expect(provider.getUrl(1, 12)).toBe('http://southpark.cc.com/full-episodes/s01e12');
        });
    });

    function setUserCountryCode(code) {
        ipInfoCallback({ data: {country: code}});
    }
});
