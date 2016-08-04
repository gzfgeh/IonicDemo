angular.module('starter.controllers')

.controller('orderCtrl', function($scope){
  $scope.lightClick = function () {
    console.log("light");
    window.document.getElementById("order").style.backgroundColor="#000";
    window.document.getElementById("order").style.color="#FFF";
  };

  $scope.redClick = function () {
    console.log("red");
    window.document.getElementById("order").style.backgroundColor="#CCC";
    window.document.getElementById("order").style.color="#222";
  };
});
