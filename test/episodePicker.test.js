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
                                1: {},
                                2: {},
                                3: {}
                            }
                        }
                    }
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
                episode: '2',
                provider: 'southpark.cc.com',
                url: 'http://southpark.cc.com/full-episodes/s11e02'
            });
        });
    });
});
