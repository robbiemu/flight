/**
 *
 */

angular.module(MODULE_NAME).service('HomeService', [ '$http', 'SPRING_FLIGHTS_URI', 'SPRING_FINDROUTE_URI',
	function($http, SPRING_FLIGHTS_URI, SPRING_FINDROUTE_URI) {

		return {
			get_flights: function ($scope) {
				$http.get(SPRING_FLIGHTS_URI).then((tx_response) => {
					if (tx_response.status != 200) {
						console.log('tx_response.status != 200 , instead it is ' + tx_response.status)
						// TODO - notify user that there was a transactional error
					} else {
						$scope.flights = tx_response.data
						$scope.cities = []
						for(let f in $scope.flights) {
							if ($scope.cities.indexOf($scope.flights[f].origin) == -1){
								$scope.cities.push($scope.flights[f].origin)
							}
							if ($scope.cities.indexOf($scope.flights[f].destination) == -1){
								$scope.cities.push($scope.flights[f].destination)
							}
						}
					}
				})
			},
			find_route: function ($scope, route_request) {
				$http.post(SPRING_FINDROUTE_URI, {"type": "ProcessFlights", "settings": route_request}).then((tx_response) => {
					if (tx_response.status != 200) {
						rej(tx_response.status)
						console.log('tx_response.status != 200 , instead it is ' + tx_response.status)
						// TODO - notify user that there was a transactional error
					} else {
						$scope.shortest_route = tx_response.data
						if($scope.shortest_route.length > 0) {
							$('#shortest_route_container').show();
							$('#no_such_route').hide();
						} else {
							$('#shortest_route_container').hide();
							$('#no_such_route').show();
						}

					}
				})
			}
		}

	}
])
