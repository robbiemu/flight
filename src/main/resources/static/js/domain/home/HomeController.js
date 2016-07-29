/* globals angular, MODULE_NAME */

/**
 *
**/

angular.module(MODULE_NAME).controller('HomeController', [ '$scope', '$location', 'Auth', 'Map', 'HomeService',
    function ($scope, $location, Auth, Map, HomeService) {
    	console.log('HomeController')

        $scope.book_itinerary = function () { HomeService.book_route($scope, $location, $scope.shortest_route) }
        $scope.changed_flight = function () {
            //$scope.fresh_data = true
        }

        $scope.navTo = function(url) {
            if ($location.path() === url) {
                $route.reload()
            } else {
                $location.path(url)
            }
        }

        $scope.fresh_data = false

        $scope.find_route = {
            origin: undefined,
            destination: undefined
        }

        $('#shortest_route_container').hide();
        $('#no_such_route, .booking_status, #map').hide();

        let flights_interval = setInterval(function() {
    	    HomeService.get_flights($scope)

            if($scope.find_route === undefined) {
                $scope.find_route = {
                    origin: undefined,
                    destination: undefined
                }
            }
            if(($scope.find_route.origin !== undefined) && ($scope.find_route.destination !== undefined)) {
                if($scope.find_route.origin === $scope.find_route.destination) {
                    $scope.find_route = {
                        origin: undefined,
                        destination: undefined
                    }
                    $scope.shortest_route = undefined
                } else {
                    HomeService.find_route($scope, $scope.find_route)
                }
            }

            if($scope.shortest_route === undefined) {
                $('#shortest_route_container').hide();
                $('#no_such_route, .booking_status').hide();
            } else if($scope.shortest_route.length > 0 && $scope.fresh_data) {
                $scope.fresh_data = false
                $('#map').show()
                Map.render_map()
                $scope.shortest_route.forEach((f, i) => {
                    Map.getPoint(f.origin).then((pointA) => {
                        Map.getPoint(f.destination).then((pointB) => {
                            Map.addPoly(pointA, pointB, Map.getColor(i))
                        })
                    })
                })
            }
    	}, 1500)

        $scope.$on("$destroy", function(){
            clearInterval(flights_interval);
        });

        $scope.$on('$viewContentLoaded', function() {
            $('#shortest_route_container, #map, #no_such_route').hide()
            $('#flights_map').css({"right": 0, "top": "4em"})
            Map.reAttach('flights_map')
            Map.reAttach('map')

            if(Auth.isLoggedIn()) {
                console.log('home is ready, user is logged in') // there seems to be a transient error, or else it is the css I am doing, where booking doesnt reload without emptying cache
                $('#user_booking').show()
            } else {
                console.log('home is ready, user is not logged in')
                $('#user_booking').hide()
            }
        })

        // I'm just using this to remind me where these are defined, for use in the template
        this.user_link = {
            href: Auth.isLoggedIn()? 'user/' + Auth.getId(): 'login',
            inner: Auth.isLoggedIn()? 'account': 'login'
        }

    }
])
