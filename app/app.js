'use strict';

var toulouse = angular.module('toulouse', [
  'ngRoute',
  'LocalStorageModule',
  'pascalprecht.translate',
  'humanSeconds',
  'toulouse.main',
  'toulouse.home',
  'toulouse.actor',
  'toulouse.store',
  'toulouse.downloads',
  'toulouse.editor',
]);

toulouse.config(function($routeProvider, $sceProvider, localStorageServiceProvider){

  // For dev only, disable inclusion security
  $sceProvider.enabled(false);

  // Setup local storage
  localStorageServiceProvider.setPrefix('chaton');

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
    .when('/store', {
      templateUrl : 'templates/store.html',
      controller : 'StoreCtrl',
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
