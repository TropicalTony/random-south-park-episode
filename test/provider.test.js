import provider from 'provider';

describe('provider', () => {
    it('has rootUrl', () => {
        expect(provider.getRootUrl()).toBe('http://southpark.cc.com/full-episodes/');
    });

    describe('matchesUrl()', () => {
        it('is true when url is related to southpark cc', () => {
            expect(provider.matchesUrl('http://southpark.cc.com/full-episodes/s02e11')).toBe(true);
        });

        it('is false when url is not related to southpark', () => {
            expect(provider.matchesUrl('http://youtube.com')).toBe(false);
        });
    });

    describe('getUrl()', () => {
        it('returns southpark cc url', () => {
            expect(provider.getUrl({season: 1, episode: 12})).toBe('http://southpark.cc.com/full-episodes/s01e12');
        });
    });

    describe('parseUrl()', () => {
        it('gives South Park CC provider data', () => {
            expect(provider.parseUrl('http://southpark.cc.com/full-episodes/s02e04')).toEqual({
                season: 2,
                episode: 4
            });
        });
    });
});
