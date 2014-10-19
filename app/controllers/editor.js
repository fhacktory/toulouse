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

      // In 2s, update data
      setTimeout(function(){
        load_torrent(imdb_id);
      }, 2000);
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
    load_torrent(movie.imdb_id);
  }, function(error){
    $scope.error = true; // don't give a shit about message
  });

  // Load similar movies
  $scope.similars = null;
  $movies.similar($routeParams.movie_id).then(function(similars){
    $scope.similars = similars.results;
  });

  // Setup video editor
  $scope.video = {
    mp4_url: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
    width : '100%',
  };
});

// Our own video player
editor.directive('editorVideo', function(){
  return {
    restrict : 'AE', // Must be an attribute or element
    replace : 'true',

    // Here we manipulate the dom
    link : function (scope, element, attrs){

      var progress = element.find('div.progress');
      var video = element.find('video');

      // Get initial duration
      video.on('loadedmetadata', function(evt){
        scope.$apply(function(){
          scope.duration = evt.target.duration;
          scope.percent = 0;
        });
      });

      video.on('timeupdate', function(evt){
        // Update duration
        scope.$apply(function(s){
          scope.time = evt.target.currentTime;
          if(scope.duration > 0)
            scope.percent = 100.0 * scope.time / scope.duration;
        });
      });

      // On progress click, seek
      progress.on('click', function(evt){

        // Calc percent of click
        var parentOffset = $(this).parent().offset();
        var w = $(this).width();
        var percent = (evt.pageX - parentOffset.left) / w;

        // Calc new time of video
        var time = Math.floor(scope.duration * percent);

        // Seek video
        video = video[0] || video; // don't ask.
        video.currentTime = time;

        // Always play on seek
        if(video.paused)
          video.play();

      });

    },

    // Use conf from scope through element
    scope : {
      'conf' : '=',
    },
    templateUrl : 'templates/video.html',
  };
});

// Display nicely seconds
editor.filter('nice_seconds', function(){
  return function(seconds){
    if (seconds === Infinity) {
      return '∞'; // If the data is streaming
    }
    var hours = parseInt(seconds / 3600, 10) % 24,
      minutes = parseInt(seconds / 60, 10) % 60,
      secs = parseInt(seconds % 60, 10),
      result,
      fragment = (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs < 10 ? '0' + secs : secs);
    if (hours > 0) {
      result = (hours < 10 ? '0' + hours : hours) + ':' + fragment;
    } else {
      result = fragment;
    }
    return result;
  };
});
