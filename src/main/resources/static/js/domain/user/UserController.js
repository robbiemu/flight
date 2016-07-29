angular.module(MODULE_NAME).controller('UserController',
    [ 'UserService', 'Auth', 'Map', '$location', '$scope', '$routeParams',
    function (UserService, Auth, Map, $location, $scope, $routeParams) {
        console.log('UserController at ' + $location.path())

        $scope.navTo = function (url) {
            if ($location.path() === url) {
                $route.reload()
            } else {
                $location.path(url)
            }
        }

        // I'm just using this to remind me where these are defined, for use in the template
        this.user_link = {
            href: Auth.isLoggedIn() ? 'user/' + Auth.getId() : 'login',
            inner: Auth.isLoggedIn() ? 'account' : 'login'
        }

        this.login = function () {
            UserService.login($scope)
        }
        this.register = function () {
            UserService.register($scope)
        }

        $scope.selected_itinerary = {index: NaN}
        $scope.layovers = {}

        $scope.renderMap = function () {
            UserService.renderMap($scope)
        }

        $scope.$on('$viewContentLoaded', function () {
            Map.reAttach('itinerary_map')
            $('#itinerary_map').css({"right": 0, "display": "none"})
            if (/^\/user/.test($location.path())) {
                this.itineraries = UserService.get_user_itineraries($scope)
            }
        })

        $scope.$on('$destroy', function () {
            $('#itinerary_map').hide()
        })
    }
])