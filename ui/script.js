function buildSeasonList(season){

	//Display list of all seasons
	var div = document.getElementById("seasonList");
	for (i = 0; i < JSON.parse(localStorage.getItem('totalSeasons')); i++){
		var optionValue = document.createElement("option");
		optionValue.text = "Season " + (i+1).toString();
		optionValue.value = (i+1).toString();
		div.appendChild(optionValue);
	}

	//Display list of episodes
	buildEpisodeList(1);
} 

function buildEpisodeList(season){
	var div = document.getElementById("episodeList");
	var currentSeason = JSON.parse(localStorage.getItem('SouthParkSeason'+ season.toString()) );
	//console.log("Current season: " + season.toString());
	//console.log(currentSeason);
	var episodeNames =  JSON.parse(localStorage.getItem('EpisodeNames' + season.toString()) );
	for (i = 0; i < JSON.parse(localStorage.getItem('seasonLengths'))[season-1]; i++){
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = "Episode" + (i+1).toString();
		checkbox.id = i+1;
		
		if(currentSeason.indexOf(i+1) == -1){
			checkbox.checked = true;
		}
		else{
			checkbox.checked = false;
		}
		div.appendChild(checkbox);

		    var label = document.createElement('label');
            label.htmlFor = "Episode" + (i+1).toString();
            label.appendChild(document.createTextNode( episodeNames[i]));

            div.appendChild(label);
            div.appendChild(document.createElement("br"));   
	}
}



buildSeasonList();

document.getElementById("seasonList").onchange = function(){
	document.getElementById("episodeList").innerHTML = "";
	buildEpisodeList(document.getElementById("seasonList").value);
};

document.getElementById("saveButton").onclick = function(){
	var selectedSeason = document.getElementById("seasonList").value;
	var newEpisodes = []
	for (i = 0; i < JSON.parse(localStorage.getItem('seasonLengths'))[selectedSeason-1]; i++){
		if(!document.getElementById((i+1).toString()).checked){
			newEpisodes.push(i+1);
		}
	}
	localStorage.setItem("SouthParkSeason" + selectedSeason.toString() ,JSON.stringify(newEpisodes));
};