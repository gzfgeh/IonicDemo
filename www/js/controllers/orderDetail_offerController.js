/**
 * Created by chenguo on 2016/8/9.
 */
angular.module('starter.controllers')
  .controller('orderofferctr', function ($scope, $rootScope, $controller, messageService) {
    /**
     * 引入baseCtrl，加入公共操作的部分
     */
    $controller("baseCtrl", {$scope: $scope});

    //onResume()
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.itemObj = messageService.getObj();
      $rootScope.hideTabs = 'tabs-item-hide';

      
    });
  });
