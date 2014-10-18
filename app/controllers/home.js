var home = angular.module('toulouse.home', [
  'toulouse.movies',
]);

home.controller('HomeCtrl', function($scope, $movies){

  // List movies
  $scope.movies = null;
  var show_movies = function(name){
    $movies.list(name).then(function(movies){
      $scope.movies = movies;
    });
  };

  // By default, list cats
  show_movies('cat');

  // Search action
  $scope.search = function(){
    console.info('Search : '+$scope.search_terms);
    show_movies($scope.search_terms);
  };

});
