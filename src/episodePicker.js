import episodeFilter from 'episodeFilter';
import episodeProvider from 'episodeProvider';

export default {
    pick: (callback) => {
        episodeFilter.getUnseenEpisodes((unseenEpisodes) => {
            const chosenOne = pickRandomly(unseenEpisodes);

            callback({
                url: episodeProvider.getUrl(chosenOne.season, chosenOne.episode),
                season: chosenOne.season,
                episode: chosenOne.episode
            });
        });
    }
};

function pickRandomly(episodes) {
    return episodes[Math.floor(Math.random() * episodes.length)];
}
