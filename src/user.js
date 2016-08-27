import browser from 'browser';

const USAGE_STORAGE_KEY = 'usage';

/**
 * Extension user related util functions
 */
export default {

    /**
     * Register extension usage (click on icon)
     */
    registerUsage: () => {
        let usage = browser.getFromStorage(USAGE_STORAGE_KEY);

        browser.setToStorage({key: USAGE_STORAGE_KEY, value: usage ? usage + 1 : 1})
    },

    /**
     * Get usage count aka how much has user used our extension
     *
     * @return {Number} Usage count
     */
    getUsageCount: () => {
        return browser.getFromStorage(USAGE_STORAGE_KEY)
    }
};
