'use strict';

export class History {

    constructor(limit) {
        this.limit = limit;
    }

    search(callback) {
        var currentTime = new Date().setDate(new Date().getDate());
        var start  = this.limit;
        chrome.history.search({text: 'http://southpark.cc.com/full-episodes/', maxResults:1000, startTime: start, endTime: currentTime}, (results) => this.collectFrom(results, callback));
    }

    collectFrom(results, callback) {
        var seen = [];
        var found;

        for (var i = 0; i < results.length; i ++) {
            found = results[i].url.match(/s\d+e\d+/);

            if (found)
                seen.push({ season: parseInt(found[0].match(/\d+/g)[0]), episode: parseInt(found[0].match(/\d+/g)[1]) });
        }
        callback(seen);
    }
}
