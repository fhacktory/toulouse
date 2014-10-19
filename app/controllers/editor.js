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

    // Apply settins to video
    $scope.mp4url = 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4';

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

  // Setup empty video editor
  $scope.video = {
    width : '100%',
  };
  $scope.mp4url = null; // no url yet
});

// Our own video player
editor.directive('editorVideo', function($torrent){
  return {
    restrict : 'AE', // Must be an attribute or element
    replace : 'true',
    controller : 'EditorCtrl',

    // Here we manipulate the dom
    link : function (scope, element, attrs, ctrl){
      var progress = element.find('div.progress');
      var video = element.find('video');
      var pictures = element.find('pictures');

      // Setup url when received from controller
      scope.$watch('mp4url', function(newValue, oldValue){
        if(!newValue || newValue == oldValue)
          return;

        // Update video url and play
        video.append(angular.element('<source/>', {
          type : 'video/mp4',
          src : newValue,
        }));
        video = video[0] || video; // don't ask.
        video.play();
      });

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

        // Load images for timestamp
        var pictures = $torrent.get_pictures(scope.movie.imdb_id, time);
        console.log(pictures);
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
