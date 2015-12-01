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
			for(i = 0; i < totalSeasons; i++)
			{
				var seasonRow = data[i+2].getElementsByTagName("td");
				var episodes = seasonRow[1].textContent; 
				var episodeArray = [];
				for(j = 0; j < parseInt(episodes); j++)
				{
					episodeArray[j] = j+1;
				}
				var spSeason = "SouthParkSeason" + (i+1).toString();
				localStorage.setItem(spSeason,JSON.stringify(episodeArray));
			}

			
			var seasonsInit = true;
			localStorage.setItem("hasSeasons",JSON.stringify(seasonsInit));	
			localStorage.setItem("totalSeasons",JSON.stringify(totalSeasons));
			
		}
	  }
	}
	xhr.send();
}
