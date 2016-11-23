
angular.module('starter.controllers')
  .controller('mallOrderCtrl', function ($scope,$state, mallService, $ionicPopup,shcemUtil,mallCreateEnquiryService,mallDetailInfoService,
                                         mallCheckExpenseService, mallOrderLeadService,UserProductService,UserService,$ionicScrollDelegate) {

    $scope.Boxselect=function () {
      if($scope.boxchecked==true){
        $scope.boxchecked=false;
      }else{
        $scope.boxchecked=true;
      }
    }

    //下单
    $scope.$on('$ionicView.beforeEnter',function () {
      document.getElementById("readRheckboxId").checked = false;
      $scope.mallOrderObj = mallService.getObj();
      showOrder(false, true, false);

      if ($scope.mallInquiryObj.TradeUnitNumber.toString().split(".").length>1){
        $scope.pointLength = $scope.mallInquiryObj.TradeUnitNumber.toString().split(".")[1].length;
      }else {
        $scope.pointLength = 0;
      }

      $scope.mallUserObj = mallCreateEnquiryService.getUserObj();
      shcemUtil.showLoading();
      getMallDetailRequest($scope.mallOrderObj.ID);
      $scope.enableEdit = false;
      $scope.deal.orderCount = '';
    });
    $scope.deal = angular.copy({});

    function showOrder(price, next, submit) {
      $scope.showOrderPrice = price;
      $scope.showOrderNext = next;
      $scope.showOrderSubmit = submit;
    }

    $scope.goNext = function () {
      $scope.boxchecked = false;
      document.getElementById("readRheckboxId").checked = false;
      if($scope.deal.orderCount&&$scope.deal.orderCount>0&&$scope.deal.orderCount%1===0){
        if($scope.deal.orderCount*$scope.mallOrderObj.TradeUnitNumber<=$scope.theCouldSall && $scope.deal.orderCount*$scope.mallOrderObj.TradeUnitNumber>=$scope.theMinSall){
          shcemUtil.showLoading();
          $scope.enableEdit = true;
          showOrder(true, false, true);
          getMoneyRequest($scope.hmDetailList.BrandID, $scope.deal.orderCount, $scope.mallOrderObj.Price, $scope.hmDetailList.CategoryLeafID,
            $scope.hmDetailList.TradeUnitNumber, $scope.hmDetailList.GoodsType, $scope.hmDetailList.FirmID,$scope.hmDetailList.ID);
        } else {
          shcemUtil.showMsg("数量需大于等于最小交收量且小于卖盘剩余数量");
        }
      } else {
        shcemUtil.showMsg("请输入正整数成交数量");
      }
      var weight = $scope.deal.orderCount*$scope.mallOrderObj.TradeUnitNumber;
      $scope.theWeight = parseFloat(weight.toFixed(6));
      var money = $scope.mallOrderObj.Price * $scope.deal.orderCount*$scope.mallOrderObj.TradeUnitNumber;
      $scope.theMoney = parseFloat(money.toFixed(2));
    };
    $scope.goBefore = function () {
      showOrder(false, true, false);
      $scope.enableEdit = false;
    };
    $scope.goSubmit = function () {

      if($scope.boxchecked==true){
        shcemUtil.showLoading();
        getOrderRequest($scope.mallUserObj[2],$scope.deal.orderCount, $scope.mallOrderObj.Price, $scope.mallUserObj[0], $scope.mallOrderObj.ID,
          $scope.hmPriceList.TwoDecimalDeposit, $scope.mallUserObj[1]);
      }else {
        ischeckedshow();
      }
    };


    function getMallDetailRequest(leadid) {
      mallDetailInfoService.getMallDetailInfoData(leadid)
        .then(function (ret) {
          $scope.hmDetailList = ret;
          $scope.theCouldSall = $scope.hmDetailList.ResidualWeight;    //可售量
          $scope.theMinSall = $scope.hmDetailList.MinQuantity*$scope.hmDetailList.TradeUnitNumber ;  //最小交收量
        }, function (error) {
          shcemUtil.showMsg(error);
        }).finally(function () {
        shcemUtil.hideLoading();
      })
    }

    function getMoneyRequest(BrandID, Quantity, Price,CategoryID, TradeUnitNumber, goodsType, FirmID ,leadID) {
      mallCheckExpenseService.getMallCheckExpenseData(BrandID, Quantity, Price, CategoryID,TradeUnitNumber, goodsType, FirmID,leadID )
        .then(function (ret) {
          $scope.hmPriceList = ret;
          getUserMoneyRequest();
        }, function (error) {
          shcemUtil.showMsg(error);
        }).finally(function () {
        shcemUtil.hideLoading();
      })
    }

    function getOrderRequest(UserCode,Quantity,Price,TraderID,LeadsID,DepositAmount,FirmID) {
      mallOrderLeadService.getMallOrderLeadsData(UserCode,Quantity,Price,TraderID,LeadsID,DepositAmount,FirmID)
        .then(function (ret) {
          var success = "操作成功。";
          if(ret == success){
            getMoneyRequest($scope.hmDetailList.BrandID, $scope.deal.orderCount, $scope.mallOrderObj.Price, $scope.hmDetailList.CategoryLeafID,
              $scope.hmDetailList.TradeUnitNumber, $scope.hmDetailList.GoodsType, $scope.hmDetailList.FirmID,$scope.hmDetailList.ID);
              UserProductService.getMoneyCount(UserService.getUserInfoFromCache().FirmID,function (ret) {
                $scope.hmPriceList.UserBalance = UserProductService.USERBALANCEFromOra();
                showAlertSuccess();
              },function (err) {

              });

            if($scope.hmPriceList.UserBalance == 0){
              shcemUtil.showMsg("账户余额获取失败,请稍后再试");
            }
          } else {
            showAlertFail(ret);
          }
        },function (error) {
          showAlertFail(error);
        }).finally(function () {
        shcemUtil.hideLoading();
      })
    }


    function ischeckedshow() {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="inquiry-title">敬告</div>'+'<div class="inquiry-body">请确认已阅读并同意《'+$scope.mallOrderObj.GoodsTypeShow+'交易规则》</div>',
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

    function getUserMoneyRequest() {
        UserProductService.getMoneyCount(UserService.getUserInfoFromCache().FirmID,function (ret) {
          $scope.hmPriceList.UserBalance = UserProductService.USERBALANCEFromOra();
        },function (err) {
        });
      if($scope.hmPriceList.UserBalance == 0){
        shcemUtil.showMsg("账户余额获取失败,请稍后再试");
      }
    }


    function showAlertSuccess() {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-tip"><i class="ion-ios-checkmark-outline"></i><p>下单成功</p>' +
        '</div><div class="cus-dialog-text"><p>扣款总金额 <span class="red-color">'+$scope.hmPriceList.Deposit.toFixed(2)+'</span>元</p>' +
        '<p>保证金金额 <span class="red-color">'+$scope.hmPriceList.Deposit.toFixed(2)+'</span>元</p>' +
        '<p>当前资金账户余额<span class="red-color">' + $scope.hmPriceList.FormatTotalBalance+'</span>元</p></div>',
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
        template: '<div class="cus-dialog-main"><p>'+news+'</p></div>',
        buttons: [
          {
            text: '关闭',
            type: 'button-positive cus-right-btn',
            onTap: function(e) { }
          }
        ]
      });
      alertPopup.then(function(res) {
        $state.go("tabs.mall");
      });
    }
 $scope.test="mallfix"

$scope.checkBlur=function(){
$scope.test="";
}
      $scope.findBlur=function(){
          $scope.test="mallfix"
      }


  });
