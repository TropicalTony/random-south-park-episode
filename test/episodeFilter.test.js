import episodeFilter from 'episodeFilter';

describe('episodeFilter', () => {
    beforeEach(() => {
        episodeFilter.__set__({
            database: {
                getEpisodes: () => {
                    return [
                        {season: 1, episode: 2},
                        {season: 1, episode: 3},
                        {season: 3, episode: 4},
                        {season: 4, episode: 5}
                    ];
                }
            },
            browser: {
                searchFromHistory: (query, seenInDays, callback) => {
                    if (query === 'http://southpark.cc.com/full-episodes/s') {
                        callback([{
                            url: 'http://southpark.cc.com/full-episodes/s01e01'
                        }, {
                            url: 'http://southpark.cc.com/full-episodes/s01e02'
                        }]);
                    } else if (seenInDays === 90 && query === 'http://kisscartoon.me/Cartoon/South-Park-Season') {
                        callback([{
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-03/Episode-004'
                        }, {
                            url: 'http://kisscartoon.me/Cartoon/South-Park-Season-04/Episode-005'
                        }]);
                    }
                }
            }
        });
    });

    describe('getUnseenEpisodes()', () => {
        it('filters out seen episodes from episodes list', (done) => {
            episodeFilter.getUnseenEpisodes((unseenEpisodes) => {
                expect(unseenEpisodes).toEqual([
                    {season: 1, episode: 3}
                ]);
                done();
            });
        });
    });
});
