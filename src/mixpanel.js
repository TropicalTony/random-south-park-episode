import mixpanel from 'mixpanel-browser';

export default {

    init: () => {
        mixpanel.init('d33e9ef8ecb715fef9439208bcbb63b7');
    },

    trackInstallOrUpdate: (details) => {
        if (details.reason === 'install')
            mixpanel.track('Install extension');
        else if (details.reason === 'update')
            mixpanel.track('Update extension', {previousVersion: details.previousVersion});
    },

    trackShowEpisode: (properties) => {
        mixpanel.track('Show episode', properties);
    },

    trackShowNotification: (properties) => {
        mixpanel.track('Show notification', properties);
    },

    trackOkNotification: (properties) => {
        mixpanel.track('Ok notification', properties);
    },

    trackCancelNotification: (properties) => {
        mixpanel.track('Cancel notification', properties);
    }
};
