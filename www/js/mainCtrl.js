angular.module('starter.controllers')
.controller('mainCtrl', function($scope){
  $scope.offerList = [];
  for(var i=0; i<10; i++){
    $scope.offerList.push(['item list ' + i+1].join(''));
  }


});
