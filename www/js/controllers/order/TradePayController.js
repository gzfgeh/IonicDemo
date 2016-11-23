/**
 * Created by lijianhui on 2016/9/13.
 */


angular.module('starter.controllers')
    .controller('TradePayCtrl', function ($scope,$state,$stateParams,enquiryService, shcemUtil,$rootScope,$ionicScrollDelegate) {
      var paySureObj = {
        "FirmID":"772","TmplID":4,"CategoryID":82,
        "BrandID":1489,"Price":20,"Quantity":5,
        "TradeRole":1,"TradeUnitNumber":1,
        "goodsType":0
      };

      var payObj = {
        "OrderID":"",
        "QueryType":0,
        "PaymentPwd":0,
        "HasCoupon":false,
        "UserCode":"",
        "ButtonID":0
      };

      //onCreate()
      $scope.$on('$ionicView.loaded',function () {

      });

      //onResume()
      $scope.$on('$ionicView.beforeEnter',function () {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.item = enquiryService.getObj();
        $scope.item.paymentPwdStatus = enquiryService.getUserInfo().paymentPwdStatus;

        $scope.inputPass=[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}];


        var active="";
        paypassword=document.querySelectorAll("pay-password");
        for(var i=0;i<=paypassword.lenth;i++){
          paypassword[i].addEventListener('click',function(){
            paypassword[active].focus();
          },false);
          paypassword[i].addEventListener('focus', function () {
            this.addEventListener('keyup', listenKeyUp, false);
          }, false);
          paypassword[i].addEventListener('blur', function () {
            this.removeEventListener('keyup', listenKeyUp, false);
          }, false);
        }


        //输入支付密码
        $scope.test='sectionchange';

        var inputIndex=0;

        $scope.keyboardPayShow= function($event) {
          if (!$scope.item.paymentPwdStatus){
            shcemUtil.showMsg("请设置支付密码");
            return;
          }
          $rootScope.keyboardHide="show";
          setTimeout(function(){$ionicScrollDelegate.scrollBottom();},20);
          $scope.test="";

        };
        $rootScope.keyboardClick=function(value)
        {
          if(inputIndex<6)
          {
            $scope.inputPass[inputIndex].value=value;
            inputIndex++;
          }

        }

        $rootScope.keyboardDelete=function()
        {

          if(inputIndex>0)
          {
            inputIndex--;
            $scope.inputPass[inputIndex].value='';
          }

        }

        $rootScope.keyboardFinish=function()
        {
          $scope.test='sectionchange';
          $rootScope.keyboardHide="";
        }


      });

        //跳转到支付成功页面
      $scope.gopaySuccess=function(){
        if (!shcemUtil.getIsCanPay()){
          return;
        }
          $scope.test='sectionchange';
          var info = enquiryService.getUserInfo();
          payObj.UserCode = info.UserCode;
          payObj.HasCoupon = $scope.item.HasCoupon;
          payObj.OrderID = $scope.item.OrderId;
          payObj.QueryType = $scope.item.QueryType;
          payObj.ButtonID = $scope.item.ButtonList[0].ID;
          payObj.PaymentPwd = "";
          for(var i=0; i<6; i++){
            payObj.PaymentPwd += $scope.inputPass[i].value;
          }
          shcemUtil.showLoading();
          enquiryService.PayPrice(payObj)
            .then(function (ret) {
              $scope.item = enquiryService.mergeObj($scope.item, ret)
              enquiryService.setObj($scope.item);
              shcemUtil.hideLoading();
              $state.go("tabs.paySuccess");
              shcemUtil.showMsg("交易成功");
            }, function (error) {
              shcemUtil.hideLoading();
              shcemUtil.showMsg(error);
            })
            .finally(function () {
              $rootScope.keyboardHide="hide";
            });

      };


      $scope.goBack = function () {
        $scope.$ionicGoBack();
      }




    })
    .controller('PaySuccessCtrl', function ($scope,$state, enquiryService,$rootScope) {
      //onCreate()
      $scope.$on('$ionicView.loaded',function () {
        $scope.item = enquiryService.getObj();

      });

      $scope.goBack = function () {
        $scope.$emit('todo:MyTradeCtrl');
        $state.go("tabs.mytrade");
      }

      //onResume()
      $scope.$on('$ionicView.beforeEnter',function () {
        $rootScope.hideTabs = 'tabs-item-hide';
        $rootScope.keyboardHide="hide";
      });

    });

