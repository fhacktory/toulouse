var editor = angular.module('toulouse.editor', [
  'toulouse.movies',
  'toulouse.torrent',
]);

editor.controller('EditorCtrl', function($routeParams, $scope, $movies, $torrent){
  $scope.error = false;

  // Show navbar search
  $scope.$emit('show_search');

  // Load torrent info from imdb data
  var load_torrent = function(imdb_id){
    if(!imdb_id){
      $scope.error = true;
      return;
    }
    $torrent.get_imdb(imdb_id).then(function(torrent){
      $scope.torrent = torrent['movies'][0]; // dirty
    }, function(error){
      $scope.error = true; // don't give a shit about message
    });
  };

  // Load a movie
  $scope.movie = null;
  $scope.torrent = null;
  $movies.get($routeParams.movie_id).then(function(movie){
    $scope.movie = movie;

    // Get torrent status
    setInterval(function(){
      load_torrent(movie.imdb_id);
    }, 2000);
  }, function(error){
    $scope.error = true; // don't give a shit about message
  });

  // Load similar movies
  $scope.similars = null;
  $movies.similar($routeParams.movie_id).then(function(similars){
    $scope.similars = similars.results;
  });

});
