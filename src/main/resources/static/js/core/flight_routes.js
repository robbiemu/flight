/* globals angular, Res, MODULE_NAME, Routes */
angular.module(MODULE_NAME).config(['$routeProvider', 'Routes', 'DomainsDir', 'StylesDir',
    function config ($routeProvider, Routes, DomainsDir, StylesDir) {
      $routeProvider
        .when('/', {
          templateUrl: DomainsDir + 'home/home_template.html',
          controller: 'HomeController',
          controllerAs: 'homeController',
        })

        .when('/map', {
          templateUrl: DomainsDir + 'map/map_template.html',
          controller: 'MapController',
          controllerAs: 'mapController'
        })
        .otherwise('/')
    }
  ])

const controllersAndServices = function (Res, DomainsDir, StylesDir, Routes, route_name) {
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
