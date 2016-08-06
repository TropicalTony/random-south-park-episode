import database from 'database';

export default {
    pick: () => {
        const seasons = database.getSeasons();
        const season = pickSeason(seasons);
        const episode = pickEpisode(seasons, season);

        return {
            url: buildSouthparkCCUrl(season, episode),
            provider: 'southpark.cc.com',
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

function buildSouthparkCCUrl(season, episode) {
    return `http://southpark.cc.com/full-episodes/s${pad(season)}e${pad(episode)}`;
}

function pad(num) {
    if (num < 10)
        return '0' + num;
    return num;
}
