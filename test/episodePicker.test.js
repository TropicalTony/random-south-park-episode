import episodePicker from 'episodePicker';

describe('episodePicker', () => {
    beforeEach(() => {
        episodePicker.__set__({
            database: {
                getSeasons: () => {
                    return {
                        1: {
                            episodes: {
                                12: {}
                            }
                        },
                        11: {
                            episodes: {
                                11: {},
                                12: {},
                                13: {}
                            }
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
        it('returns random season and episode', () => {
            window.Math.random = () => {
                return 0.5;
            };
            const result = episodePicker.pick();

            expect(result).toEqual({
                season: '11',
                episode: '12',
                url: 'http://southpark.cc.com/full-episodes/s11e12'
            });
        });
    });
});
