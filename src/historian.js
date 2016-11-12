import moment from 'moment';
import browser from 'browser';
import provider from 'provider';

const LAST_VISIT_TIME_STORAGE_KEY = 'lastVisitTime';

/**
 * History handling class
 */
export default class Historian {
    /**
     * Sets searchResults cache and last visit time when needed
     */
    constructor() {
        if (!browser.getFromStorage(LAST_VISIT_TIME_STORAGE_KEY))
            this.saveLastVisitTime(moment().subtract(90, 'days'));
    }

    /**
     * Gives back seen episodes from all providers
     *
     * @param {Number} cutInDays Cut history search range in days
     * @return {Promise}
     */
    getSeenEpisodes(cutInDays) {
        const lastVisitTime = this.getLastVisitTime(cutInDays);

        return this.searchSeenEpisodes(lastVisitTime);
    }

    getLastVisitTime(cutInDays) {
        const lastVisitTime = browser.getFromStorage(LAST_VISIT_TIME_STORAGE_KEY);
        const newLastVisitTime = moment(lastVisitTime).add(cutInDays, 'days');

        this.saveLastVisitTime(newLastVisitTime);

        return newLastVisitTime;
    }

    searchSeenEpisodes(lastVisitTime) {
        return new Promise((resolve) => {
            if (this.searchResults)
                resolve(this.getSeenEpisodesFromSearchResults(lastVisitTime));
            else
                browser.searchFromHistory(provider.getRootUrl(), lastVisitTime.valueOf(), (results) => {
                    this.searchResults = results;
                    resolve(this.getSeenEpisodesFromSearchResults(lastVisitTime));
                });
        });
    }

    getSeenEpisodesFromSearchResults(lastVisitTime) {
        const seenEpisodes = [];

        this.searchResults.forEach((result) => {
            if (moment(result.lastVisitTime).isAfter(lastVisitTime))
                seenEpisodes.push(provider.parseUrl(result.url));
        });
        return seenEpisodes;
    }

    saveLastVisitTime(time) {
        browser.setToStorage({
            key: LAST_VISIT_TIME_STORAGE_KEY,
            value: time.valueOf()
        });
    }
}
