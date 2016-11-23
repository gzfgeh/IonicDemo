/**
 * Created by chenguo on 2016/7/28.
 */
angular.module('starter.controllers')
  .controller('orderCtrl',function ($scope,$state,shcemUtil,UserService,UserProductService,enquiryService
                                    ,SellerService,BadgeService,Push,$rootScope,myDeliveryService) {
    var userInfo = {
      TraderID:"",
      FirmID: "",
      tradeType:2
    };

    $scope.$on('$ionicView.loaded',function () {

    });

    $scope.$on('$ionicView.beforeEnter',function () {
      $rootScope.hideTabs = ' ';
      if(!UserService.isAuthenticated()){
        $state.go('login');
        return;
      }
      initUI();
      loadData();
    });

    var loadData = function () {
      shcemUtil.showLoading();
      UserService.getUserInfo(function (token,data,msg) {
        shcemUtil.hideLoading();
        checkMsg();
        if(UserService.checkIsTrader(data)){
          $scope.isTrader = true;
        }
        if(UserService.checkIsManager(data)){
          $scope.isManager = true;
        }
        $scope.hasLogin = true;
        $scope.tradeType = UserService.checkTradeLimits(data);
        userInfo.tradeType = $scope.tradeType;
        userInfo.FirmID = data.FirmID;
        userInfo.TraderID = data.TraderID;
        userInfo.UserCode = data.UserCode;
        userInfo.paymentPwdStatus = data.HasPaymentPwd;
        enquiryService.setUserInfo(userInfo);
        getMoneyCount(data);
        getUnreadCount(data);
      },function (errMsg,code) {
        shcemUtil.hideLoading();
        shcemUtil.showMsg("获取用户信息失败");
        $scope.hasLogin = false;
        UserService.checkToken(code);
      });
    };

    $scope.doRefresh = function () {
        loadData();
    };
    var checkMsg = function () {
      var c = BadgeService.notificationInfo.minePage.length;
      if(c > 0){
        $scope.hasPoint = true;
      }
    };
    var initUI = function () {
      $scope.tradeType = UserService.checkTradeLimits();
      $scope.isManager = false;
      $scope.isTrader = false;
      $scope.moneyCount = UserProductService.USERBALANCEFromOra();
      $scope.hasLogin = UserService.isAuthenticated();
      $rootScope.hideTabs = ' ';
      $scope.hasPoint = false;
    };
    var getMoneyCount = function (data) {
      UserProductService.getMoneyCount(data.FirmID,function (ret) {
        $scope.moneyCount = ret.DATA.USERBALANCEFromOra;
      //  console.log(ret);
        $scope.$broadcast('scroll.refreshComplete');
      },function (err) {
      //  console.log(err);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    var getUnreadCount = function (data) {
      BadgeService.getTraderUnreadCount(data.TraderID,function (ret) {
        $scope.EnquiryCount = ret.EnquiryCount; //询盘数量
        $scope.NeedArrivalCount = ret.NeedArrivalCount;//到达数量,什么鬼
        $scope.NeedDeliveryCount = ret.NeedDeliveryCount;//交付数量
        $scope.NeedPayCount = ret.NeedPayCount;
        $scope.NeedShortCount = ret.NeedShortCount;
        $scope.NeedSignCount = ret.NeedSignCount;
        $scope.$broadcast('scroll.refreshComplete');
      },function (err) {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.clickPanel =function (disable,index) {
      if(!disable){
        switch (index){
          case 0:
            //收到的询盘
            $state.go("tabs.receiveInquiry");
            break;
          case 1:
            //待发到货通知
            var tradeType = {
              textSelect:"卖家",
              GoodsType:1,
              Tabclass1:"",
              Tabclass2:"active",
              type:$scope.tradeType
            };
            enquiryService.setTradeStatusSel(-2);
            enquiryService.setTradeType(tradeType);
            $state.go("tabs.mytrade");
            break;
          //待确认溢短
          case 2:
            myDeliveryService.setIstrack(true);
            $state.go("tabs.mysettlement");
            break;
          case 3:
            //待支付
            var tradeType = {
              textSelect:"买家",
              GoodsType:0,
              Tabclass1:"active",
              Tabclass2:""
            };
            enquiryService.setTradeType(tradeType);
            enquiryService.setTradeStatusSel(1);
            $state.go("tabs.mytrade");
            break;
          case 4:
            //待申请交收
            enquiryService.setTradeStatusSel(5);
            $state.go("tabs.mytrade");
            break;
          case 5:
            //待签收
            var tradeStatus = [15,35];
            enquiryService.setTradeStatusSel(tradeStatus);
            $state.go("tabs.mytrade");
            break;
          case 6://我的卖盘
            $state.go("tabs.mySellorder");
            break;
          case 7://我的成交
            var tradeType = {
              textSelect:"买家",
              GoodsType:0,
              Tabclass1:"active",
              Tabclass2:""
            };
            enquiryService.setTradeType(tradeType);
            enquiryService.setTradeStatusSel("");
            $state.go("tabs.mytrade");
            break;
          case 8://我的交收
            $state.go("tabs.mysettlement");
            break;
          case 9://我的询盘
            $state.go("tabs.myInquiry");
            break;
          case 10://我收到的询盘
            $state.go("tabs.receiveInquiry");
            break;
          case 11://资金详情
            $state.go("tabs.capitalDetail", {firmID:userInfo.FirmID});
            break;
        }
      }else{
        if(!UserService.isAuthenticated()){
          shcemUtil.showMsg("用户未登录");
          return;
        }
        switch ($scope.tradeType){
          case -1:
            shcemUtil.showMsg("没有权限");
            break;
          case 0:
            shcemUtil.showMsg("只有买家才有权限查看");
            break;
          case 1:
            shcemUtil.showMsg("只有卖家才有权限查看");
            break;
        }
      }
    };
    $scope.msgClicked = function () {
      BadgeService.notificationInfo.minePage = [];
      Push.setApplicationIconBadgeNumber(0);//清除应用图标上的数字
      Push.setBadge(0);//向服务器发送清除应用图标的标志。
      if(UserService.isAuthenticated()){
        $state.go("tabs.tradeNewsList");
      }else{
        shcemUtil.showMsg("请登录后查看");
      }
    };
    $scope.clickOrder = function (disable) {
      if(!disable){
        enquiryService.setTradeStatusSel("");
        $state.go("tabs.mytrade");
      }else{
        switch ($scope.tradeType){
          case -1:
            shcemUtil.showMsg("没有权限");
            break;
          case 0:
            shcemUtil.showMsg("只有买家才有权限查看");
            break;
          case 1:
            shcemUtil.showMsg("只有卖家才有权限查看");
            break;
        }
      }
    }
  });
