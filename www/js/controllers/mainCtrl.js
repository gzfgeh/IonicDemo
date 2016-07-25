angular.module('starter.controllers')
.controller('mainCtrl', function($scope){
  $scope.offerList = [];
  $scope.offerPpList = [];


  for(var i=0; i<10; i++){
    $scope.offerList.push(['best offer item list ' + i+1].join(''));
  }

  for(var i=0; i<10; i++){
    $scope.offerPpList.push(['best offer pp item list ' + i+1].join(''));
  }

});
