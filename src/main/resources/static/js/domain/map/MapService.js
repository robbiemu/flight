/**
 *
 */

angular.module(MODULE_NAME).service('MapService',
		[ '$http', function($http) {

			this.getMarkerByCityName = function(map, name) {

				//Send city name param to URL
				return $http.get('location/name', {params: { name : name }}).then(function(result) {
					return new google.maps.Marker({
						map : map,
						position : {

							//Use + to turn string to number
							lat : +result.data.latitude,
							lng : +result.data.longitude
						}
					});
				})

			}

		} ]);
