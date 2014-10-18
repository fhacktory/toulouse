'use strict';

var toulouse = angular.module('toulouse', [
  'ngRoute',
  'toulouse.home',
]);

toulouse.config(function($routeProvider){

  // Url Config
  $routeProvider
    .when('/', {
      templateUrl : 'templates/home.html',
      controller : 'HomeCtrl',
    })
    .otherwise({
      redirectTo : '/',
    });
});
