import Historian from 'historian';

describe('historian', () => {
    let lastVisitTime, historian;

    beforeEach(() => {
        jasmine.clock().mockDate(new Date(736043100000));

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
                    if (query === 'http://southpark.cc.com/full-episodes/') {
                        callback([{
                            lastVisitTime: 743859800000,
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            lastVisitTime: 743829100000,
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }, {
                            lastVisitTime: 708270700000,
                            url: 'http://southpark.cc.com/full-episodes/s03e04'
                        }, {
                            lastVisitTime: 783806800000,
                            url: 'http://southpark.cc.com/full-episodes/s04e05'
                        }]);
                    }
                }
            }
        });
        historian = new Historian();
    });

    it('sets last visit time to storage', () => {
        expect(lastVisitTime).toBeDefined();
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
