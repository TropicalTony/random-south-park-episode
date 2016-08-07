import episodeFilter from 'episodeFilter';
import provider from 'provider';

export default {
    pick: (callback) => {
        episodeFilter.getUnseenEpisodes((unseenEpisodes) => {
            const chosenOne = pickRandomly(unseenEpisodes);

            callback({
                url: provider.getUrl(chosenOne.season, chosenOne.episode),
                season: chosenOne.season,
                episode: chosenOne.episode
            });
        });
    }
};

function pickRandomly(episodes) {
    return episodes[Math.floor(Math.random() * episodes.length)];
}
