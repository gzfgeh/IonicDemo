/**
 * Created by lijianhui on 2016/9/17.
 */
angular.module('starter.controllers')
    .controller('TradeTakeCtrl', function ($scope,$state,$rootScope,$stateParams,$ionicPopup,shcemUtil,SelfPickService,UserService,config,$cordovaInAppBrowser) {

      var default_length =0;
      $scope.inputtest = {
          content: '',
          remain_textlength: default_length
      }
      //文本框输入，提示字数改变
      $scope.textChange = function(){
          $scope.inputtest.remain_textlength = $scope.inputtest.content.length;
      };

      // $scope.$on('$ionicView.beforeEnter', function() {
      //   getSelfPickInfo();
      // });

      //获取订单信息
      // var getSelfPickInfo = function() {
      //   SelfPickService.getSelfPickInfo("JS160919001901", //DeliveryID
      //     function(data) {
      //       $scope.item = data;
      //       $scope.item.StartDate = new Date($scope.item.StartDate);
      //       $scope.item.EndDate = new Date($scope.item.EndDate);
      //     }, function(msg) {
      //       shcemUtil.showMsg(msg);
      //     }
      //   );
      // }

      //申请自提交收页面初始化用
      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.selfPick = angular.copy({});
        getOrderInfo();

      });

      //获取订单信息
      var getOrderInfo = function() {
        SelfPickService.getOrderInfo($stateParams.OrderID,
          function(data) {
            $scope.item = data;
          }, function(msg) {
            shcemUtil.showMsg(msg);
          }
        );
      }

      //提交申请
      // $scope.addSelfPick = function() {
      //   //获取userCode
      //   var userCode = "";
      //   UserService.getUserInfo(function (token,ret,msg) {
      //     userCode = ret.UserCode;
      //   },function (msg,code) {
      //     UserService.checkToken(code);
      //   })
      //   var requestParam = {
      //     DeliveryDetailList:[
      //       {
      //         StartDate:$scope.selfPick.StartDate,
      //         EndDate:$scope.selfPick.EndDate,
      //         LogisticsCorp:$scope.selfPick.LogisticsCorp,
      //         DriverIDNumber:$scope.selfPick.DriverIDNumber,
      //         //DriverName:"",
      //         License:$scope.selfPick.License,
      //         //NextApplyID:0,
      //         Quantity:$scope.selfPick.Quantity,
      //         ContactTel:$scope.selfPick.ContactTel,
      //         ContactName:$scope.selfPick.ContactName,
      //         Remark:$scope.inputtest.content
      //       }
      //     ],
      //     OrderID:$stateParams.OrderID,
      //     FirmID:$stateParams.FirmID,
      //     userCode:userCode,
      //     IsCheckDate:1, //默认
      //     ButtonID:$stateParams.ButtonID //自提交收：3
      //   };
      //   alert(JSON.stringify(requestParam));
      //
      //   SelfPickService.addSelfPick(requestParam, function(ret){
      //       shcemUtil.showMsg(ret.INFO);
      //     }, function(msg){
      //       shcemUtil.showMsg(msg);
      //     }
      //   );
      // }

      $scope.goBack = function () {
        $rootScope.$ionicGoBack();
        //$scope.$emit('todo:MyTradeCtrl');
        //$state.go("tabs.mytrade");
      }

      $scope.goHistory=function () {
        $rootScope.$ionicGoBack();
      }
      //弹出浏览器，下载
      $scope.goDownload = function () {
        // var options = {
        //   location: 'yes',
        //   clearcache: 'yes',
        //   toolbar: 'no'
        // };

        // document.addEventListener("deviceready", function () {
        //   $cordovaInAppBrowser.open(config.downFileUrl+"/staticfiles/down/自提信息申报单.doc", '_system', options)
        //     .then(function(event) {
        //       // success
        //     })
        //     .catch(function(event) {
        //       // error
        //     });
        //   $cordovaInAppBrowser.close();

        // }, false);
     ////弹框提醒
    //    $scope.showAlert = function() {
           var alertPopup = $ionicPopup.alert({
               template: '请至上海化交官网下载，谢谢。',
               okText: '确定'
           });
           alertPopup.then(function(res) {
               console.log('Thank you for not eating my delicious ice cream cone');
           });
    //    };
      }


   
    })

