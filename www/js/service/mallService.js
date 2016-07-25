angular.module('starter.services', [])

.service('MallService', function($q) {

  var mallList = [];

  this.doRefresh = function () {

    var deferred = $q.defer();
    mallList.length = 0;
    for(var i=0; i<20; i++){
      mallList.push('mall item list ' + i+1);
    };

    deferred.resolve(mallList);
    return deferred.promise;
  };

});
