import database from 'database';

describe('database', () => {
    let initializeAppSpy, deleteAppSpy, databaseRef, giveData;

    beforeEach(() => {
        initializeAppSpy = jasmine.createSpy('initializeApp');
        deleteAppSpy = jasmine.createSpy('deleteApp');

        database.__set__({
            firebase: {
                initializeApp: initializeAppSpy,
                app: () => {
                    return {delete: deleteAppSpy};
                },
                database: () => {
                    return {
                        ref: (ref) => {
                            databaseRef = ref;
                            return {
                                on: (event, callback) => {
                                    if (event === 'value')
                                        giveData = callback;
                                }
                            };
                        }
                    };
                }
            }
        });
        database.init();
    });

    it('has fallback data', () => {
        expect(database.getEpisodes()).toBeDefined();
    });

    it('initializes firebase', () => {
        expect(initializeAppSpy).toHaveBeenCalledWith({
            databaseURL: 'https://random-south-park-episode.firebaseio.com',
            apiKey: 'AIzaSyBaKw13z1Rp98tbysXMsV8dI68mx38LOcU'
        });
    });

    it('tries to get data on init', () => {
        expect(databaseRef).toBe('/');
        expect(giveData).toBeDefined();
    });

    it('deletes the connection after data has arrived', () => {
        giveData({val: () => {
            return {};
        }});
        expect(deleteAppSpy).toHaveBeenCalled();
    });

    describe('getEpisodes()', () => {
        it('returns processed episodes object in array', () => {
            giveData({
                val: () => {
                    return {seasons: [undefined, {
                        episodes: {12: {}}
                    }, {
                        episodes: {3: {}}
                    }
                ]};
                }
            });
            expect(database.getEpisodes()).toEqual([
                {season: 1, episode: 12},
                {season: 2, episode: 3},
            ]);
        });
    });

    describe('getLessFortunateCountries()', () => {
        it('returns less fortunate countries in array', () => {
            giveData({
                val: () => {
                    return {lessFortunateCountries: ['US']};
                }
            });
            expect(database.getLessFortunateCountries()).toEqual(['US']);
        });
    });

    describe('getEpisodeNotification()', () => {
        it('returns notifications list', () => {
            giveData({
                val: () => {
                    return {
                        episodeNotification: {
                            title: 'Check new episode'
                        }
                    };
                }
            });
            expect(database.getEpisodeNotification()).toEqual({
                title: 'Check new episode'
            });
        });
    });
});
