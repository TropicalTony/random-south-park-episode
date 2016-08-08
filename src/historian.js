import _ from 'lodash';
import Promise from 'bluebird';
import moment from 'moment';
import browser from 'browser';
import provider from 'provider';

const HAS_SEEN_IN_DAYS_STORAGE_KEY = 'hasSeenInDays';

export default {

    init: () => {
        if (!browser.getFromStorage(HAS_SEEN_IN_DAYS_STORAGE_KEY))
            saveSeenInDaysRange(90);
    },

    getSeenEpisodes: (seenInDaysRangeCut) => {
        let seenInDays = getSeenInDaysRange(seenInDaysRangeCut);

        return Promise.all(provider.getAllPossibleProviders().map((provider) => {
            return searchSeenEpisodes(provider.rootUrl, provider.parseUrl, seenInDays);
        })).then((results) => {
            return _.flatten(results);
        });
    }
};

function getSeenInDaysRange(rangeCut) {
    const hasSeenInDays = browser.getFromStorage(HAS_SEEN_IN_DAYS_STORAGE_KEY);
    const newHasSeenInDaysRange = hasSeenInDays.range + moment().diff(hasSeenInDays.date, 'days') - rangeCut;

    saveSeenInDaysRange(newHasSeenInDaysRange);

    return newHasSeenInDaysRange;
}

function searchSeenEpisodes(query, parse, seenInDays) {
    return new Promise((resolve) => {
        browser.searchFromHistory(query, seenInDays, (results) => {
            let seenEpisodes = [];
            results.map((result) => seenEpisodes.push(parse(result.url)));

            resolve(seenEpisodes);
        });
    });
}

function saveSeenInDaysRange(range) {
    browser.setToStorage({
        key: HAS_SEEN_IN_DAYS_STORAGE_KEY,
        value: {
            date: Date.now(),
            range: range
        }
    });
}
