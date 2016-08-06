import database from 'database';

describe('database', () => {
    let initializeAppSpy, databaseRef, giveData;

    beforeEach(() => {
        initializeAppSpy = jasmine.createSpy('initializeApp');

        database.__set__({
            firebase: {
                initializeApp: initializeAppSpy,
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

    it('initializes firebase', () => {
        expect(initializeAppSpy).toHaveBeenCalledWith({
            databaseURL: 'https://shining-inferno-2925.firebaseio.com',
            apiKey: '8JkC3cdKxhrZjfyfmbAMabKu7qL9o950ojlxedPy'
        });
    });

    it('tries to get data on init', () => {
        expect(databaseRef).toBe('/');
        expect(giveData).toBeDefined();
    });
});