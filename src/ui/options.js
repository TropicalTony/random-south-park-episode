(function () {

    document.getElementById('seasonList').onchange = function () {
        document.getElementById('episodeList').innerHTML = '';
        buildEpisodeList(document.getElementById('seasonList').value);
    };

    document.getElementById('historyLimit').addEventListener('blur', save);

    function init() {
        buildSeasonList();
        document.getElementById('historyLimit').value = get('historyLimit') || 30;
    }

    function buildSeasonList(season) {
        var div = document.getElementById('seasonList');

        for (i = 0; i < get('totalSeasons'); i++) {
            var optionValue = document.createElement('option');
            optionValue.text = 'Season ' + (i + 1).toString();
            optionValue.value = (i + 1).toString();
            div.appendChild(optionValue);
        }
        buildEpisodeList(1);
    }

    function buildEpisodeList(season) {
        var div = document.getElementById('episodeList');

        var currentSeason = get('unwatchedEpisodes')[season - 1];
        var episodeNames = get('episodeNames')[season - 1];

        for (i = 0; i < get('seasonLengths')[season - 1]; i++) {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = 'Episode' + (i + 1).toString();
            checkbox.onclick = function () {
                save()
            };
            checkbox.id = i + 1;

            if (currentSeason.indexOf(i + 1) === -1) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
            div.appendChild(checkbox);

            var label = document.createElement('label');
            label.htmlFor = i + 1;
            label.appendChild(document.createTextNode(i + 1 + '. ' + episodeNames[i].replace(/['"]+/g, '')));

            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }
    }

    function save() {
        var selectedSeason = document.getElementById('seasonList').value;
        var newEpisodes = [];

        for (i = 0; i < get('seasonLengths')[selectedSeason - 1]; i++)
            if (!document.getElementById((i + 1).toString()).checked)
                newEpisodes.push(i + 1);

        var unwatchedEpisodes = get('unwatchedEpisodes');
        unwatchedEpisodes[selectedSeason - 1] = newEpisodes;

        set('historyLimit', document.getElementById('historyLimit').value || 30);
        set('unwatchedEpisodes', unwatchedEpisodes);
    }

    document.getElementById('updateHistory').onclick = function(){
        var daysToCheck = document.getElementById('historyBox').value;
        setWatchedEpisodesFromHistory();
    };

    function set(key, data) {
        localStorage.setItem('randomSpEpisodeExt.' + key, JSON.stringify(data));
    }

    function get(key) {
        return JSON.parse(localStorage.getItem('randomSpEpisodeExt.' + key));
    }
<<<<<<< HEAD
    function setWatchedEpisodesFromHistory() {
    // TODO date limit @tonis
    var historyLimit = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

    new History(historyLimit).search(function (seen) {
        for (var i = 0; i < seen.length; i ++)
            markAsWatched(seen[i].season, seen[i].episode);
    });
}
=======

    init();
>>>>>>> e60b4814fbd325dd2819f08d26cc001ea721de4f
})();
