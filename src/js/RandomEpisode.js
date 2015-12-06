'use strict';

import {getUnwatchedEpisodes} from './Storage';

export class RandomEpisode {

    generate() {
        var unwatchedEpisodes = getUnwatchedEpisodes();

        var season = this.randomInt(1, unwatchedEpisodes.length + 1);
        var episode = this.randomInt(1, unwatchedEpisodes[season - 1].length + 1);

        return {
            season: this.format(season),
            episode: this.format(episode)
        };
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    format(seriesInfo) {
        if (seriesInfo < 10)
            return '0' + seriesInfo.toString();

        return seriesInfo.toString();
    }
}
