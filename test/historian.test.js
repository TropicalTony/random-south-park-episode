import historian from 'historian';

describe('historian', () => {
    let hasSeenInDays;

    beforeEach(() => {
        jasmine.clock().mockDate(new Date(1993, 9, 26));

        historian.__set__({
            browser: {
                setToStorage: ({key, value}) => {
                    if (key === 'hasSeenInDays')
                        hasSeenInDays = value;
                },
                getFromStorage: (key) => {
                    if (key === 'hasSeenInDays')
                        return hasSeenInDays;
                },
                searchFromHistory: (query, seenInDays, callback) => {
                    if (query === 'http://southpark.cc.com/full-episodes/s') {
                        callback([{
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }]);
                    } else if (query === 'http://kisscartoon.me/Cartoon/South-Park-Season') {
                        callback([{
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-03/Episode-004'
                        }, {
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-04/Episode-005'
                        }]);
                    }
                }
            }
        });
        historian.init();
    });

    it('sets current date and range to browser storage', () => {
        expect(hasSeenInDays).toEqual({
            date: 751582800000,
            range: 90
        });
    });

    describe('getSeenEpisodes()', () => {
        it('collects all seen episodes', (done) => {
            historian.getSeenEpisodes().then((seenEpisodes) => {
                expect(seenEpisodes).toEqual([
                    {season: 1, episode: 1},
                    {season: 1, episode: 2},
                    {season: 3, episode: 4},
                    {season: 4, episode: 5}
                ]);
                done();
            });
        });
    });
});
