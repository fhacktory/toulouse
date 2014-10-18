var movies = angular.module('toulouse.movies', [

]);

movies.service('$movies', function($http, $q){

  var api_key = '52dda17c8cf0bbc2451f9cde1fea0913';

  return {

    list : function(term){
      var deferred = $q.defer();
      var url = 'http://api.themoviedb.org/3/search/movie?';
      url += 'api_key='+api_key+'&query='+term;
      var data = {
        api_key : api_key,
        query : 'cat',
      };
      // Todo: build query set
      $http.get(url).then(function(resp){
        deferred.resolve(resp.data.results);
      });

      return deferred.promise;
    },
  };


});
