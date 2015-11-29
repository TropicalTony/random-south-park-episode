'use strict';

export default class History {

    constructor(limit) {
        this.limit = limit;
    }

    search(callback) {
        chrome.history.search({text: 'http://southpark.cc.com/full-episodes/'}, this.collectFrom);
    }

    collectFrom(results) {
        var seen = [];
        var found;

        for (var i = 0; i < results.length; i ++) {
            if (results[i].lastVisitTime < this.limit)
                continue;

            found = results[i].url.match(/s\d+e\d+/);

            if (found)
                seen.push({ season: found[0].match(/\d+/g)[0], episode: found[0].match(/\d+/g)[1] });
        }
        callback(seen);
    }
}
