/**
 * Created by guzhenfu on 2016/7/27.
 */
angular.module('starter.controllers')
  .controller('searchCtrl', function ($scope, $ionicHistory, mallService) {

    $scope.doSearch = function () {
      mallService.setKey('樊氏集团');
      $ionicHistory.goBack();
    };

  });
