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

  /**
   *
   * @param obj
   * @param state 1初始化，2刷新，3加载更多
     */
  this.doLoadMore = function () {
    var deferred = $q.defer();
      for(var i=0; i<20; i++){
        mallList.push('mall item list ' + i+1);
      };
    deferred.resolve(mallList);
    return deferred.promise;
  }

});
