import episodePicker from 'episodePicker';

describe('episodePicker', () => {
    beforeEach(() => {
        episodePicker.__set__({
            episodeFilter: {
                getUnseenEpisodes: () => {
                    return {
                        then: (callback) => {
                            callback([
                                {season: 1, episode: 11},
                                {season: 12, episode: 11},
                                {season: 17, episode: 3}
                            ]);
                        }
                    }
                }
            },
            provider: {
                getUrl: (season, episode) => {
                    return `http://southpark.cc.com/full-episodes/s${season}e${episode}`
                }
            }
        });
    });

    describe('pick()', () => {
        it('callbacks random season and episode', () => {
            window.Math.random = () => {
                return 0.5;
            };
            episodePicker.pick((result) => {
                expect(result).toEqual({
                    season: 12,
                    episode: 11,
                    url: 'http://southpark.cc.com/full-episodes/s12e11'
                });
            });
        });
    });
});
