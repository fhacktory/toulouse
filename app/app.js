'use strict';

var toulouse = angular.module('toulouse', [
  'ngRoute',
  'pascalprecht.translate',
  'humanSeconds',
  'toulouse.main',
  'toulouse.home',
  'toulouse.editor',
]);

toulouse.config(function($routeProvider){

  // Url Config
  $routeProvider
    .when('/search/:search_term', {
      templateUrl : 'templates/home.html',
      controller : 'HomeCtrl',
    })
    .when('/', {
      templateUrl : 'templates/home.html',
      controller : 'HomeCtrl',
    })
    .when('/movie/:movie_id', {
      templateUrl : 'templates/editor.html',
      controller : 'EditorCtrl',
    })
    .otherwise({
      redirectTo : '/',
    });
});
