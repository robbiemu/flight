/* globals angular, MODULE_NAME */

/**
 *
**/

angular.module(MODULE_NAME).controller('HomeController', [ '$scope', '$location', 'Auth', 'HomeService',
    function ($scope, $location, Auth, HomeService) {
    	console.log('HomeController')

        $scope.navTo = function(url) {
            if ($location.path() === url) {
                $route.reload()
            } else {
                $location.path(url)
            }
        }

        $scope.find_route = {
            origin: undefined,
            destination: undefined
        }
    	
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
                } else {
                    HomeService.find_route($scope, $scope.find_route)
                }
            }

            if($scope.shortest_route === undefined) {
                $('#shortest_route_container').hide();
                $('#no_such_route').hide();
            }
    	}, 1500)

        $scope.$on("$destroy", function(){
            clearInterval(flights_interval);
        });

        $scope.$on('$viewContentLoaded', function() {
            $('#shortest_route_container').hide();
            $('#no_such_route').hide();

            if (/^\/$/.test($location.path())) {
                if(Auth.isLoggedIn()) {
                    $('#user_booking').show()
                } else {
                    $('#user_booking').hide()
                }
            }
        })

        this.user_link = {
            href: Auth.isLoggedIn()? 'user/' + Auth.getId(): 'login',
            inner: Auth.isLoggedIn()? 'account': 'login'
        }

    }
])
