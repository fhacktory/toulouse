var editor = angular.module('toulouse.editor', [
  'toulouse.movies',
]);

editor.controller('EditorCtrl', function($routeParams, $scope, $movies){

  // Load a movie
  $scope.movie = null;
  $movies.get($routeParams.movie_id).then(function(movie){
    $scope.movie = movie;
  });

  // Load similar movies
  $scope.similars = null;
  $movies.similar($routeParams.movie_id).then(function(similars){
    $scope.similars = similars.results;
  });

});
