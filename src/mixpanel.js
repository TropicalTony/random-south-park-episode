import mixpanel from 'mixpanel-browser';
import user from 'user';

/**
 * Wrapper for mixpanel library
 */
export default {

    /**
     * Setup mixpanel
     */
    init: () => {
        mixpanel.init('d33e9ef8ecb715fef9439208bcbb63b7');
    },

    /**
     * Track extension install or update event
     *
     * @param {Object} details
     *  @param {String} details.reason
     *  @param {String} details.previousVersion
     */
    trackInstallOrUpdate: (details) => {
        if (details.reason === 'install')
            mixpanel.track('Install extension');
        else if (details.reason === 'update')
            mixpanel.track('Update extension', {previousVersion: details.previousVersion});
    },

    /**
     * Track event when user clicks on icon
     */
    trackIconClick: () => {
        mixpanel.track('Icon click', {totalUsage: user.getUsageCount()});
    },

    /**
     * Track event when we show episode
     *
     * @param {Object} properties
     */
    trackShowEpisode: (properties) => {
        mixpanel.track('Show episode', properties);
    },

    /**
     * Track event when we show notification
     *
     * @param {Object} properties
     */
    trackShowNotification: (properties) => {
        mixpanel.track('Show notification', properties);
    },

    /**
     * Track event when user clicks Ok button in notification
     *
     * @param {Object} properties
     */
    trackOkNotification: (properties) => {
        mixpanel.track('Ok notification', properties);
    },

    /**
     * Track event when user clicks Cancel button in notification
     *
     * @param {Object} properties
     */
    trackCancelNotification: (properties) => {
        mixpanel.track('Cancel notification', properties);
    }
};
