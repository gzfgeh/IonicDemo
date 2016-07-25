angular.module('starter.controllers')

.controller('mallCtrl', function($scope, MallService){

  $scope.doRefresh = function () {
    MallService.doRefresh()
      .then(function (ret) {
        $scope.list = ret;
      }, function (error) {

      }).finally(function () {
        $scope.$broadcast("scroll.refreshComplete");
    })
  };



  $scope.moreData = true;

  $scope.doLoadMore = function () {
    MallService.doLoadMore()
      .then(function (ret) {
        $scope.list = ret;
      }, function (error) {

      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
    })
  }

});
