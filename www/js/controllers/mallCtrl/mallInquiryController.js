
angular.module('starter.controllers')
  .controller('mallInquiryCtrl', function ($scope,$state, mallService, mallCheckExpenseService, shcemUtil, mallDetailInfoService, mallCreateEnquiryService,
                                           $ionicPopup, UserProductService,UserService,$ionicScrollDelegate) {

    $scope.Boxselect=function () {
      if($scope.boxchecked==true){
        $scope.boxchecked=false;
      }else{
        $scope.boxchecked=true;
      }

    }
    //询盘
    $scope.checkBox = true;
    $scope.PushStatus = 0;

    $scope.deal = angular.copy({});
    $scope.$on('$ionicView.beforeEnter',function () {
      $scope.boxchecked = false;
      document.getElementById("readRheckboxId").checked = false;
      $scope.mallInquiryObj = mallService.getObj();

      if ($scope.mallInquiryObj.TradeUnitNumber.toString().split(".").length>1){
        $scope.pointLength = $scope.mallInquiryObj.TradeUnitNumber.toString().split(".")[1].length;
      }else {
        $scope.pointLength = 0;
      }

      $scope.mallUserObj = mallCreateEnquiryService.getUserObj();
      shcemUtil.showLoading();
      getMallDetailRequest($scope.mallInquiryObj.ID);
      showType(false, true, false);
      $scope.enableEdit = false;
      $scope.deal.count = '';
      $scope.deal.price = '';

    });

    $scope.checkBoxClick = function (value) {
      $scope.checkBox = !$scope.checkBox;
      if(value == true) {
        $scope.PushStatus = 1;
      } else {
        $scope.PushStatus = 0;
      }
    };



    $scope.goNext = function () {

      if($scope.deal.price&&$scope.deal.price>0&&$scope.deal.price%1===0){
        if($scope.deal.price<$scope.thePrice){
          if($scope.deal.count &&$scope.deal.count>0&&$scope.deal.count%1===0){
            if($scope.deal.count*$scope.mallInquiryObj.TradeUnitNumber<=$scope.theCouldSall && $scope.deal.count*$scope.mallInquiryObj.TradeUnitNumber>=$scope.theMinSall){
              shcemUtil.showLoading();
              showType(true, false, true);
              $scope.enableEdit = true;
              getMoneyRequest($scope.hmDetailList.BrandID, $scope.deal.count, $scope.deal.price, $scope.hmDetailList.CategoryLeafID,
                $scope.hmDetailList.TradeUnitNumber, $scope.hmDetailList.GoodsType, $scope.hmDetailList.FirmID,$scope.hmDetailList.ID);
            } else {
              shcemUtil.showMsg("数量需大于等于最小交收量且小于卖盘剩余数量");
            }
          } else {
            shcemUtil.showMsg("请输入正整数成交数量");
          }
        } else {
          shcemUtil.showMsg("询盘价格需小于卖盘价格");
        }
      } else {
        shcemUtil.showMsg("请输入正整数成交价格");
      }
      var weight = $scope.deal.count*$scope.mallInquiryObj.TradeUnitNumber;
      $scope.weight = parseFloat(weight.toFixed(6));
      var totalPrice = $scope.deal.count*$scope.mallInquiryObj.TradeUnitNumber*$scope.deal.price;
      $scope.totalWeight = parseFloat(totalPrice.toFixed(2));
    };

    $scope.goBefore = function () {
      $scope.enableEdit = false;
      showType(false, true, false);
    };

    $scope.goSureSubmit = function ($event) {
    if($scope.boxchecked==true){
      shcemUtil.showLoading();
      getCreateEnquiryReauest($scope.mallInquiryObj.ID, $scope.deal.price, $scope.deal.count, $scope.mallUserObj[0], $scope.mallUserObj[1],
        $scope.mallUserObj[2], $scope.hmPriceList.TwoDecimalDeposit, $scope.PushStatus);
    }else{

      ischeckedshow();

    }
    };

    function showType(money, next, submit) {
      $scope.showMoney = money;
      $scope.showNext = next;
      $scope.showSubmit = submit;
    }


    function getMallDetailRequest(leadid) {
      mallDetailInfoService.getMallDetailInfoData(leadid)
        .then(function (ret) {
          shcemUtil.hideLoading();
          $scope.hmDetailList = ret;
          $scope.thePrice = $scope.hmDetailList.Price;  //价格
          $scope.theCouldSall = $scope.hmDetailList.ResidualWeight;    //可售量
          $scope.theMinSall = $scope.hmDetailList.MinQuantity*$scope.hmDetailList.TradeUnitNumber;  //最小交收量
        }, function (error) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg(error);
        })
    }

    function getMoneyRequest(BrandID, Quantity, Price,CategoryID, TradeUnitNumber, goodsType, FirmID ,leadID) {
      mallCheckExpenseService.getMallCheckExpenseData(BrandID, Quantity, Price, CategoryID,TradeUnitNumber, goodsType, FirmID ,leadID)
        .then(function (ret) {
          $scope.hmPriceList = ret;
          $scope.thePriceNumber = $scope.hmPriceList.Deposit;
        }, function (error) {
          shcemUtil.showMsg(error);
        }).finally(function () {
        shcemUtil.hideLoading();
      })
    }

    function getCreateEnquiryReauest(LeadsID,Price,Quantity,TraderID,FirmID,UserCode,DepositAmount,PushStatus) {
      mallCreateEnquiryService.getMallCreateEnquiryData(LeadsID,Price,Quantity,TraderID,FirmID,UserCode,DepositAmount,PushStatus)
        .then(function (ret) {
          var success = "操作成功。";
          if(ret == success){
            getMoneyRequest($scope.hmDetailList.BrandID, $scope.deal.count, $scope.deal.price, $scope.hmDetailList.CategoryLeafID,
              $scope.hmDetailList.TradeUnitNumber, $scope.hmDetailList.GoodsType, $scope.hmDetailList.FirmID,$scope.hmDetailList.ID);
            UserProductService.getMoneyCount(UserService.getUserInfoFromCache().FirmID,function (ret) {
              $scope.hmPriceList.UserBalance = UserProductService.USERBALANCEFromOra();
              showAlertSuccess();
            },function (err) {
            });
            if($scope.hmPriceList.UserBalance == 0){
              shcemUtil.showMsg("账户余额获取失败,请稍后再试");
            }
            // showAlertSuccess();
          } else {
            showAlertFail(ret);
          }
        }, function (error) {
          showAlertFail(error);
        }).finally(function () {
        shcemUtil.hideLoading();
      })
    }


    function ischeckedshow() {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="inquiry-title">敬告</div>'+'<div class="inquiry-body">请确认已阅读并同意《'+$scope.mallInquiryObj.GoodsTypeShow+'交易规则》</div>',
        buttons: [
          {
            text: '关闭',
            type: 'button-positive cus-dialog-btn',
            onTap: function(e) {
            }
          }
        ]
      });
      alertPopup.then(function() {
        $ionicScrollDelegate.scrollBottom();
      });
    }


    function showAlertSuccess() {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-tip"><i class="ion-ios-checkmark-outline"></i><p>询盘提交成功</p>' +
        '</div><div class="cus-dialog-text"><p>扣款总金额 <span class="red-color">'+$scope.hmPriceList.Deposit.toFixed(2)+'</span>元</p>' +
        '<p>保证金金额 <span class="red-color">'+$scope.hmPriceList.Deposit.toFixed(2)+'</span>元</p>'+'<p>当前资金账户余额<span class="red-color">' +
        $scope.hmPriceList.FormatTotalBalance+'</span>元</p></div>',
        buttons: [
          {
            text: '关闭',
            type: 'button-positive cus-dialog-btn',
            onTap: function(e) {
            }
          }
        ]
      });
      alertPopup.then(function(res) {
        $state.go("tabs.mall");
      });
    }

    function showAlertFail(news) {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-main"><p >'+news+'</p></div>',
        buttons: [
           {
            text: '确认',
            type: 'button-positive cus-right-btn',
            onTap: function(e) { }
          }
        ]
      });
      alertPopup.then(function(res) {
        $state.go("tabs.mall");
      });
    }

      $scope.test='mallfix';
      $scope.checkBlur=function(){
        if($scope.enableEdit==true){
          $scope.test='mallfix';
        }else{
          $scope.test='';
        }

      };
$scope.findBlur=function(){
    $scope.test='mallfix';
}


  });

