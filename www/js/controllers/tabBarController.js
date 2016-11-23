/*
 * created by hdy 2016-0811
 */

angular.module('starter.controllers')
.controller('TabCtrl',function ($scope,BadgeService,$rootScope,$state) {

  var updateBadgeValue = function () {
    var badgeObj = BadgeService.notificationInfo;
    if(badgeObj.mainPage.constructor == Array){
      $scope.mainBadgeValue = badgeObj.mainPage.length;
    }
    if(badgeObj.mallPage.constructor == Array){
      $scope.mallBadgeValue = badgeObj.mallPage.length;
    }
    if(badgeObj.tradePage.constructor == Array){
      $scope.tradeBadgeValue = badgeObj.tradePage.length;
    }
    if(badgeObj.msgPage.constructor == Array){
      $scope.msgBadgeValue = badgeObj.msgPage.length;
    }
    if(badgeObj.minePage.constructor == Array){
      $scope.mineBadgeValue = badgeObj.minePage.length;
    }
  };
  $scope.$on('$ionicView.beforeEnter', function(){
    updateBadgeValue();
  });
  $scope.$on('$ionicView.enter', function() {
  //  console.log("进入tabBar控制器");
  });
  $scope.$on('$ionicView.loaded',function () {
  //  console.log('加载tabbar控制器');
  });
  $scope.$on('$ionicView.leave',function () {
   // console.log('离开tabbar控制器');
  //  updateBadgeValue();
  });

  $scope.$on('updateBadge',function () {
    //updateBadgeValue();
    $state.reload();
  })
  //   $rootScope.goMain=function(){
  //   $state.go("tabs.top")
  // };
  $scope.goInfo=function(){
  $state.go("tabs.info")
}
  // $rootScope.goUser=function(){
  //   $state.go("tabs.user")
  // }
  // $rootScope.goMall=function(){
  //   $state.go("tabs.mall")
  // }
  // $rootScope.goOrder=function(){
  //   $state.go("tabs.order")
  // }
});
