var toggle = false;

window.onbeforeunload = function(e) {
	var content = document.getElementById('textpad').innerText;
	localStorage.setItem("body", content);
	return null;
};

window.onload = function(e) {
	//One time alert
	var alerted = localStorage.getItem('alerted') || '';
    if (alerted != 'yes') {
    	alert("Hiya! New Feature added. Now you can upload your file to dropbox. Kindly provide your valuable feedback by clicking google form image");
    	localStorage.setItem('alerted','yes');
    }


	if(!localStorage.getItem("body"))
		document.getElementById('textpad').innerHTML = '';
	else		
		document.getElementById('textpad').innerHTML = localStorage.body;

	if(!localStorage.getItem("toggle")) {
		toggle = document.getElementById("toggle").checked;
		localStorage.setItem("toggle", toggle);
		setColors(toggle);
		return;
	}
	toggle = eval(localStorage.getItem("toggle"));
	setColors(toggle);
	document.getElementById("toggle").checked = toggle;
}


function setColors(toggle) {
	if(toggle == false) {
		document.body.style.backgroundColor = "dimgrey";
   		document.body.style.color = "white";
   	} else {
		document.body.style.backgroundColor = "white";
   		document.body.style.color = "black";
   	}
}

function toggleSwitch(element) {
    localStorage.setItem("toggle", element.checked);
    setColors(element.checked);
}

function saveToFile() {
	var content = document.getElementById('textpad').innerText;
	var type = 'text/plain;charset=utf-8';
	var name = 'Scribble.txt'

   	var a = document.getElementById("a");
  	var file = new Blob([content], {type: type});
  	a.href = URL.createObjectURL(file);
  	a.download = name;
}

//Google drive API
var developerKey = 'AIzaSyDjtBZeYT2uk7-N6ij34KoXz0cPg8_1_rQ';
var clientId = "127518828598-kjujqq0d6m44d2of5dqipnikcnf1q8d0.apps.googleusercontent.com"
var appId = "scribble-195323";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive'];
var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
	gapi.load('auth', {'callback': onAuthApiLoad});
	gapi.load('picker', {'callback': onPickerApiLoad});
}

function onAuthApiLoad() {
	window.gapi.auth.authorize(
	{
		'client_id': clientId,
		'scope': scope,
		'immediate': false
	},handleAuthResult);
}

function onPickerApiLoad() {
	pickerApiLoaded = true;
	createPicker();
}

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		oauthToken = authResult.access_token;
		createPicker();
	}
}

// Create and render a Picker object for searching images.
function createPicker() {
	if (pickerApiLoaded && oauthToken) {
		var view = new google.picker.View(google.picker.ViewId.DOCS);
		view.setMimeTypes('image/png,image/jpeg');

		// Use DocsUploadView to upload documents to Google Drive.
		var uploadView = new google.picker.DocsUploadView();

		var picker = new google.picker.PickerBuilder().
		addView(view).
		addView(uploadView).
		setAppId(appId).
		setOAuthToken(oauthToken).
		setCallback(pickerCallback).
		build();
		picker.setVisible(true);
	}
}

// A simple callback implementation.
function pickerCallback(data) {
	if (data.action == google.picker.Action.PICKED) {
		var fileId = data.docs[0].id;
	}
}

//Copy to clipboard
function copyToClipboard() {
	var content = document.getElementById('textpad').innerText;
	window.prompt("Copy to clipboard: Ctrl+C, Enter", content);
}

//Dropbox API
function getAccessTokenFromUrl() {
	return utils.parseQueryString(window.location.hash).access_token;
}

function isAuthenticated() {
	console.log("getting auth token " + !!getAccessTokenFromUrl());
	return !!getAccessTokenFromUrl();
}

function uploadFile() {
	var dbx = new Dropbox.Dropbox({ accessToken: getAccessTokenFromUrl() });
	var file = document.getElementById("dropboxfile").files[0];
	dbx.filesUpload({path: '/' + file.name, contents: file})
	.then(function(response) {
		console.log("File upload" + response);
		alert("File uploaded");
		window.location.href = "https://dv7nmihel4uc9.cloudfront.net/";
	})
	.catch(function(error) {
		console.error(error);
	});
}

function saveToDropbox() {
	var CLIENT_ID = "tx07oo9ooky99b5";

	if (isAuthenticated()) {
		uploadFile();
	} else {
		var dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
		var authUrl = dbx.getAuthenticationUrl('https://dv7nmihel4uc9.cloudfront.net/');
		window.location.href = authUrl;
		alert("Authenticate and Upload file again");
	}	    
}

