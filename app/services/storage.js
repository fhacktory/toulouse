var storage = angular.module('toulouse.storage', [
]);

storage.service('$storage', function(localStorageService){
  return {

    // Add a capture in browser storage
    add : function(movie, start, end, url){
      var key = movie.imdb_id + ':'+start+':'+end;
      return localStorageService.set(key, {
        movie : movie,
        start : start,
        end : end,
        url : url,
        added : new Date(),
      });
    },

    // List all captures in browser storage
    list : function(){
      var keys = localStorageService.keys();
      var out = {};

      angular.forEach(keys, function(key){
        out[key] = localStorageService.get(key);
      });
      return out;
    },
  };
});
