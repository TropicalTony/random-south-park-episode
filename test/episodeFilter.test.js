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
            provider: {
                getSeenEpisodes: () => {
                    return {
                        then: (callback) => {
                            callback([
                                {season: 1, episode: 1},
                                {season: 1, episode: 2},
                                {season: 1, episode: 3},
                                {season: 1, episode: 4}
                            ]);
                        }
                    };
                }
            }
        });
    });

    describe('getUnseenEpisodes()', () => {
        it('filters out seen episodes from episodes list', () => {
            episodeFilter.getUnseenEpisodes((unseenEpisodes) => {
                expect(unseenEpisodes).toEqual([
                    {season: 3, episode: 4},
                    {season: 4, episode: 5}
                ]);
            });
        });
    });
});
