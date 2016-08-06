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
            }
        });
        provider.init();
    });

    it('requests user country code from ip info', () => {
        expect(ipInfoGetUrl).toBe('http://ipinfo.io');
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
