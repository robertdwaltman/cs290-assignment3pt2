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

function createURL(){
	var reqString = 'https://api.github.com/gists';
	reqString += "?page=" + getNumberOfPages();
	console.log(reqString);
	return reqString;

}



function generateOutput(){
	var reqString = createURL();
	var req = new XMLHttpRequest();
	var selectedLanguages = getLanguages();
	req.open('GET', reqString);
	req.send();
	req.onreadystatechange=parseOutput;

	function parseOutput(){
		if(req.readyState === 4){
			if(req.status === 200){
				console.log(req.responseText);
				var parsedReturn = JSON.parse(req.responseText);
				
				var outputArray = [];
				var i;
				var tempStorage;
				for(i = 0; i < parsedReturn.length; i++){
					tempStorage = parsedReturn[i];
					for(var parentFieldName in tempStorage.files){
						var fileObject = tempStorage.files[parentFieldName];
						for(var childFieldName in fileObject){
							if(childFieldName == "language"){
								if(selectedLanguages.indexOf(fileObject[childFieldName]) > -1){
									outputArray.push(tempStorage.description);
									outputArray.push(fileObject[childFieldName]);
								}
							}
						}
					}
				}
				console.log(outputArray);
			}
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