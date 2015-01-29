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
											URL: tempStorage.html_url
										});
									}
								}
								else{
									outputArray.push({
										description: tempStorage.description,
										language: fileObject[childFieldName],
										id: tempStorage.id,
										URL: tempStorage.html_url
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

function mainDisplay(){
	document.getElementById("gistDisplay").innerHTML = "";
	var pageNum = getNumberOfPages();
	var i;
	for(i=1; i<=pageNum; i++){
		generateOutput(i);
	}
}

function formatOutput(outputArray){
	var i;
	for(i=1; i<outputArray.length; i++){
		document.getElementById("gistDisplay").innerHTML += "<p>" + "Description: " + outputArray[i].description;
		document.getElementById("gistDisplay").innerHTML += "<p>" + "Language: " + outputArray[i].language;
		document.getElementById("gistDisplay").innerHTML += "<p>" + "ID #: " + outputArray[i].id;
		document.getElementById("gistDisplay").innerHTML += "<p>" + "URL: " + outputArray[i].URL;
		document.getElementById("gistDisplay").innerHTML += "<br>";


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