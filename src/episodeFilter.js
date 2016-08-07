import _ from 'lodash';
import Promise from 'bluebird';
import database from 'database';
import browser from 'browser';
import episodeProvider from 'episodeProvider';

export default {getUnseenEpisodes};

function getUnseenEpisodes(callback, unseenInDays = 90) {
    getSeenEpisodes(unseenInDays).then((seenEpisodes) => {
        const unseenEpisodes = filterOutSeenEpisodes(seenEpisodes, database.getEpisodes());

        if (_.isEmpty(unseenEpisodes) && unseenInDays > 0)
            getUnseenEpisodes(callback, unseenInDays - 30);
        else
            callback(unseenEpisodes);
    });
}

function getSeenEpisodes(seenInDays) {
    return Promise.all(episodeProvider.getProviders().map((provider) => {
        return registerSeenEpisodes(provider.rootUrl, provider.parse, seenInDays);
    })).then((results) => {
        return _.flatten(results);
    });
}

function registerSeenEpisodes(query, parse, seenInDays) {
    return new Promise((resolve) => {
        browser.searchFromHistory(query, seenInDays, (results) => {
            let seenEpisodes = [];
            results.map((result) => seenEpisodes.push(parse(result.url)));

            resolve(seenEpisodes);
        });
    });
}

function filterOutSeenEpisodes(seenEpisodes, allEpisodes) {
    let unseenEpisodes = [];

    allEpisodes.map((seasonAndEpisode) => {
        if (!containsObject(seenEpisodes, seasonAndEpisode))
            unseenEpisodes.push(seasonAndEpisode);
    });
    return unseenEpisodes;
}

function containsObject(list, obj) {
    for (let i = 0; i < list.length; i ++)
        if (list[i].season == obj.season && list[i].episode == obj.episode)
            return true;
    return false;
}
