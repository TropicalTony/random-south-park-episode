function initSeasons(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://en.wikipedia.org/wiki/List_of_South_Park_episodes", true);
	xhr.responseType = "document";
	xhr.onreadystatechange = function() 
	{
	  if (xhr.readyState == 4){	
		var xmlDoc = xhr.responseXML;
		if(xmlDoc){
			var data = xmlDoc.getElementsByClassName("wikitable plainrowheaders");
			data = data[0].getElementsByTagName("tbody"); 
			data = data[0].getElementsByTagName("tr"); 
			var totalSeasons = data.length - 2 ;
			//var seasonsCollection = [];
			for(i = 0; i < totalSeasons; i++)
			{
				var seasonRow = data[i+2].getElementsByTagName("td");
				var episodes = seasonRow[1].textContent; 
				var episodeArray = [];
				for(j = 0; j < parseInt(episodes); j++)
				{
					episodeArray[j] = j+1;
				}
				//seasonsCollection[i] = i + 1;
				var spSeason = "SouthParkSeason" + (i+1).toString();
				localStorage.setItem(spSeason,JSON.stringify(episodeArray));
			}

			
			var seasonsInit = true;
			//localStorage.setItem("seasonsCollection",JSON.stringify(seasonsCollection));	
			localStorage.setItem("hasSeasons",JSON.stringify(seasonsInit));	
			localStorage.setItem("totalSeasons",JSON.stringify(totalSeasons));
			//var result = JSON.parse(localStorage.getItem('seasonsCollection'));
			//alert(result);
			
		}
	  }
	}
	xhr.send();
}

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getRandomEpisode()
{
	//Find all seasons that have unwatched episodes..
	var unwatchedSeasons = [];
	for (i = 0; i < JSON.parse(localStorage.getItem('totalSeasons')); i++){
		var unwatchedEpisodes =  JSON.parse(localStorage.getItem('SouthParkSeason' + (i+1).toString()));
		if(unwatchedEpisodes.length != 0){
			var index = unwatchedSeasons.length;
			unwatchedSeasons[index] = i+1;
		}

	}
	var seasonIndex = randomInt(1,unwatchedSeasons.length);
	unwatchedEpisodes = JSON.parse(localStorage.getItem('SouthParkSeason' + (unwatchedSeasons[seasonIndex].toString())));
	var episodeIndex = randomInt(1,unwatchedEpisodes.length);
	return {season: unwatchedSeasons[seasonIndex], episode : unwatchedEpisodes[episodeIndex]};
}


if(JSON.parse(localStorage.getItem('hasSeasons')) == true)
{
	//localStorage.setItem("SouthParkSeason6",JSON.stringify([]));	
	var randomEpisode = getRandomEpisode();
	var result = JSON.parse(localStorage.getItem('SouthParkSeason' + randomEpisode.season));
	alert("Season: " + randomEpisode.season + "Episode: " + randomEpisode.episode + "      " + result.length );
	
}
else
{
	initSeasons();
}