import database from 'database';

describe('database', () => {
    let axios, giveData;

    beforeEach(() => {
        axios = {
            get: () => {
                return {
                    then: (callback) => {
                        giveData = callback;
                    }
                };
            }
        };
        spyOn(axios, 'get').and.callThrough();

        database.__set__({axios});
        database.init();
    });

    it('has fallback data', () => {
        expect(database.getEpisodes()).toBeDefined();
    });

    it('tries to get data on init', () => {
        expect(axios.get).toHaveBeenCalledWith('https://raw.githubusercontent.com/syyfilis/random-south-park-episode/master/database.json');
    });

    describe('getEpisodes()', () => {
        it('returns episode objects in array', () => {
            giveData({
                data: {
                    episodes: [
                        {season: 1, episode: 12},
                        {season: 2, episode: 3},
                    ]
                }
            });
            expect(database.getEpisodes()).toEqual([
                {season: 1, episode: 12},
                {season: 2, episode: 3},
            ]);
        });
    });

    describe('getEpisodeNotification()', () => {
        it('returns notification object', () => {
            giveData({
                data: {
                    episodeNotification: {
                        title: 'Check new episode'
                    }
                }
            });
            expect(database.getEpisodeNotification()).toEqual({
                title: 'Check new episode'
            });
        });
    });
});
