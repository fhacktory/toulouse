var home = angular.module('toulouse.home', [
  'toulouse.movies',
]);

home.controller('HomeCtrl', function($scope, $movies){

  // List movies
  $scope.movies = null;
  var show_movies = function(name){
    $movies.search(name).then(function(movies){
      $scope.list_title = '"'+name+'" movies';
      $scope.movies = movies.results;
    });
  };

  // By default, show popular
  $scope.list_title = 'Popular movies';
  $movies.popular().then(function(movies){
    $scope.movies = movies.results;
  });

  // Search action
  $scope.search = function(){
    console.info('Search : '+$scope.search_terms);
    show_movies($scope.search_terms);
  };

});
