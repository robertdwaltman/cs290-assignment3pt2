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
	var req = new XMLHttpRequest();
	var reqString = 'https://api.github.com/gists/public';
	reqString += "?page=" + getNumberOfPages();
	console.log(reqString);
	req.open('GET', reqString);
	req.send();
}

function generateOutput(){
	createURL();
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