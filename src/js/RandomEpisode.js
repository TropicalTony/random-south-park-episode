'use strict';

import {getUnwatchedEpisodes,initSeriesInfoAnd} from './Storage';

export class RandomEpisode {

    generate() {
        var unwatchedEpisodes = getUnwatchedEpisodes();
        var seasonsWithEpisodes = [];
        for(var i = 0; i < unwatchedEpisodes.length - 1; i ++){
            if(unwatchedEpisodes[i].length > 0){
                seasonsWithEpisodes.push(i+1);
            } 
        }
        if(seasonsWithEpisodes.length == 0){
            initSeriesInfoAnd();
        }
        var season = this.randomInt(1, seasonsWithEpisodes.length);
        season = seasonsWithEpisodes[season-1];
        var episode = this.randomInt(1, unwatchedEpisodes[season - 1].length);
        episode = unwatchedEpisodes[season - 1][episode-1];

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
