/**
 *
 */

angular.module(MODULE_NAME).controller('MapController', ['MapService', function(MapService) {

	var ctrl = this;

	//Map object
	var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 27.6648, lng: -81.5158}
      });


	//Sample data
	var jacksonville = new google.maps.Marker({
	        map: map,
	        position: {lat: 30.3322, lng: -81.6557}
	      });

	var miami = new google.maps.Marker({
        map: map,
        position: {lat: 25.7617, lng: -80.1918}
      });

	var tallahassee = new google.maps.Marker({
		map: map,
		position: {lat: 30.4383, lng: -84.2807}
	})


	//Add a line to the map
    ctrl.addPoly = function addPoly(pointA, pointB, color) {

    	geodesicPoly = new google.maps.Polyline({
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 3,
            geodesic: true,
            map: map
          });

    	geodesicPoly.setPath([pointA.getPosition(), pointB.getPosition()]);
    }


	//Add lines manually
    ctrl.addPoly(jacksonville, miami, '#CC0099');

    ctrl.addPoly(miami, tallahassee, '#AA1100');


    //Add lines from web service
	MapService.getMarkerByCityName(map, "Orlando").then(function(marker) {
		ctrl.addPoly(tallahassee, marker, '#FF3388');
	})

}]);
