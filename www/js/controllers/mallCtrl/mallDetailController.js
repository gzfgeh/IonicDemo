
angular.module('starter.controllers')
  .controller('mallDetailCtrl', function ($scope, $rootScope, $controller, mallService,$state, UserService, shcemUtil,$ionicPopup,
                                          mallCreateEnquiryService, mallDetailInfoService,$ionicHistory) {
    /**
     * 引入baseCtrl，加入公共操作的部分
     */
    $controller("baseCtrl", {$scope: $scope});

    $scope.$on('$ionicView.beforeEnter',function () {
      $scope.mallObj = mallService.getObj();
      getMallDetailRequest($scope.mallObj.ID);
      shcemUtil.showLoading();
      $scope.buyerShow = false;
      $scope.successPhone = false;


      if($scope.mallObj.LeadsStatusShow == '有效'){
        $scope.buyerShow = true;
        $scope.successPhone = false;
      } else {
        $scope.successPhone = true;
        $scope.buyerShow = false;
      }
      if($scope.mallObj.SettlementMethodShow == '中石化现货配送'){
        alertBackShow("该盘为中石化配送盘<br/>相关操作请登陆网站www.shcem.com");
      }
      $scope.goHistory=function(){
        $state.go("tabs.mall");
      };
      initUI();
      UserService.getUserInfo(function (token,data,msg) {
        $scope.user = [];
        $scope.user.push(data.TraderID);
        $scope.user.push(data.FirmID);
        $scope.user.push(data.UserCode);
        mallCreateEnquiryService.setUserObj($scope.user);
        $scope.mallUserCode = data.UserCode;
        if(UserService.checkIsTrader(data)){
          $scope.isTrader = true;
        }
        if(UserService.checkIsManager(data)){
          $scope.isManager = true;
        }
        $scope.hasLogin = true;
        $scope.tradeType = UserService.checkTradeLimits(data);
      },function (errMsg,code) {
        $scope.hasLogin = false;
        UserService.checkToken(code);
      })
    });

    var initUI = function () {
      $scope.tradeType = -1;//3 没有权限, 0 卖, 1 买,  2 全部     //检查买卖权限 0:卖 1:买  2: 全部 -1:没有任何权限
      $scope.isManager = false;
      $scope.isTrader = false;
      $scope.moneyCount = 0;
      $scope.hasLogin = true;
    };


    //询盘
    $scope.goInquiry=function(){
      if(!UserService.isAuthenticated()){
        alertLoginShow("请登录,再进行相关操作<br/>登录获取详细信息");
        return;
      }
      // if($scope.mallUserCode == $scope.hmDetailList.UserCode){
      //   alertShow("很抱歉<br/>不能对自己发布的报盘进行操作");
      //   return;
      // }
      if (!shcemUtil.getIsCanPay()){
        return;
      }
      switch ($scope.tradeType){
        case -1:
          alertShow("很抱歉，您尚未绑定企业<br/>不能进行相关操作");
          break;
        case 0:
          alertShow("很抱歉，您所在的企业<br/>还未开通购买权限");
          break;
        case 1:
          $state.go("tabs.mallInquiry");
          break;
        case 2:
          $state.go("tabs.mallInquiry");
          break;
      }

    };
    //订单
    $scope.goOrder=function(){
      if(!UserService.isAuthenticated()){
        alertLoginShow("请登录,再进行相关操作<br/>登录获取详细信息")
        return;
      }
      // if($scope.mallUserCode == $scope.hmDetailList.UserCode){
      //   alertShow("很抱歉<br/>不能对自己发布的报盘进行操作");
      //   return;
      // }
      if (!shcemUtil.getIsCanPay()){
        return;
      }
      switch ($scope.tradeType){
        case -1:
          alertShow("很抱歉，您尚未绑定企业<br/>不能进行相关操作");
          break;
        case 0:
          alertShow("很抱歉，您所在的企业<br/>还未开通购买权限");
          break;
        case 1:
          $state.go("tabs.mallOrder");
          break;
        case 2:
          $state.go("tabs.mallOrder");
          break;
      }
    };

    $scope.goPhone = function (e) {
      $scope.stopBubble(e);
    };


    function getMallDetailRequest(leadid) {
      mallDetailInfoService.getMallDetailInfoData(leadid)
        .then(function (ret) {
          $scope.hmDetailList = ret;
          if($scope.mallUserCode == $scope.hmDetailList.UserCode){
            $scope.successPhone = true;
            $scope.buyerShow = false;
          }
        }, function (error) {
          alertLoginShow("请登录,再进行相关操作<br/>登录获取详细信息");
        }).finally(function () {
        shcemUtil.hideLoading();
      });
    }


    function alertShow(news) {
       var alertPopup = $ionicPopup.alert({
         template: '<div class="cus-dialog-main">'+news+'</p></div>',
         buttons: [{
           text: '确定',
           type: 'button-positive cus-right-btn',
           onTap: function(e) {
           }
         }]
       });
       alertPopup.then(function(res) {
       });
    }

    function alertLoginShow(loginNews) {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-main">'+loginNews+'</p></div>',
        buttons: [{
          text: '稍后再说',
          type: 'button-positive cus-left-btn',
          onTap: function(e) {
          }
        },{
          text: '确定',
          type: 'button-positive cus-right-btn',
          onTap: function(e) {
            $state.go("login");
          }
        }]

      });
      alertPopup.then(function(res) {
      });
    }

    function alertBackShow(news) {
      var alertPopup = $ionicPopup.alert({
        template: '<div class="cus-dialog-main">'+news+'</p></div>',
        buttons: [{
          text: '确定',
          type: 'button-positive cus-right-btn',
          onTap: function(e) {
            $state.go("tabs.mall");
          }
        }]
      });
      alertPopup.then(function(res) {
      });
    }





  });
