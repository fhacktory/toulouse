var actor = angular.module('toulouse.actor', [
  'toulouse.movies',
]);

actor.controller('ActorCtrl', function($scope, $routeParams, $movies){

  // Show navbar search
  $scope.$emit('show_search');

  // Load actor
  $scope.actor = null;
  $movies.actor($routeParams.actor_id).then(function(actor){
    $scope.actor = actor;
  });

  // Load related movies
  $scope.movies = null;
  $movies.actor_movies($routeParams.actor_id).then(function(movies){
    $scope.movies = movies.cast;
  });

});
