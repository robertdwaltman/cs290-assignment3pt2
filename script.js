window.onload = function(){
	populateFavorites();
}

function getNumberOfPages(){
	return document.getElementById("pageNumSelect").value;	
}

function getLanguages(){
	var numBoxes=document.getElementsByName("language");
	var i;
	var returnArray = [];
	for(i=0; i<numBoxes.length; i++){
		if(numBoxes[i].type=='checkbox' && numBoxes[i].checked==true){
			returnArray.push(numBoxes[i].value);
		}
	}
	return returnArray;
}

function generateOutput(pageNum){
	var req = new XMLHttpRequest();
	var selectedLanguages = getLanguages();
	var reqString;
	var outputArray = [];
	
	reqString = "https://api.github.com/gists?page=" + pageNum;
	req.open('GET', reqString);
	req.send();
	req.onreadystatechange=parseOutput;

	function parseOutput(){
		if(req.readyState === 4){
			if(req.status === 200){
		
				var parsedReturn = JSON.parse(req.responseText);

				var i;
				var tempStorage;
				for(i = 0; i < parsedReturn.length; i++){
					tempStorage = parsedReturn[i];
					for(var parentFieldName in tempStorage.files){
						var fileObject = tempStorage.files[parentFieldName];
						for(var childFieldName in fileObject){
							if(childFieldName == "language"){
								if(selectedLanguages.length > 0){
									if(selectedLanguages.indexOf(fileObject[childFieldName]) > -1){
										outputArray.push({
											description: tempStorage.description,
											language: fileObject[childFieldName],
											id: tempStorage.id,
											webAddress: tempStorage.html_url
										});
									}
								}
								else{
									outputArray.push({
										description: tempStorage.description,
										language: fileObject[childFieldName],
										id: tempStorage.id,
										webAddress: tempStorage.html_url
									});
								}
							}
						}
					}
				}
				formatOutput(outputArray);
			}
		}
		
	}
}

var finalDisplay = [];
var savedFavorites = [];

function mainDisplay(){
	document.getElementById("gistDisplay").innerHTML = "";
	var pageNum = getNumberOfPages();
	var i;
	finalDisplay = [];
	populateFavorites();
	for(i=1; i<=pageNum; i++){
		generateOutput(i);
	}
}

function formatOutput(outputArray){
	var i;
	var k;
	var listMatch;
	for(i=1; i<outputArray.length; i++){
		listMatch = false;
		if(savedFavorites != null){
			for(k=0; k<savedFavorites.length; k++)
			{
				if (savedFavorites[k].id == outputArray[i].id){
					listMatch = true;
				}

			}
		}

		if(listMatch == false){
			/*
			document.getElementById("gistDisplay").innerHTML += "<p>" + "Description: " + outputArray[i].description;
			document.getElementById("gistDisplay").innerHTML += "<p>" + "Language: " + outputArray[i].language;
			document.getElementById("gistDisplay").innerHTML += "<p>" + "ID #: " + outputArray[i].id;
			document.getElementById("gistDisplay").innerHTML += "<p>" + "webAddress: " + outputArray[i].webAddress;
			document.getElementById("gistDisplay").innerHTML += "<input type='button' name='" + outputArray[i].id + "' onclick='addFave()"
			*/

			var resultTable = document.createElement("table");
			var descriptionRow = document.createElement("tr");
			var descriptionData = document.createElement("td");
			var descriptionText = document.createElement("a");
			descriptionText.href = outputArray[i].webAddress;
			descriptionText.innerHTML = outputArray[i].description;
			descriptionData.appendChild(descriptionText);
			descriptionRow.appendChild(descriptionData);
			resultTable.appendChild(descriptionRow);

			var languageRow = document.createElement("tr");
			var languageData = document.createElement("td");
			var languageText = document.createTextNode("Language: " + outputArray[i].language);
			languageData.appendChild(languageText);
			languageRow.appendChild(languageData);
			resultTable.appendChild(languageRow);

			var IDRow = document.createElement("tr");
			var IDData = document.createElement("td");
			var IDText = document.createTextNode("ID: " + outputArray[i].id);
			IDData.appendChild(IDText);
			IDRow.appendChild(IDData);
			resultTable.appendChild(IDRow);

			var favoriteRow = document.createElement("tr");
			var favoriteData = document.createElement("td");
			favoriteData.innerHTML = "<input type='button' name='" + outputArray[i].id + "' value='Add to Favorites' onclick='addFave(this.name)'>";
			
			favoriteRow.appendChild(favoriteData);
			resultTable.appendChild(favoriteRow);

			document.getElementById("gistDisplay").innerHTML += "<p>";
			document.getElementById("gistDisplay").appendChild(resultTable);



			finalDisplay.push({
				description: outputArray[i].description,
				language: outputArray[i].language,
				id: outputArray[i].id,
				webAddress: outputArray[i].webAddress
			});
		}



	}
	
}

