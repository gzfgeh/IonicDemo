/**
 * Created by guzhenfu on 2016/7/26.
 */
angular.module('starter.controllers')
.controller('mainCtrl', function ($scope, $rootScope, $state, $ionicNavBarDelegate,$interval,
                                  $ionicSlideBoxDelegate,shcemUtil, mallService, infoService,infoDetailService,
                                  mainService, messageService,$ionicPopover,infoNewTradeService,UserService) {

  $scope.input = {searchKey:''};
  var tabTopIndex = 1;
  var CategorySpecialIds = [];
  var infoID = 0;
  var theTraderLimit;


  //onCreate()
  $scope.$on('$ionicView.loaded', function () {
    $scope.showLoading = true;
    //只能放在onCreate 里面
    mainService.getTopInforData()
      .then(function (ret) {
        $scope.infoList=[];
        $scope.infoList = ret;

        $ionicSlideBoxDelegate.$getByHandle('my-handle').update();
        $ionicSlideBoxDelegate.$getByHandle('my-handle').loop(true);

        $ionicSlideBoxDelegate.$getByHandle('my-handle').start();

      }, function (error) {
        shcemUtil.showMsg("网络错误");
      });

    getData(CategorySpecialIds);
    getDealList();
    mainService.getNoticeInfo()
      .then(function (ret) {
        $scope.noticeInfo = ret.InfoTitle;
        infoID = ret.ID;
      }, function (error) {
        shcemUtil.showMsg("网络错误");
      });

  });
  $scope.$on('$ionicView.afterEnter',function(){
    $ionicSlideBoxDelegate.$getByHandle('my-handle').next();
  });



  //公告滚动
  function roll(noticeWidth)
  {
    var containerWidth=window.innerWidth*0.85-22;

    var  test= "@-webkit-keyframes leftAnimate{0% {transform:translateX("+containerWidth+"px);-webkit-transform:translateX("+containerWidth+"px);}\n"+
        "100%{transform:translateX("+ noticeWidth + "px);-webkit-transform:translateX("+ noticeWidth +"px);}}";

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = test;
    document.getElementsByTagName('head')[0].appendChild(style);
    this.stylesheet = document.styleSheets[document.styleSheets.length-1];

    try {
      this.stylesheet.insertRule( rule , this.stylesheet.rules.length);
    } catch (e) {
    }
  }

  //onResume()
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = ' ';

    getData(CategorySpecialIds);
    getDealList();

    theTraderLimit=UserService.checkTradeLimits();//0：卖，1：买，2：全部，-1：没有任何权限

  });


  function getData(CategorySpecialIds) {
    mallService.getListData(1, '', 5, CategorySpecialIds)
      .then(function (ret) {
        $scope.mainList = ret;
      }, function (error) {

      }).finally(function () {
        $scope.$broadcast("scroll.refreshComplete");
        shcemUtil.hideLoading();
        $scope.showLoading = false;
    });
  }

  function getDealList(keywords) {
    infoNewTradeService.doNewTrade(5, keywords, 1)
      .then(function (ret) {
        $scope.mainSecondList = ret;
        $scope.showLoading = false;
      }, function (error) {
        $scope.showLoading = false;
      });
  }

  $scope.clickInforBox = function (index) {
    // if (mainService.getClickList()[index].indexOf("http") >= 0){
    //   window.open(mainService.getClickList()[index], '_blank');
    // }else{
    //   $state.go('tabs.top_detail', {infoID: mainService.getTopID()[index]});
    // }

  };


  $scope.girdClickOne = function () {
    $state.go("tabs.mall");
  };

  $scope.girdClickTwo = function () {
    infoService.setTopIndex(0);
    $state.go("tabs.info");
  };

  $scope.girdClickThree = function () {
    infoService.setTopIndex(3);
    $state.go("tabs.info");
  };

  $scope.girdClickFour = function () {
    infoService.setTopIndex(2);
    $state.go("tabs.info");
  };

  $scope.girdClickFive = function () {
    $state.go("tabs.order");
  };

  $scope.girdClickSix = function () {
    infoService.setTopIndex(2);
    $state.go("tabs.info");
  };

  $scope.girdClickSeven = function () {
    infoService.setTopIndex(4);
    $state.go("tabs.info");
  };
  $scope.girdClickMyInquiry = function () { //我的询盘
    if(!UserService.isAuthenticated()){
      $state.go("login");
    } else {
      if(theTraderLimit == 1 || theTraderLimit == 2) {
        $state.go("tabs.myInquiry");
      }else {
        shcemUtil.showMsg("只有买家才有权限查看,快拨打客服热线开通权限吧");
      }
    }
  };
  $scope.girdGetInquiry = function () { //收到的询盘
    if(!UserService.isAuthenticated()){
      $state.go("login");
    } else {
      if(theTraderLimit == 0 || theTraderLimit == 2) {
        $state.go("tabs.receiveInquiry");
      } else {
        shcemUtil.showMsg("只有卖家才有权限查看,快拨打客服热线开通权限吧");
      }
    }
  };
  $scope.girdDetailOfMoney = function () { //资金详情
    if(!UserService.isAuthenticated()){
      $state.go("login");
    } else {
      if(!UserService.checkIsTrader()){
        shcemUtil.showMsg("没有权限");
      }
      else{
        UserService.getUserInfo(function (token,ret) {
          $state.go("tabs.capitalDetail",{firmID:ret.FirmID});
        },function (err) {
          shcemUtil.showMsg(err);
        });
      }
    }
  };
  // $scope.girdClickEight = function () {
  //   $state.go("tabs.user");
  // };

  $scope.searchData = function () {
    switch(tabTopIndex){
      case 1:
        mallService.setKey($scope.input.searchKey);
        $state.go("tabs.mall");
            break;

      case 2:
        messageService.setKeyword($scope.input.searchKey);
        $state.go("tabs.order");
            break;

      case 3:
        $state.go("tabs.info");
            break;
    }

    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
    cordova.plugins.Keyboard.close();
  };


  //公告 跳转 资讯
  $scope.closeNotice=function() {
    $state.go('tabs.top_detail', {infoID: infoID});
  };

  //tab切换效果
  $scope.tabClass1="active";
  $scope.tab1Click=function()
  {
    $scope.tabClass1="active";
    $scope.tabClass2="";
    $scope.tabClass3="";
    $scope.tabClass4="";
    // shcemUtil.showLoading();
    $scope.showLoading = true;
    CategorySpecialIds = [];
    getData(CategorySpecialIds);
  };

  $scope.tab2Click=function()
  {
    $scope.tabClass1="";
    $scope.tabClass2="active";
    $scope.tabClass3="";
    $scope.tabClass4="";
    // shcemUtil.showLoading();
    $scope.showLoading = true;
    CategorySpecialIds = [];
    CategorySpecialIds.push(18);
    getData(CategorySpecialIds);
  };

  $scope.tab3Click=function()
  {
    $scope.tabClass1="";
    $scope.tabClass2="";
    $scope.tabClass3="active";
    $scope.tabClass4="";
    // shcemUtil.showLoading();
    $scope.showLoading = true;
    CategorySpecialIds = [];
    CategorySpecialIds.push(37);
    getData(CategorySpecialIds);
  };

  $scope.tab4Click=function()
  {
    $scope.tabClass1="";
    $scope.tabClass2="";
    $scope.tabClass3="";
    $scope.tabClass4="active";
    $state.go("tabs.mall");
  };

  //搜索类型切换  '<div class="type-name" ng-class="tabSecond" ng-click="tabChange(2);">交易</div>' +
  //            '<div class="type-name" ng-class="tabThird" ng-click="tabChange(3);">资讯</div>' +
  //类型选择
  var template = '<ion-popover-view class="cus-top-menu cus-search-menu">' +
      '   <ion-content>' +
      '<div class="type-name"  ng-class="tabFirst" ng-click="tabChange(1);">商城</div> ' +
      '   </ion-content>' +
      '</ion-popover-view>';

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });
  $scope.closePopover = function () {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.popover.remove();
  });

  $scope.typeName = "商城";
  $scope.tabFirst = 'active';
  $scope.tabSecond = '';
  $scope.tabThird = '';

  $scope.tabChange = function (index) {
    if (index == 1) {
      $scope.tabFirst = 'active';
      $scope.tabSecond = '';
      $scope.tabThird = '';
      $scope.typeName = "商城";
    }
    else if (index == 2) {
      $scope.tabFirst = '';
      $scope.tabSecond = 'active';
      $scope.tabThird = '';
      $scope.typeName = "交易";
    }
    else if (index == 3) {
      $scope.tabFirst = '';
      $scope.tabSecond = '';
      $scope.tabThird = 'active';
      $scope.typeName = "资讯";
    }
    tabTopIndex = index;
    $scope.closePopover();
  };


  $scope.gotoDetail = function(b) {
    b.showPercent = b.GoodsTypeShow == '预售'? true:false;
    mallService.setObj(b);
    $state.go("tabs.mainDetail");
  };


});
