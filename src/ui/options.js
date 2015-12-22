(function () {

    document.getElementById('seasonList').onchange = function () {
        document.getElementById('episodeList').innerHTML = '';
        buildEpisodeList(document.getElementById('seasonList').value);
    };

    document.getElementById('resetAll').onclick = function(){
        var resetedList = calculateEpisodeList(get('totalSeasons'), get('seasonLengths'));
        set('unwatchedEpisodes', resetedList);
        buildEpisodeList(document.getElementById('seasonList').value);
    }

    function init() {
        buildCheckAllButton();
        buildSeasonList();
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

    function buildCheckAllButton() {
        var checkAll = document.getElementById('checkAll');
        var checkAllInput = document.createElement('input');
        checkAllInput.type = 'checkbox';
        checkAllInput.id = 'checkAllBox'
        checkAll.appendChild(checkAllInput);
        checkAllInput.onclick = function(){
            var seasonToCheck = document.getElementById('seasonList').value;
            var checkedSeason = get('unwatchedEpisodes');
            if (checkAllInput.checked === true) {
                checkedSeason[seasonToCheck-1] = [];
                set('unwatchedEpisodes', checkedSeason);

            }
            else {
                buildFullSeason(seasonToCheck);
            }
            document.getElementById('episodeList').innerHTML = '';
            buildEpisodeList(seasonToCheck);  

        }

        var labelCheckAll = document.createElement('label');
        labelCheckAll.appendChild(document.createTextNode('Check/Uncheck all'));
        checkAll.appendChild(labelCheckAll);
    }

    function checkAllButtonStatus(season) {
        if (get('unwatchedEpisodes')[season - 1].length === 0) {
            document.getElementById('checkAllBox').checked = true;
        }
        else {
            document.getElementById('checkAllBox').checked = false;
        }
    }

    function buildEpisodeList(season) {
        checkAllButtonStatus(season);
        document.getElementById('episodeList').innerHTML = '';
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

        set('unwatchedEpisodes', unwatchedEpisodes);
        checkAllButtonStatus(selectedSeason);
    }

    function buildFullSeason(season){
        var fullSeason = [];
        for(i = 0; i < get('seasonLengths')[season - 1]; i++) {
            fullSeason[i] = i+1;
        }
        var unwatchedEpisodes = get('unwatchedEpisodes');
        unwatchedEpisodes[season - 1] = fullSeason;
        set('unwatchedEpisodes', unwatchedEpisodes);
    }

    function set(key, data) {
        localStorage.setItem('randomSpEpisodeExt.' + key, JSON.stringify(data));
    }

    function get(key) {
        return JSON.parse(localStorage.getItem('randomSpEpisodeExt.' + key));
    }

    function calculateEpisodeList(totalSeasons, seasonLengths) {
    var episodes = [];

    for (var t = 0; t < totalSeasons; t++) {
        episodes.push([]);

        for (var s = 0; s < seasonLengths[t]; s ++)
            episodes[t].push(s + 1);
    }
    return episodes;
    }

    init();
})();
