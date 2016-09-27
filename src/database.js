import axios from 'axios';

const DATABASE_URL = 'https://raw.githubusercontent.com/syyfilis/random-south-park-episode/master/database.json';

// Fallback data when GET request is too slow or failed
let data = {episodes: [
    {season: 1, episode: 1},
    {season: 1, episode: 2},
    {season: 1, episode: 3},
    {season: 5, episode: 4},
    {season: 5, episode: 5},
    {season: 5, episode: 6},
    {season: 10, episode: 7},
    {season: 10, episode: 8},
    {season: 10, episode: 9}
]};

/**
 * Service for communicating with Firebase
 */
export default {
    /**
     * Load initial data from database
     */
    init: () => loadData(),

    /**
     * Reload data from database
     */
    reload: () => loadData(),

    /**
     * Gets all season-epsiodes
     *
     * @return {Object[]} episodes
     *  @return {Number} episodes[].season
     *  @return {Number} episodes[].episode
     */
    getEpisodes: () => {
        return data.episodes;
    },

    /**
     * Get episode notification that needs to be shown
     *
     * @return {Object} episodeNotification
     */
    getEpisodeNotification: () => {
        return data.episodeNotification;
    }
};

function loadData() {
    axios.get(DATABASE_URL).then((response) => {
        data = response.data;
    });
}
