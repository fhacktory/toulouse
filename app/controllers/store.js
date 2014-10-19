var store = angular.module('toulouse.store', [
  'toulouse.storage',
]);

store.controller('StoreCtrl', function($scope, $storage){

  // List all captures
  $scope.captures = $storage.list();
});
