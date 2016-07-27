/* globals angular, Res, MODULE_NAME, Routes */
angular.module(MODULE_NAME).config(['$routeProvider', 'Routes', 'DomainsDir', 'StylesDir',
    function config ($routeProvider, Routes, DomainsDir, StylesDir) {
      $routeProvider
          .when('/', {
              templateUrl: DomainsDir + 'home/home_template.html',
              controller: 'HomeController',
              controllerAs: 'homeController',
              resolve: {
                  factory: function (Auth, Res, DomainsDir, StylesDir, Routes, $rootScope) {
                      controllersAndServices('home', Auth, Res, DomainsDir, StylesDir, Routes, $rootScope)
                  }
              }
          })
          .when('/login', {
              templateUrl: DomainsDir + 'user/login_template.html',
              controller: 'UserController',
              controllerAs: 'userController',
              resolve: {
                  factory: function (Auth, Res, DomainsDir, StylesDir, Routes, $rootScope) {
                      controllersAndServices('user', Auth, Res, DomainsDir, StylesDir, Routes, $rootScope)
                  }
              }
          })
          .when('/register', {
              templateUrl: DomainsDir + 'user/register_template.html',
              controller: 'UserController',
              controllerAs: 'userController',
              resolve: {
                  factory: function (Auth, Res, DomainsDir, StylesDir, Routes, $rootScope) {
                      controllersAndServices('user', Auth, Res, DomainsDir, StylesDir, Routes, $rootScope)
                  }
              }
          })
          .when('/user/:id', {
              templateUrl: DomainsDir + 'user/user_template.html',
              controller: 'UserController',
              controllerAs: 'userController',
              resolve: {
                  factory: function ($q, $rootScope, $location, $http, Auth, Res, DomainsDir, StylesDir) {
                      controllersAndServices('user', Auth, Res, DomainsDir, StylesDir, Routes, $rootScope)
                      let checkAdmin = false
                      checkRouting($q, $rootScope, $location, Auth, checkAdmin)
                  }
              }
          })
          .when('/map', {
              templateUrl: DomainsDir + 'map/map_template.html',
              controller: 'MapController',
              controllerAs: 'mapController'
          })
          .otherwise('/')
    }
  ])

const controllersAndServices = function (route_name, Auth, Res, DomainsDir, StylesDir, Routes, $rootScope) {
    $rootScope.isLoggedIn = Auth.isLoggedIn()
    $rootScope.isAdmin = Auth.isAdmin()

    Res.clean_scripts()
    Res.clean_styles()

    if (route_name in Routes) {
        if ('scripts' in Routes[route_name]) {
          Res.script(Routes[route_name].scripts.map((x)=> `${DomainsDir}${x}`))
        }
        if ('styles' in Routes[route_name]) {
            Res.style(Routes[route_name].styles.map((x)=> `${StylesDir}${x}`))
        }
    }
}

const checkRouting = function ($q, $rootScope, $location, Auth, checkAdmin=false) {
    let pass = true;
    if (!Auth.isLoggedIn() || (checkAdmin && !Auth.isAdmin())) {
        pass = false
    }
    if(!pass) {
        console.log(`${$location.path()} - route denied. User not logged in or authorized.`)
        event.preventDefault()
        $location.path('/login')
    }
}
