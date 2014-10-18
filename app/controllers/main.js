var main = angular.module('toulouse.main', [
  'toulouse.torrent',
]);

main.controller('MainCtrl', function($scope, $location, $torrent){

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

  // Show status
  $scope.status = null;
  $torrent.status().then(function(status){
    $scope.status = status;
  });
});
