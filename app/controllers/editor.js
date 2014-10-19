var editor = angular.module('toulouse.editor', [
  'toulouse.movies',
  'toulouse.torrent',
]);

editor.controller('EditorCtrl', function($routeParams, $scope, $movies, $torrent){
  $scope.error = false;
  $scope.ask_creation = false;

  // Show navbar search
  $scope.$emit('show_search');

  // Start a download
  $scope.start_download = function(){
    if(!$scope.movie || $scope.torrent)
      return;
    load_torrent($scope.movie.imdb_id, true);
  };

  // Load torrent info from imdb data
  var load_torrent = function(imdb_id, create){
    if(!imdb_id){
      $scope.error = true;
      return;
    }
    $torrent.get_imdb(imdb_id, create).then(function(torrent){

      // Ask for creation when empty
      if(!torrent['movies'].length){
        $scope.ask_creation = true;
        return;
      }

      $scope.torrent = torrent['movies'][0]; // dirty

      // Broadcast new torrent
      $scope.$broadcast('new_torrent', $scope.torrent);

      // In 2s, update data, when not cached
      if($scope.torrent.status != 'cached'){
        setTimeout(function(){
          load_torrent(imdb_id, false);
        }, 2000);
      }
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
    load_torrent(movie.imdb_id, false);
  }, function(error){
    $scope.error = true; // don't give a shit about message
  });

  // Load similar movies
  $scope.similars = null;
  $movies.similar($routeParams.movie_id).then(function(similars){
    $scope.similars = similars.results;
  });

  // Load actors
  $scope.actors = null;
  $movies.actors($routeParams.movie_id).then(function(peoples){
    $scope.actors = peoples.cast;
  });


  // Setup empty video editor
  $scope.video = {
    width : '100%',
  };
  $scope.mp4url = null; // no url yet
});


// Controller between editor & video
// to avoid double instanciation of EditorCtrl
editor.controller('SandwichCtrl', function($scope, $torrent){

  $scope.torrent = null;
  $scope.mp4url = null;
  $scope.$on('new_torrent', function(scope, torrent){

    // Save torrent
    $scope.torrent = torrent;

    // Load stream url
    if(!$scope.mp4url && torrent.status == 'cached'){
      $torrent.get_stream(torrent.imdbId).then(function(stream){
        $scope.mp4url = stream['movies'][0]['stream'];
      });
    }
  });
});

// Our own video player
editor.directive('editorVideo', function($torrent){
  return {
    restrict : 'AE', // Must be an attribute or element
    replace : 'true',
    controller : 'SandwichCtrl',

    // Here we manipulate the dom
    link : function (scope, element, attrs, ctrl){
      var progress = element.find('div.progress');
      var video = element.find('video');
      var pictures = element.find('pictures');
      scope.capture = null;

      // Setup url when received from controller
      scope.$watch('mp4url', function(newValue, oldValue){
        if(!newValue || oldValue) // update only once
          return;

        // Update video url and play
        video.append(angular.element('<source/>', {
          type : 'video/mp4',
          src : newValue,
        }));
        var v = video[0] || video; // don't ask.
        v.play();
      });

      // Get initial duration
      video.on('loadedmetadata', function(evt){
        scope.$apply(function(){
          scope.duration = evt.target.duration;
          scope.percent = 0;
        });
      });

      video.on('timeupdate', function(evt){
        scope.$apply(function(s){
          // Update duration
          scope.time = evt.target.currentTime;
          if(scope.duration > 0)
            scope.percent = 100.0 * scope.time / scope.duration;
        });
      });

      // On progress click, seek
      progress.on('click', function(evt){
        if(scope.capture){
          console.warn('No seek on capture');
          return;
        }

        // Calc percent of click
        var parentOffset = $(this).parent().offset();
        var w = $(this).width();
        var percent = (evt.pageX - parentOffset.left) / w;

        // Calc new time of video
        var time = Math.floor(scope.duration * percent);

        // Seek video
        var v = video[0] || video; // don't ask.
        v.currentTime = time;

        // Always play on seek
        if(v.paused)
          v.play();

        // Load images for timestamp
/*
        var pictures = $torrent.get_pictures(scope.movie.imdb_id, time);
        angular.forEach(pictures, function(picture_url){
          console.log(picture_url);
        });
*/
      });

      // Start stop capture on movie click
      video.on('click', function(evt){
        if(scope.capture && scope.capture.end)
          return;

        if(scope.capture){
          // Stop capture
          scope.capture['end'] = video[0].currentTime;
          scope.capture['validated'] = false;
        }else{
          // Start capture
          scope.capture = {
            start : video[0].currentTime,
          };
        }
      });

      // Validate current capture
      scope.validate = function(use){
        if(use){
          scope.capture.validated = true;

          // Send to torrent api
          $torrent.make_gif(scope.torrent.imdbId, scope.capture.start, scope.capture.end).then(function(gif){
            // TODO
          });
        }else{
          // Reset capture
          scope.capture = null;
        }
      };

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
