var editor = angular.module('toulouse.editor', [
  'toulouse.movies',
]);

editor.controller('EditorCtrl', function($routeParams, $scope, $movies){

  // Load a movie
  $scope.movie = null;
  $movies.get($routeParams.movie_id).then(function(movie){
    console.log(movie);
    $scope.movie = movie;
  });

});
