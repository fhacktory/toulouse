'use strict';

var toulouse = angular.module('toulouse', [
  'ngRoute',
  'pascalprecht.translate',
  'humanSeconds',
  'toulouse.main',
  'toulouse.home',
  'toulouse.actor',
  'toulouse.downloads',
  'toulouse.editor',
]);

toulouse.config(function($routeProvider, $sceProvider ){

  // For dev only, disable inclusion security
  $sceProvider.enabled(false);

  // Url Config
  $routeProvider
    .when('/search/:search_term', {
      templateUrl : 'templates/home.html',
      controller : 'HomeCtrl',
    })
    .when('/downloads', {
      templateUrl : 'templates/downloads.html',
      controller : 'DownloadsCtrl',
    })
    .when('/', {
      templateUrl : 'templates/home.html',
      controller : 'HomeCtrl',
    })
    .when('/movie/:movie_id', {
      templateUrl : 'templates/editor.html',
      controller : 'EditorCtrl',
    })
    .when('/actor/:actor_id', {
      templateUrl : 'templates/actor.html',
      controller : 'ActorCtrl',
    })
    .otherwise({
      redirectTo : '/',
    });
});
