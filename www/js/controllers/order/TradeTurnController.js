/**
 * Created by lijianhui on 2016/9/17.
 */
angular.module('starter.controllers')
    .controller('TradeTurnCtrl', function ($scope,$state,$rootScope,TrasferService,shcemUtil) {

      $scope.$on('$ionicView.beforeEnter', function() {
        getTrasferInfo ();
      });

      //获取转货权信息
      var getTrasferInfo = function() {
        TrasferService.getTrasferInfo("JS160921000801", //DeliveryID
          function(data) {
            $scope.item = data;
          }, function(msg) {
            shcemUtil.showMsg(msg);
          }
        );
      }

      $scope.goBack = function () {
        $rootScope.$ionicGoBack();
      }
    })
