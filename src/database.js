import axios from 'axios';

const DATABASE_URL = 'https://raw.githubusercontent.com/syyfilis/random-south-park-episode/master/database.json';

// Fallback data when GET request is too slow or failed
let data = {episodes: [
    {season: 1, episode: 1, huluId: 249837},
    {season: 1, episode: 2, huluId: 249835},
    {season: 1, episode: 3, huluId: 249836},
    {season: 5, episode: 4, huluId: 250059},
    {season: 5, episode: 5, huluId: 250061},
    {season: 5, episode: 6, huluId: 249800},
    {season: 10, episode: 7, huluId: 250024},
    {season: 10, episode: 8, huluId: 250026},
    {season: 10, episode: 9, huluId: 250028}
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
