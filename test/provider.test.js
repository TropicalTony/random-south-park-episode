import provider from 'provider';

describe('provider', () => {
    describe('getAllPossibleProviders()', () => {
        let providers;

        beforeEach(() => {
            providers = provider.getAllPossibleProviders();
        });

        it('gives South Park CC provider data', () => {
            expect(providers[0].rootUrl).toBe('http://southpark.cc.com/full-episodes/');
            expect(providers[0].parseUrl('http://southpark.cc.com/full-episodes/s02e04')).toEqual({season: 2, episode: 4});
        });
    });

    describe('isSouthparkUrl()', () => {
        it('is true when url is related to southpark cc', () => {
            expect(provider.isSouthparkUrl('http://southpark.cc.com/full-episodes/s02e11')).toBe(true);
        });

        it('is false when url is not related to southpark', () => {
            expect(provider.isSouthparkUrl('http://youtube.com')).toBe(false);
        });
    });

    describe('getUrl()', () => {
        it('returns southpark cc url', () => {
            expect(provider.getUrl(1, 12)).toBe('http://southpark.cc.com/full-episodes/s01e12');
        });
    });
});
