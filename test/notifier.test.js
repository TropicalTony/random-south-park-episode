import notifier from 'notifier';

describe('notifier', () => {
    let reviewNotifier, episodeNotifier, browser;
    let allowToShowNotification;

    beforeEach(() => {
        browser = {
            canShowNotification: (callback) => {
                allowToShowNotification = callback;
            }
        };
        reviewNotifier = {
            show: jasmine.createSpy()
        };
        episodeNotifier = {
            show: jasmine.createSpy()
        };

        notifier.__set__({
            browser,
            reviewNotifier,
            episodeNotifier
        });
    });

    describe('notify()', () => {
        it('does nothing when not supported', () => {
            notifier.notify();
            expect(allowToShowNotification).toBeDefined();
            expect(reviewNotifier.show).not.toHaveBeenCalled();
        });

        it('shows review notification at first', () => {
            reviewNotifier.show.and.returnValue(true);

            notifier.notify();
            allowToShowNotification();

            expect(reviewNotifier.show).toHaveBeenCalled();
            expect(episodeNotifier.show).not.toHaveBeenCalled();
        });

        it('shows episode notification when review notification is not shown', () => {
            reviewNotifier.show.and.returnValue(false);

            notifier.notify();
            allowToShowNotification();

            expect(reviewNotifier.show).toHaveBeenCalled();
            expect(episodeNotifier.show).toHaveBeenCalled();
        });
    });
});
