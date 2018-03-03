window.onbeforeunload = function(e) {
	var content = document.getElementById('textpad').innerText;
	localStorage.setItem("body", content);	
    return null;
};

window.onload = function(e) {
	if(!localStorage.getItem("body"))
		document.getElementById('textpad').innerHTML = '';
	else		
		document.getElementById('textpad').innerHTML = localStorage.body;
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

function toggleSwitch(element) {
   if(!element.checked) {
   		document.body.style.backgroundColor = "dimgrey";
   		document.body.style.color = "white";
   } else {
   		document.body.style.backgroundColor = "white";
   		document.body.style.color = "black";
   }
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
function uploadFile(event) {
	var input = event.target;
	var reader = new FileReader();

	reader.onload = function(){
    
	    var arrayBuffer = reader.result;
	    var arrayBufferView = new Uint8Array( arrayBuffer );
	    var blob = new Blob( [ arrayBufferView ], { type: input.files[0].type } );
	    var urlCreator = window.URL || window.webkitURL;
	    var textUrl = urlCreator.createObjectURL( blob ); 

		var xhr = new window.XMLHttpRequest();
	 
		xhr.onload = function() {
		  if (xhr.status === 200) {
		    var fileInfo = JSON.parse(xhr.response);
		    // Upload succeeded. Do something here with the file info.
		  }
		  else {
		    var errorMessage = xhr.response || 'Unable to upload file';
		    // Upload failed. Do something here with the error.
		  }
		};
		 
		xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
		xhr.setRequestHeader('Authorization', 'Bearer ' + 'rTSZkDz4dVAAAAAAAAAADBjK_Yde2lhQ3wR_W8-gARa3VFxGxXlnKK7i3Sgsa2bV');
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
		  path: '/' +  file.name,
		  mode: 'add',
		  autorename: true,
		  mute: false
		}));
		 
		xhr.send(file);	
	}
}