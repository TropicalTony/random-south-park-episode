import Historian from 'historian';

describe('historian', () => {
    let lastVisitTime, historian;

    beforeEach(() => {
        jasmine.clock().mockDate(new Date(1993, 9, 26));

        Historian.__set__({
            browser: {
                setToStorage: ({key, value}) => {
                    if (key === 'lastVisitTime')
                        lastVisitTime = value;
                },
                getFromStorage: (key) => {
                    if (key === 'lastVisitTime')
                        return lastVisitTime;
                },
                searchFromHistory: (query, lastVisitTime, callback) => {
                    if (query === 'http://southpark.cc.com/full-episodes/s') {
                        callback([{
                            lastVisitTime: 743809800000,
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            lastVisitTime: 743809900000,
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }]);
                    } else if (query === 'http://kisscartoon.me/Cartoon/South-Park-Season') {
                        callback([{
                            lastVisitTime: 703806800000,
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-03/Episode-004'
                        }, {
                            lastVisitTime: 783806800000,
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-04/Episode-005'
                        }]);
                    }
                }
            }
        });
        historian = new Historian();
    });

    it('sets current date and range to browser storage', () => {
        expect(lastVisitTime).toEqual({
            marked: 751582800000,
            time: 743806800000
        });
    });

    describe('getSeenEpisodes()', () => {
        it('collects all seen episodes', (done) => {
            historian.getSeenEpisodes().then((seenEpisodes) => {
                expect(seenEpisodes).toEqual([
                    {season: 1, episode: 1},
                    {season: 1, episode: 2},
                    {season: 4, episode: 5}
                ]);
                done();
            });
        });
    });
});
