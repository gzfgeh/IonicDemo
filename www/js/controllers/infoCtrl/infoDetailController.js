angular.module('starter.controllers')

    .controller('InfoDetailCtrl', function ($scope, $state, $ionicHistory, $stateParams, infoDetailService, $controller,$sce, config) {

      /**
       * 引入baseCtrl，加入公共操作的部分
       */
      $controller("baseCtrl", {$scope: $scope});

      $scope.shareUrl = config.infoShareUrl+$stateParams.infoID;

      var u = navigator.userAgent;
      //  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);


        infoDetailService.getinfoDetailData($stateParams.infoID)
            .then(function (ret) {
                $scope.infoDetailLists = ret;
              var temp = ret.InfoContent;
              try {
                temp = decodeURIComponent(ret.InfoContent);
              }catch(e){

              }
              $scope.infoDetailList=$sce.trustAsHtml(infoDetailService.html_decode(temp));
            }, function (error) {

            });

        $scope.goBack=function(){
            $ionicHistory.goBack();
        };
       $scope.shareInfo=function(){
         if(isiOS){
           // window.plugins.socialSharing.showSharing(["hello(标题)","https://www.baidu.","xxxxxxxxxxxxx(描述)"]);
           window.plugins.socialSharing.showSharing([$scope.infoDetailLists.InfoTitle,$scope.shareUrl,$scope.infoDetailLists.Date.substr(0,10)]);
         } else {
           $scope.backdop="show";
           $scope.unshare="show";
         }
       };
      $scope.clearBack=function(){
        $scope.backdop="hide";
        $scope.unshare="hide";
      };

      $scope.shareWeiXin = function () {
        Wechat.isInstalled(function (installed) {
          if (installed){
            //发送给朋友
            Wechat.share({
              message: {
                title: $scope.infoDetailLists.InfoTitle,
                description: $scope.infoDetailLists.Date.substr(0,10),
                thumb: "www/img/logo.png",
                mediaTagName: "上海化交",
                messageExt: "上海化交",
                messageAction: "<action>上海化交</action>",
                media: {
                  type: Wechat.Type.WEBPAGE,
                  webpageUrl: $scope.shareUrl
                }
              },
              scene: Wechat.Scene.SESSION   // share to SESSION
            }, function () {
              shcemUtil.showMsg("分享成功");
            }, function (reason) {
            });

          }else{
          }
        }, function (reason) {

        })
      }

      $scope.shareFriend = function () {
        Wechat.isInstalled(function (installed) {
          if (installed){
            //分享朋友圈
            Wechat.share({
              message: {
                title: $scope.infoDetailLists.InfoTitle,
                description: $scope.infoDetailLists.Date.substr(0,10),
                thumb: "www/img/logo.png",
                mediaTagName: "上海化交",
                messageExt: "上海化交",
                messageAction: "<action>上海化交</action>",
                media: {
                  type: Wechat.Type.WEBPAGE,
                  webpageUrl: $scope.shareUrl
                }
              },
              scene: Wechat.Scene.TIMELINE   // share to TIMELINE
            }, function () {
              shcemUtil.showMsg("分享成功");
            }, function (reason) {
            });

          }else{
          }
        }, function (reason) {

        })
      }

      $scope.shareQQ = function () {
        QQ.shareToQQ(function () {
          shcemUtil.showMsg("分享成功");
        }, function (reason) {
        }, {
          url: $scope.shareUrl,
          title: $scope.infoDetailLists.InfoTitle,
          description: $scope.infoDetailLists.Date.substr(0,10),
          imageUrl: "www/img/logo.png",
          appName: "上海化交"
        })
      }

      $scope.shareQQSpace = function () {
        QQ.shareToQQ(function () {
          shcemUtil.showMsg("分享成功");
        }, function (reason) {
        }, {
          url: $scope.shareUrl,
          title: $scope.infoDetailLists.InfoTitle,
          description: $scope.infoDetailLists.Date.substr(0,10),
          imageUrl: "www/img/logo.png",
          appName: "上海化交"
        })
      }

      var args = {};
      args.url = "http://www.shcem.com";
      args.title = "我很帅";
      args.description = "非常帅";
      args.imageUrl = "https://www.baidu.com/img/bdlogo.png";
      args.defaultText = "上海化交";

      $scope.shareWeiBo = function () {
        YCWeibo.checkClientInstalled(function(){

          YCWeibo.ssoLogin(function(args){

            alert("access token is "+args.access_token);
            alert("userid is "+args.userid);
            alert("expires_time is "+ new Date(parseInt(args.expires_time)) + " TimeStamp is " +args.expires_time);

            YCWeibo.shareToWeibo(function () {
              shcemUtil.showMsg("分享成功");
            }, function (reason) {
              shcemUtil.showMsg("失败原因: " + reason);
            }, args)


          },function(failReason){
            shcemUtil.showMsg("登录失败原因: " + failReason);
          });


        },function(){
          shcemUtil.showMsg("未安装客户端");
        });

      };


//判断内容高度
//       $scope.$on('$ionicView.enter', function () {
//
//         var newscontent= document.getElementById("newscontent").offsetHeight;
//         var winHeght=window.screen.height;
//         console.log(newscontent,winHeght)
//
//       if(newscontent>winHeght){
//
//         $scope.Detailfreetip=""
//       }else{
//
//         $scope.Detailfreetip="DetailfreeTip";
//       }
//
//       });

    });






