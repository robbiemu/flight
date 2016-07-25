/* globals angular, Res, MODULE_NAME, Routes */
angular.module(MODULE_NAME).config(['$routeProvider', 'Routes', 'baseRoute',
    function config ($routeProvider, Routes, baseRoute) {
      $routeProvider
        .when('/', {
          templateUrl: baseRoute + 'home/home_template.html',
          controller: 'home_controller',
          resolve: {
            factory: function (Res) { controllersAndServices(Res, Routes, 'home') }
          }
        })

        .when('/map', {
          templateUrl: baseRoute + 'map/map_template.html',
          controller: 'MapController',
          controllerAs: 'mapController'
        })
        .otherwise('/')
    }
  ])

const controllersAndServices = function (Res, Routes, route_name) {
  Res.clean_scripts()
  Res.clean_styles()
  if (route_name in Routes) {
    if ('scripts' in Routes[route_name]) {
      Res.script(Routes[route_name].scripts)
    }
    if ('styles' in Routes[route_name]) {
      Res.script(Routes[route_name].styles)
    }
  }
}
