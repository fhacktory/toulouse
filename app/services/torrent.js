var torrent = angular.module('toulouse.torrent', [
]);

torrent.service('$torrent', function($http, $q){

  var api_url = 'http://api.trolls.cat/api';

  // Request to torrent api
  var request = function(url){
    var deferred = $q.defer();
    $http.get(url).then(function(response){
      // Bad response
      if(response.status != 200)
        return deferred.reject(response);

      // Failed in api
      if(!response.data.meta.success)
        return deferred.reject(response);

      deferred.resolve(response.data.data); // yup, use data from Marie's response
    });
    return deferred.promise;
  };

  return {

    // Get the status of an Imdb movie
    get_imdb : function(imdb_id, create){
      var suffix = create ? '/1' : '';
      return request(api_url + '/movie/' + imdb_id + suffix);
    },

    get_stream : function(imdb_id){
      return request(api_url + '/movie/stream/' + imdb_id);
    },

    // Get a movie's pictures after a timestamp
    get_pictures : function(imdb_id, timestamp){

      // For dev give cats
      var out = []
      for(var i = 0; i < 12; i++){
        out.push('http://lorempixel.com/400/200/cats/1/Chaton-'+imdb_id+'-'+i);
      }
      return out;
    },

    // Get the downloader status
    status : function(){
      return request(api_url + '/status');
    }
  };

});
