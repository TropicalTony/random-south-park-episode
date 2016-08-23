import notifier from 'notifier';

describe('notifier', () => {
    let browser, database, mixpanel, presenter, notification, createdNotification, storage;
    let allowToShowNotification;
    let triggerOk, triggerCancel, triggerClose;

    beforeEach(() => {
        browser = {
            canShowNotification: (callback) => {
                allowToShowNotification = callback;
            },
            createNotification: (notification) => {
                createdNotification = notification;
            },
            getFromStorage: (key) => {
                return storage[key];
            },
            setToStorage: ({key, value}) => {
                storage[key] = value;
            },
            onNotificationButtonsClick: (okCallback, cancelCallback) => {
                triggerOk = okCallback;
                triggerCancel = cancelCallback;
            },
            onNotificationClose: (callback) => {
                triggerClose = callback;
            },
            clearNotification: jasmine.createSpy('clearNotification')
        };
        storage = {};
        database = {
            getEpisodeNotification: () => notification
        };
        mixpanel = {
            trackShowNotification: jasmine.createSpy('trackShowNotification'),
            trackOkNotification: jasmine.createSpy('trackOkNotification'),
            trackCancelNotification: jasmine.createSpy('trackCancelNotification')
        };
        presenter = {
            show: jasmine.createSpy('presenter.show')
        };
        notifier.__set__({
            browser,
            mixpanel,
            database,
            presenter
        });
    });

    describe('notifyOnNeed()', () => {
        it('does nothing when notification can not been shown', () => {
            spyOn(database, 'getEpisodeNotification');

            notifier.notifyOnNeed();

            expect(database.getEpisodeNotification).not.toHaveBeenCalled();
        });

        describe('with ability to show notifications', () => {
            beforeEach(() => {
                notification = {
                    title: 'Hello',
                    message: 'Intro',
                    ok: 'Lets do this',
                    cancel: 'No',
                    season: 4,
                    episode: 5
                };
                notifier.notifyOnNeed();
                allowToShowNotification();
            });

            it('creates notification at first', () => {
                expect(createdNotification).toEqual(notification);
            });

            it('tracks notification showing event in Mixpanel', () => {
                expect(mixpanel.trackShowNotification).toHaveBeenCalledWith(notification);
            });

            it('presents episode on ok answer', () => {
                triggerOk();
                expect(presenter.show).toHaveBeenCalledWith({
                    season: 4,
                    episode: 5,
                    url: 'http://southpark.cc.com/full-episodes/s04e05'
                });
                expect(browser.clearNotification).toHaveBeenCalled();
                expect(mixpanel.trackOkNotification).toHaveBeenCalledWith(notification);
            });

            it('presents nothing on cancel answer', () => {
                triggerCancel();
                expect(presenter.show).not.toHaveBeenCalled();
                expect(browser.clearNotification).toHaveBeenCalled();
                expect(mixpanel.trackCancelNotification).toHaveBeenCalledWith(notification);
            });

            it('tracks cancel event when notification is closed', () => {
                triggerClose();
                expect(mixpanel.trackCancelNotification).toHaveBeenCalledWith(notification);
            });

            it('ignores the same notification on second time', () => {
                createdNotification = undefined;

                notifier.notifyOnNeed();
                allowToShowNotification();

                expect(createdNotification).not.toEqual(notification);
            });
        });
    });
});
