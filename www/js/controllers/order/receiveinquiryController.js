/**
 * Created by lijianhui on 2016/9/14.
 */
angular.module('starter.controllers')
//我收到的询盘
  .controller('ReceiveInquiryCtrl', function ($scope,$state, enquiryService, $controller,$rootScope,UserService,$ionicHistory, config) {
    $scope.theGoodsType = 0; //现货:0, 预售:1
    $scope.theShowStatus = 1; //现货:1, 预售:2
    var userInfo = {
      "TraderID":"",
      "FirmID":"",
      "GoodsType":$scope.theGoodsType,
      "QueryType":1,
      "PageIndex":1,
      "PageSize":10,
      "OrderBy":1,
      "SortDirect":1
    };
    $scope.doRefresh = function () {
      init();
    };
    function init() {
      $scope.listStatus = 0;//liststatus  0：没有框 1：有框
      $scope.list = [];
      userInfo = {
        "TraderID":"",
        "FirmID":"",
        "GoodsType":$scope.theGoodsType,
        "QueryType":1,
        "PageIndex":1,
        "PageSize":10,
        "OrderBy":1,
        "SortDirect":1
      };
      userInfo.FirmID = enquiryService.getUserInfo().FirmID;
      userInfo.TraderID = enquiryService.getUserInfo().TraderID;
      if(UserService.checkIsManager()){
        userInfo.QueryType = 1;  //管理员
      }else{
        userInfo.QueryType = 0;  //交易员
      }
      $scope.getList(userInfo, enquiryService.GetReceiveList);
    }
    $scope.$on('scroll.refreshComplete',function (ret,par){
      if($scope.list.length == 0){
        $scope.listStatus = 1;//liststatus  0：没有框 1：有框
      }else{
        $scope.listStatus = 0;//liststatus  0：没有框 1：有框
      }
    });

    $controller("baseCtrl", {$scope: $scope});
    //onCreate()
    $scope.$on('$ionicView.loaded', function () {

    });

    $scope.goQuiryDetail = function (item) {
      enquiryService.setObj(item);
      item.receiveShow = $scope.theShowStatus;
      $state.go("tabs.reinquiryDetail");
    };

    //onResume()
    $scope.$on('$ionicView.beforeEnter',function () {
      $rootScope.hideTabs = ' ';
      init();
    });

    $scope.doLoadMore = function () {
      $scope.getMoreData(userInfo, enquiryService.GetReceiveList);
    };

    $rootScope.$on('todo:ReceiveInquiryCtrl', function() {
      $scope.getList(userInfo, enquiryService.GetReceiveList);
    });

    $scope.goHistory=function(){
      $state.go("tabs.order");
    };
    //全部 预售 现货 选择
    $scope.Tabclass1="active";
    $scope.Tabclass2="";
    $scope.TabReceiveSpotClick=function () {
      $scope.Tabclass1="active";
      $scope.Tabclass2="";
      $scope.theGoodsType = 0;
      $scope.theShowStatus = 1;
      init();
    };
    $scope.TabReceivePreSaleClick=function () {
      $scope.Tabclass1="";
      $scope.Tabclass2="active";
      if (UserService.checkTradeTemplate(config.futureGoods)){
        $scope.theGoodsType = 1;
        $scope.theShowStatus = 2;
        init();
      }else{
        shcemUtil.showMsg("没有预售权限");
      }
    }


  })










    //我收到的询盘详情页
  .controller('ReinquiryDetailCtrl', function ($scope,$filter,enquiryService,shcemUtil, $rootScope,$state,$cordovaDialogs,
                                               $ionicPopup,$ionicHistory, mallDetailInfoService) {
    $scope.item = enquiryService.getObj();
    getReceiveDetailRequest($scope.item.LeadsID);
    enquiryService.GetInfo($scope.item)
      .then(function (ret) {
        $scope.item = enquiryService.mergeObj($scope.item, ret);
        $scope.item.QuantityAll = parseFloat((($scope.item.Quantity * $scope.item.TradeUnitNumber).toFixed(6)));
        $scope.item.MinQuantityAll = parseFloat((($scope.item.MinQuantity * $scope.item.TradeUnitNumber).toFixed(6)));
      }, function () {
        shcemUtil.showMsg("网络错误");
      });

    $rootScope.hideTabs = 'tabs-item-hide';
    $scope.goCancle = function () {
      $rootScope.$ionicGoBack();
    };

    $scope.goPay = function () {
      $cordovaDialogs.confirm("确定要成交吗?","提示",["取消","确定"])
        .then(function (buttonIndex) {
          if(buttonIndex == 2){
            if ($scope.item.Enquiry_Weight > $scope.item.NoDealtWeight){
              shcemUtil.showMsg("货物可售量不足");
              return;
            }else{
              shcemUtil.showLoading();
              enquiryService.ReceiveOrderDeal($scope.item)
                .then(function () {
                  $scope.item.FirmID = $scope.item.FirmId;
                  $scope.item.TmplID = 1;
                  $scope.item.CategoryID = $scope.item.CategoryLeafID;
                  $scope.item.TradeRole = 0;
                  $scope.item.goodsType = $scope.item.GoodsType;
                  enquiryService.GetAndCheckExpenses($scope.item)
                    .then(function (ret) {
                      $scope.item.UserBalance = ret.UserBalance;
                      shcemUtil.hideLoading();
                      showAlertSuccess();
                    }, function (error) {
                      shcemUtil.hideLoading();
                      shcemUtil.showMsg(error);
                    })

                }, function (error) {
                  shcemUtil.hideLoading();
                  shcemUtil.showMsg(error);
                });
            }

          }
        });
    };

    function showAlertSuccess() {
      // $scope.item.UserBalance =  $filter('currency:\'￥\'')($scope.item.UserBalance);
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-tip"><i class="ion-ios-checkmark-outline"></i><p>成交提交成功</p>' ,
        // template: '<div class="cus-dialog-tip"><i class="ion-ios-checkmark-outline"></i><p>成交成功</p>' +
        // '</div><div class="cus-dialog-text">' +
        //
        // '<p>当前资金账户余额 <span class="red-color">'+ '' + $scope.item.UserBalance+'</span>元</p></div>',
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
        $scope.$emit('todo:ReceiveInquiryCtrl');
        $state.go("tabs.receiveInquiry");
      });
    }
    $scope.goHistory=function(){
      $ionicHistory.goBack();
    };


    function getReceiveDetailRequest(leadid) {
      mallDetailInfoService.getMallDetailInfoData(leadid)
        .then(function (ret) {
          $scope.hmReceiveDetailList = ret;
        }, function (error) {
          shcemUtil.showMsg(error,1);
        }).finally(function () {
        shcemUtil.hideLoading();
      });
    }



  });






