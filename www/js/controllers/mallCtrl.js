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

});
