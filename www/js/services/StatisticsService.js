/*
 *create by hdy 08-17-16
 * 统计服务
 */
angular.module('starter.services')
.service("Statistics",function ($cordovaGoogleAnalytics) {
  var init = function () {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-82635606-1');
      $cordovaGoogleAnalytics.setAllowIDFACollection(true);
      $cordovaGoogleAnalytics.setUserId("customer");
  };
  return {
    init:init
  }
});
