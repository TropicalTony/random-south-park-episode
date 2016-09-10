import _ from 'lodash';
import Promise from 'bluebird';
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
        this.searchResults = {};

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

        return Promise.all(provider.getAllPossibleProviders().map((provider) => {
            return this.searchSeenEpisodes(provider.rootUrl, provider.parseUrl, lastVisitTime);
        })).then((results) => {
            return _.flatten(results);
        });
    }

    getLastVisitTime(cutInDays) {
        const lastVisitTime = browser.getFromStorage(LAST_VISIT_TIME_STORAGE_KEY);
        const newLastVisitTime = moment(lastVisitTime).add(cutInDays, 'days');

        this.saveLastVisitTime(newLastVisitTime);

        return newLastVisitTime;
    }

    searchSeenEpisodes(query, parse, lastVisitTime) {
        return new Promise((resolve) => {
            if (this.searchResults[query])
                resolve(this.getSeenEpisodesFromSearchResults(query, parse, lastVisitTime));
            else
                browser.searchFromHistory(query, lastVisitTime.valueOf(), (results) => {
                    this.searchResults[query] = results;
                    resolve(this.getSeenEpisodesFromSearchResults(query, parse, lastVisitTime));
                });
        });
    }

    getSeenEpisodesFromSearchResults(query, parse, lastVisitTime) {
        const seenEpisodes = [];

        this.searchResults[query].forEach((result) => {
            if (moment(result.lastVisitTime).isAfter(lastVisitTime))
                seenEpisodes.push(parse(result.url));
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
