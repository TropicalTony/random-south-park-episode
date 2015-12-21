'use strict';

import {getUnwatchedEpisodes, initSeriesInfo} from './Storage';

export class RandomEpisode {

    generate() {
        var unwatchedEpisodes = getUnwatchedEpisodes();
        var seasonsWithEpisodes = this.getSeasonsWithEpisodes();

        if (seasonsWithEpisodes.length === 0)
            return initSeriesInfo(() => this.generate());

        var seasonId = this.randomInt(1, seasonsWithEpisodes.length)-1;
        var episodeId = this.randomInt(1, unwatchedEpisodes[seasonId].length) - 1;
        var season = seasonsWithEpisodes[seasonId];

        return {
            season: this.format(season),
            episode: this.format(unwatchedEpisodes[season - 1][episodeId])
        };
    }

    getSeasonsWithEpisodes() {
        var unwatchedEpisodes = getUnwatchedEpisodes();
        var seasonsWithEpisodes = [];

        for (var i = 0; i < unwatchedEpisodes.length; i ++)
            if (unwatchedEpisodes[i].length > 0)
                seasonsWithEpisodes.push(i + 1);

        return seasonsWithEpisodes;
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
