/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;
//reference to our google map
gov.usgs.quakesMap;

window.onload = function() {
	document.querySelector(".message").innerHTML = "Loading... <img src='img/loading.gif'>";
	gov.usgs.quakesMap = new google.maps.Map(document.querySelector(".map-container"), {center: new google.maps.LatLng(0,0), zoom: 2, mapTypeId: google.maps.MapTypeId.TERRAIN, streetViewControl: false});
	$.getJSON(gov.usgs.quakesUrl, function (returnData) {
		gov.usgs.quakes = returnData;
		document.querySelector(".message").innerHTML = "Displaying " + gov.usgs.quakes.length + " earthquakes";		
		mapQuakes(gov.usgs.quakes, gov.usgs.quakesMap);
	});
};

function mapQuakes(data, map){
	var i;
	var I;
	var newMarker;
	for(i=0;i<data.length;i++){
		I = data[i];
		if(I.location.latitude && I.location.longitude){
			//save index location as title so the correct information can be loaded later
			newMarker = new google.maps.Marker({map: map, position: new google.maps.LatLng(I.location.latitude, I.location.longitude), title: i.toString()});
			google.maps.event.addListener(newMarker, 'click', function () {								
					var j = parseInt(this.getTitle());					
					if(gov.usgs.iw){
						gov.usgs.iw.close();
					}
					var newInfo = new google.maps.InfoWindow({content: new Date(gov.usgs.quakes[j].datetime).toLocaleString() + ': magnitude ' + gov.usgs.quakes[j].magnitude + ' at depth of ' + gov.usgs.quakes[j].depth + ' meters'});
					gov.usgs.iw = newInfo;
					gov.usgs.iw.open(gov.usgs.quakesMap, this);				

			});
		}
	}
	
}




//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

