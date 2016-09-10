import picker from 'picker';

describe('picker', () => {
    beforeEach(() => {
        picker.__set__({
            provider: {
                getUrl: (season, episode) => {
                    return `http://southpark.cc.com/full-episodes/s${season}e${episode}`;
                }
            },
            database: {
                getEpisodes: () => {
                    return [
                        {season: 1, episode: 2},
                        {season: 1, episode: 3},
                        {season: 13, episode: 14},
                        {season: 4, episode: 5}
                    ];
                }
            },
            historian: {
                getSeenEpisodes: (seenInDaysRangeCut) => {
                    return {
                        then: callback => {
                            if (seenInDaysRangeCut === 0)
                                callback([
                                    {season: 1, episode: 2},
                                    {season: 1, episode: 3},
                                    {season: 13, episode: 14},
                                    {season: 4, episode: 5}
                                ]);
                            else
                                callback([{season: 1, episode: 2}]);
                        }
                    };
                }
            }
        });
    });

    describe('pick()', () => {
        it('callbacks random season and episode', () => {
            window.Math.random = () => {
                return 0.75;
            };
            picker.pick((result) => {
                expect(result).toEqual({
                    season: 13,
                    episode: 14,
                    url: 'http://southpark.cc.com/full-episodes/s13e14'
                });
            });
        });
    });
});
