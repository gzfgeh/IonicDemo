/**
 *
 *
 * Created by guzhenfu on 2016/7/26.
 */

angular.module('starter.controllers')
.controller('mallDetailCtrl', function ($scope, $rootScope, $controller) {
  /**
   * 引入baseCtrl，加入公共操作的部分
   */
  $controller("baseCtrl", {$scope: $scope});

  //onResume()
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = 'tabs-item-hide';
  });



});
