import user from 'user';

describe('user', () => {
    beforeEach(() => {
        let usageCount = 0;

        user.__set__({
            browser: {
                setToStorage: ({key, value}) => {
                    if (key === 'usage') {
                        usageCount = value;
                    }
                },
                getFromStorage: (key) => key === 'usage' && usageCount
            }
        });
    });

    it('registers usage and gives then count when asked', () => {
        user.registerUsage();
        expect(user.getUsageCount()).toBe(1);

        user.registerUsage();
        user.registerUsage();
        user.registerUsage();
        expect(user.getUsageCount()).toBe(4);
    });
});
