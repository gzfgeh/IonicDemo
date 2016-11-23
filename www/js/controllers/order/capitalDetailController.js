/**
 * Created by lijianhui on 2016/9/19.
 */
angular.module('starter.controllers')
    .controller('CapitalDetailCtrl',function ($scope,BadgeService,$rootScope,$state,$stateParams,CapitalDetailService,shcemUtil) {
      $scope.$on('$ionicView.beforeEnter', function() {
        queryBalanceDetail();
      });
      $scope.doRefresh = function () {
        queryBalanceDetail();
      }
      var queryBalanceDetail = function() {
        CapitalDetailService.queryOneFirmBanlance($stateParams.firmID, function (data) {
            $scope.item = data;
            $scope.$broadcast('scroll.refreshComplete');
          },
          function (msg) {
            shcemUtil.showMsg("系统繁忙，请稍后再试...");
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

      $scope.goBack = function () {
        $state.go("tabs.order");
      }

    });

