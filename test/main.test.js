import main from 'main';

describe('main', () => {
    let updateExtension, clickOnIcon;
    let mixpanel, database, notifier, presenter, user;

    beforeEach(() => {
        mixpanel = {
            trackInstallOrUpdate: jasmine.createSpy('mixpanel.trackInstallOrUpdate'),
            trackIconClick: jasmine.createSpy('mixpanel.trackIconClick')
        };
        database = {
            reload: jasmine.createSpy('database.reload')
        };
        notifier = {
            notify: jasmine.createSpy('notifier')
        };
        presenter = {
            show: jasmine.createSpy('show episode')
        };
        user = {
            registerUsage: jasmine.createSpy('register usage')
        };

        main.__set__({
            browser: {
                onInstallOrUpdate: (callback) => {
                    updateExtension = callback;
                },
                onIconClick: (callback) => {
                    clickOnIcon = callback;
                }
            },
            picker: {
                pick: (callback) => {
                    callback({
                        url: 'http://southpark.cc.com/full-episodes/s08e03',
                        season: 8,
                        episode: 3
                    });
                }
            },
            mixpanel,
            database,
            notifier,
            presenter,
            user
        });
        main.init();
    });

    describe('update extension', () => {
        it('is tracked', () => {
            updateExtension({reason: 'update'});
            expect(mixpanel.trackInstallOrUpdate).toHaveBeenCalledWith({reason: 'update'});
        });
    });

    describe('on icon click', () => {
        beforeEach(() => {
            clickOnIcon();
        });

        it('reloads database', () => {
            expect(database.reload).toHaveBeenCalled();
        });

        it('registers usage', () => {
            expect(user.registerUsage).toHaveBeenCalled();
        });

        it('show notification', () => {
            expect(notifier.notify).toHaveBeenCalled();
        });

        it('show episode', () => {
            expect(presenter.show).toHaveBeenCalledWith({
                url: 'http://southpark.cc.com/full-episodes/s08e03',
                season: 8,
                episode: 3
            });
        });

        it('tracks event in analytics', () => {
            expect(mixpanel.trackIconClick).toHaveBeenCalled();
        });
    });
});
