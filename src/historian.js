import _ from 'lodash';
import Promise from 'bluebird';
import moment from 'moment';
import browser from 'browser';
import provider from 'provider';

const LAST_VISIT_TIME_STORAGE_KEY = 'lastVisitTime';

export default class Historian {

    constructor() {
        this.searchResults = {};

        if (!browser.getFromStorage(LAST_VISIT_TIME_STORAGE_KEY))
            this.saveLastVisitTime(moment().subtract(90, 'days'));
    }

    /**
     * Gives back seen episodes from all providers
     */
    getSeenEpisodes(cutInDays) {
        let lastVisitTime = this.getLastVisitTime(cutInDays);

        return Promise.all(provider.getAllPossibleProviders().map((provider) => {
            return this.searchSeenEpisodes(provider.rootUrl, provider.parseUrl, lastVisitTime);
        })).then((results) => {
            return _.flatten(results);
        });
    }

    getLastVisitTime(cutInDays) {
        const lastVisitTime = browser.getFromStorage(LAST_VISIT_TIME_STORAGE_KEY);
        const newLastVisitTime = moment(lastVisitTime.time).add(moment().diff(lastVisitTime.marked, 'days'), 'days').subtract(cutInDays, 'days');

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
        let seenEpisodes = [];

        this.searchResults[query].map((result) => {
            if (moment(result.lastVisitTime).isAfter(lastVisitTime))
                seenEpisodes.push(parse(result.url))
        });
        return seenEpisodes;
    }

    saveLastVisitTime(time) {
        browser.setToStorage({
            key: LAST_VISIT_TIME_STORAGE_KEY,
            value: {
                marked: moment().valueOf(),
                time: time.valueOf()
            }
        });
    }
}
