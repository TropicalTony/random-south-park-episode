import notifier from 'notifier';

describe('notifier', () => {
    let browser, database, mixpanel, presenter, storage, user;
    let notification, allowToShowNotification, usageCount, isChrome, createdNotification;
    let triggerOk, triggerCancel, triggerClose;

    beforeEach(() => {
        browser = {
            canShowNotification: (callback) => {
                allowToShowNotification = callback;
            },
            createNotification: (notification) => {
                createdNotification = notification;
            },
            getFromStorage: (key) => storage[key],
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
            clearNotification: jasmine.createSpy('clearNotification'),
            isChrome: () => isChrome
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
        user = {
            getUsageCount: () => usageCount
        };
        notifier.__set__({
            browser,
            mixpanel,
            database,
            presenter,
            user
        });
    });

    describe('notifyOnNeed()', () => {
        it('does nothing when notification can not been shown', () => {
            spyOn(database, 'getEpisodeNotification');

            notifier.notifyOnNeed();

            expect(database.getEpisodeNotification).not.toHaveBeenCalled();
        });

        describe('with ability to show notifications', () => {
            describe('and episode notification exists', () => {
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

                    expect(createdNotification).toBeUndefined();
                });
            });

            describe('and episode notification is not there to show', () => {
                beforeEach(() => {
                    notification = undefined;
                });

                it('does not show review notification when user is not using Chrome', () => {
                    isChrome = false;

                    notifier.notifyOnNeed();
                    allowToShowNotification();

                    expect(createdNotification).toBeUndefined();
                });

                it('does not show review notification when user is new', () => {
                    isChrome = true;
                    usageCount = 10;

                    notifier.notifyOnNeed();
                    allowToShowNotification();

                    expect(createdNotification).toBeUndefined();
                });

                it('shows review notification when user is on Chrome and has used extension over 50 times', () => {
                    isChrome = true;
                    usageCount = 65;

                    notifier.notifyOnNeed();
                    allowToShowNotification();

                    expect(createdNotification).toBeDefined();
                });

                it('ignores review notification on second time', () => {
                    isChrome = true;
                    usageCount = 65;

                    notifier.notifyOnNeed();
                    allowToShowNotification();

                    createdNotification = undefined;

                    notifier.notifyOnNeed();
                    allowToShowNotification();

                    expect(createdNotification).toBeUndefined();
                });
            });
        });
    });
});
