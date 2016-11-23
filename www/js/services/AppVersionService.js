/*
 * created by hdy 08-17-16
 * 用于提醒用户升级,引导用户评价
 */

angular.module('starter.services')
  .service("AppVersion",function ($cordovaAppVersion,$http,$cordovaDialogs,shcemUtil) {
      var getVersion = function (currentV) {
         //document.addEventListener("deviceready", function () {
         // $cordovaAppVersion.getVersionNumber().then(function (result) {
         //   var currentV = result;
        shcemUtil.showLoading();
            $http({
              method: 'JSONP',
              url: 'http://itunes.apple.com/lookup?id=981130489',
              params: {callback: 'JSON_CALLBACK'}
            }).then(function (response) {
              shcemUtil.hideLoading();
              var remoteVersion = response.data.results[0].version;
              var releaseNotes = response.data.results[0].releaseNotes;
              if(remoteVersion > currentV){
                document.addEventListener("deviceready", function () {
                  $cordovaDialogs.confirm(releaseNotes,remoteVersion,["现在更新","下次再说"])
                    .then(function (index) {
                      if(index == 1){
                        window.open("http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?pageNumber=0&sortOrdering=1&type=Purple+Software&mt=8&id=981130489");
                      }
                    });
                });
              }else{
                shcemUtil.hideLoading();
                shcemUtil.showMsg("没有更新的版本");
              }
            }, function errorCallback(response) {
              //alert( response);
              shcemUtil.showMsg("获取最新版本失败");
            });
      //    });
      //   });
      };
      return {
        getVersion:getVersion
      }
  });