function addFave(buttonID){
	var i;
	for(i=0; i<finalDisplay.length; i++){
		if(buttonID == finalDisplay[i].id){
			savedFavorites.push({
				description: finalDisplay[i].description,
				language: finalDisplay[i].language,
				id: finalDisplay[i].id,
				webAddress: finalDisplay[i].webAddress
			});
		}
	}
	localStorage.setItem("favorites", JSON.stringify(savedFavorites));
	mainDisplay();
}

function removeFave(buttonID){
	var i;
	var tempStorage = [];
	for(i=0; i<savedFavorites.length; i++){
		if(buttonID != savedFavorites[i].id){
			tempStorage.push(savedFavorites[i]);
		}
	}
	localStorage.setItem("favorites", JSON.stringify(tempStorage));
	tempStorage = localStorage.getItem("favorites");
	savedFavorites = JSON.parse(tempStorage);
	populateFavorites()
}

function populateFavorites(){
	var favoriteStorageChunk = localStorage.getItem("favorites");
	if(favoriteStorageChunk != null){
		savedFavorites = JSON.parse(favoriteStorageChunk);
	}
	document.getElementById("favorites").innerHTML = "";
	if(savedFavorites != null){
		var i;
		for(i=0; i<savedFavorites.length; i++){
			var resultTable = document.createElement("table");
			var descriptionRow = document.createElement("tr");
			var descriptionData = document.createElement("td");
			var descriptionText = document.createElement("a");
			descriptionText.href = savedFavorites[i].webAddress;
			descriptionText.innerHTML = savedFavorites[i].description;
			descriptionData.appendChild(descriptionText);
			descriptionRow.appendChild(descriptionData);
			resultTable.appendChild(descriptionRow);

			var languageRow = document.createElement("tr");
			var languageData = document.createElement("td");
			var languageText = document.createTextNode("Language: " + savedFavorites[i].language);
			languageData.appendChild(languageText);
			languageRow.appendChild(languageData);
			resultTable.appendChild(languageRow);

			var IDRow = document.createElement("tr");
			var IDData = document.createElement("td");
			var IDText = document.createTextNode("ID: " + savedFavorites[i].id);
			IDData.appendChild(IDText);
			IDRow.appendChild(IDData);
			resultTable.appendChild(IDRow);

			var favoriteRow = document.createElement("tr");
			var favoriteData = document.createElement("td");
			favoriteData.innerHTML = "<input type='button' name='" + savedFavorites[i].id + "' value='Remove from Favorites' onclick='removeFave(this.name)'>";
			favoriteRow.appendChild(favoriteData);
			resultTable.appendChild(favoriteRow);

			document.getElementById("favorites").innerHTML += "<p>";
			document.getElementById("favorites").appendChild(resultTable);

		}
	}
}

/*
function selectDisplay(){
	var pageNum = getNumberOfPages();
	var languages = getLanguages();
	document.getElementById("gistDisplay").innerHTML += 'You selected ' + pageNum;
	var i
	for (i=0; i<languages.length; i++){
		document.getElementById("gistDisplay").innerHTML += ' ' + languages[i];
	}
}
*/