/* globals angular */
//angular.module('flight', ['ngRoute'])

var controllerProvider = null;
angular.module('flight', ['ngRoute'], function($controllerProvider) {
    controllerProvider = $controllerProvider;
});