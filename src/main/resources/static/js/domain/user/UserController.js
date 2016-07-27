angular.module(MODULE_NAME).controller('UserController',
    [ 'UserService', 'Auth', '$location', '$scope', '$http', '$routeParams',
    function (UserService, Auth, $location, $scope, $http, $routeParams) {
        console.log('UserController at ' + $location.path())

        $scope.navTo = function(url) {
            if ($location.path() === url) {
                $route.reload()
            } else {
                $location.path(url)
            }
        }

        this.user_link = {
            href: Auth.isLoggedIn()? 'user/' + Auth.getId(): 'login',
            inner: Auth.isLoggedIn()? 'account': 'login'
        }

        this.login = function () { UserService.login($scope) }
        this.register = function () { UserService.register($scope) }

        switch ($location.path) {
            case '/login':
                // could be userful...
                break
            case '/register':
                // ... some day
                break
            case '/user':
                this.itineraries = UserService.get_user_itineraries($routeParams.id)
        }

    }
])