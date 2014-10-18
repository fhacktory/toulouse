var main = angular.module('toulouse.main', [
]);

main.controller('MainCtrl', function($scope, $location){

  // Toggle search in nav
  $scope.$on('hide_search', function(){
    $scope.search_enabled = false;
  });
  $scope.$on('show_search', function(){
    $scope.search_enabled = true;
  });

  // Redirect to search
  $scope.search_terms = null;
  $scope.search = function(){
    $location.url('/search/'+$scope.search_terms);
  };

});
