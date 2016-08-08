import _ from 'lodash';
import database from 'database';
import historian from 'historian';
import provider from 'provider';

export default {
    pick: (callback) => {
        getUnseenEpisodes((unseenEpisodes) => {
            const chosenOne = pickRandomly(unseenEpisodes);

            callback({
                url: provider.getUrl(chosenOne.season, chosenOne.episode),
                season: chosenOne.season,
                episode: chosenOne.episode
            });
        });
    }
};

function getUnseenEpisodes(callback, seenInDaysRangeCut = 0) {
    historian.getSeenEpisodes(seenInDaysRangeCut).then((seenEpisodes) => {
        const unseenEpisodes = filterOutSeenEpisodes(seenEpisodes, database.getEpisodes());

        if (_.isEmpty(unseenEpisodes))
            getUnseenEpisodes(callback, seenInDaysRangeCut + 30);
        else
            callback(unseenEpisodes);
    });
}

function filterOutSeenEpisodes(seenEpisodes, allEpisodes) {
    let unseenEpisodes = [];

    allEpisodes.map((episode) => {
        if (!containsEpisode(seenEpisodes, episode))
            unseenEpisodes.push(episode);
    });
    return unseenEpisodes;
}

function containsEpisode(list, obj) {
    for (let i = 0; i < list.length; i ++)
        if (list[i].season == obj.season && list[i].episode == obj.episode)
            return true;
    return false;
}

function pickRandomly(episodes) {
    return episodes[Math.floor(Math.random() * episodes.length)];
}
