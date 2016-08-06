import database from 'database';
import provider from 'provider';

export default {
    pick: () => {
        const seasons = database.getSeasons();
        const season = pickSeason(seasons);
        const episode = pickEpisode(seasons, season);

        return {
            url: provider.getUrl(season, episode),
            season: season,
            episode: episode
        };
    }
};

function pickSeason(seasons) {
    return randomKey(seasons);
}

function pickEpisode(seasons, season) {
    return randomKey(seasons[season].episodes);
}

function randomKey(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
}
