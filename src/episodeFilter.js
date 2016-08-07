import database from 'database';
import provider from 'provider';

export default {
    getUnseenEpisodes: (callback) => {
        provider.getSeenEpisodes().then((seenEpisodes) => {
            callback(filterOutSeenEpisodes(seenEpisodes, database.getEpisodes()));
        });
    }
};

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
