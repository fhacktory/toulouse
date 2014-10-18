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
    get_imdb : function(imdb_id){
      return request(api_url + '/movie/' + imdb_id);
    },
  };

});
