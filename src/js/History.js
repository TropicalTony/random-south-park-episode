'use strict';

export class History {

    constructor(limit) {
        this.limit = limit;
    }

    search(callback) {
        chrome.history.search({text: 'http://southpark.cc.com/full-episodes/', maxResults:1000, startTime:0, endTime:24*60*60*1000*90}, (results) => this.collectFrom(results, callback));
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
