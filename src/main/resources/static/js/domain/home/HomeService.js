/**
 *
 */

angular.module(MODULE_NAME).service('HomeService', [ '$http', 'Auth', 'Modals', 'Map',
	'SPRING_FLIGHTS_URI', 'SPRING_FINDROUTE_URI', 'SPRING_BOOKITINERARY_URI',
	function($http, Auth, Modals, Map, SPRING_FLIGHTS_URI, SPRING_FINDROUTE_URI, SPRING_BOOKITINERARY_URI) {

		return {
			book_route: function ($scope, $location, route) {
				if(route === undefined || route === null || route.length < 1) {
					// TODO - notify user that the route expired before they could post it
					Modals.notify({title: 'Route Changed', content: 'Sorry, the route expired before we could handle your request.' })
					return
				}
				$http.post(SPRING_BOOKITINERARY_URI, {
						"type": "BookItinerary",
						"settings": { "user": Auth.getUser(), "flights": route }
					})
					.then((tx_response) => {
						if (tx_response.status != 200) {
							Modals.error_alert(e)
						} else {
							$scope.booking_message = tx_response.data.settings.message
							if (tx_response.data.settings.status === 'Success') {
								$('#book').addClass('disabled')
								$('#sucessful_booking').show();
								Map.cleanUp()
								$location.path(`/user/${Auth.getId()}`)
							} else {
								$('#unsucessful_booking').show();
								console.dir(tx_response.data.settings)
								Modals.notify({title: 'Error booking itinerary', content: tx_response.data.settings.message})
							}
						}
					})
			},
			get_flights: function ($scope) {
				$http.get(SPRING_FLIGHTS_URI).then((tx_response) => {
					if (tx_response.status != 200) {
						Modals.error_alert(e)
					} else {
						$scope.flights = tx_response.data
						$scope.cities = []
						$scope.fresh_data = true
						for(let f in $scope.flights) {
							if ($scope.cities.indexOf($scope.flights[f].origin) == -1){
								$scope.cities.push($scope.flights[f].origin)
							}
							if ($scope.cities.indexOf($scope.flights[f].destination) == -1){
								$scope.cities.push($scope.flights[f].destination)
							}
						}
						Map.render_map('flights_map')
						$scope.flights.forEach((f, i) => {
							Map.getPoint(f.origin, 'flights_map').then((pointA) => {
								Map.getPoint(f.destination, 'flights_map').then((pointB) => {
									Map.addPoly(pointA, pointB, Map.getColor(i), 'flights_map')
								})
							})
						})
					}
				})
			},
			find_route: function ($scope, route_request) {
				$http.post(SPRING_FINDROUTE_URI, {"type": "ProcessFlights", "settings": route_request}).then((tx_response) => {
					if (tx_response.status != 200) {
						rej(tx_response.status)
						Modals.error_alert(e)
					} else {
						$scope.shortest_route = tx_response.data
						if($scope.shortest_route.length > 0) {
							if(!$('#shortest_route_container').is(':visible')) {
								$('#shortest_route_container').show()
								$('html, body').animate({
									scrollTop: $("#map").offset().top
								}, 500)
							}
							$('#book').removeClass('disabled')

							$('#no_such_route, .booking_status').hide()
						} else {
							$('#shortest_route_container').hide()
							$('#no_such_route').show()
						}
					}
				})
			}
		}

	}
])
