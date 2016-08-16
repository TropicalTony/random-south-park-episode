import main from 'main';

describe('main', () => {
    let updateExtension, clickOnIcon;
    let mixpanelSpy, databaseSpy, notifierSpy, presenterSpy;

    beforeEach(() => {
        mixpanelSpy = {
            trackInstallOrUpdate: jasmine.createSpy('mixpanel.trackInstallOrUpdate'),
            trackIconClick: jasmine.createSpy('mixpanel.trackIconClick')
        };
        databaseSpy = {
            reload: jasmine.createSpy('database.reload')
        };
        notifierSpy = {
            notifyOnNeed: jasmine.createSpy('notifier')
        };
        presenterSpy = {
            show: jasmine.createSpy('show episode')
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
            mixpanel: mixpanelSpy,
            database: databaseSpy,
            notifier: notifierSpy,
            presenter: presenterSpy,
            picker: {
                pick: (callback) => {
                    callback({
                        url: 'http://southpark.cc.com/full-episodes/s08e03',
                        season: 8,
                        episode: 3
                    });
                }
            }
        });
        main.init();
    });

    describe('update extension', () => {
        it('is tracked', () => {
            updateExtension({reason: 'update'});
            expect(mixpanelSpy.trackInstallOrUpdate).toHaveBeenCalledWith({reason: 'update'});
        });
    });

    describe('on icon click', () => {
        beforeEach(() => {
            clickOnIcon();
        });

        it('reloads database', () => {
            expect(databaseSpy.reload).toHaveBeenCalled();
        });

        it('show notification', () => {
            expect(notifierSpy.notifyOnNeed).toHaveBeenCalled();
        });

        it('show episode', () => {
            expect(presenterSpy.show).toHaveBeenCalledWith({
                url: 'http://southpark.cc.com/full-episodes/s08e03',
                season: 8,
                episode: 3
            });
        });

        it('tracks event in analytics', () => {
            expect(mixpanelSpy.trackIconClick).toHaveBeenCalled();
        });
    });
});
