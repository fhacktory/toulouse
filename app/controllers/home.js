var home = angular.module('toulouse.home', [
  'toulouse.movies',
]);

home.controller('HomeCtrl', function($scope, $routeParams, $movies){

  // Hide navbar search
  $scope.$emit('hide_search');

  // List movies
  $scope.movies = null;
  var show_movies = function(name){
    $movies.search(name).then(function(movies){
      $scope.list_title = 'Movies found';
      $scope.movies = movies.results;
    });
  };

  if($routeParams.search_term){
    // Search using asked terms
    $scope.search_terms = $routeParams.search_term;
    show_movies($routeParams.search_term);
  }else{
    // By default, show popular
    $scope.list_title = 'Popular movies';
    $movies.popular().then(function(movies){
      $scope.movies = movies.results;
    });
  }

  // Search action
  $scope.search = function(){
    console.info('Search : '+$scope.search_terms);
    show_movies($scope.search_terms);
  };

});
