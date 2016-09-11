import moment from 'moment';
import Historian from 'historian';

describe('historian', () => {
    let lastVisitTime, historian;

    beforeEach(() => {
        jasmine.clock().mockDate(moment());

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
                            lastVisitTime: moment().subtract(50, 'days').valueOf(),
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            lastVisitTime: moment().subtract(30, 'days').valueOf(),
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }, {
                            lastVisitTime: moment().subtract(95, 'days').valueOf(),
                            url: 'http://southpark.cc.com/full-episodes/s03e04'
                        }, {
                            lastVisitTime: moment().subtract(1, 'days').valueOf(),
                            url: 'http://southpark.cc.com/full-episodes/s04e05'
                        }]);
                    }
                }
            }
        });
        historian = new Historian();
    });

    it('sets last visit time to storage', () => {
        expect(lastVisitTime).toBe(moment().subtract(90, 'days').valueOf());
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
