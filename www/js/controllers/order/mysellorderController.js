/**
 * Created by lijianhui on 2016/9/19.
 */
angular.module('starter.controllers')
//我的卖盘列表页面

.controller('MySellorderCtrl',function ($scope,UserService,$state,SellerService,shcemUtil,$rootScope, config, $timeout) {
  $scope.$on("$ionicView.beforeEnter",function () {
    $scope.theGoodsType = 0;//现货：0 预售：1
    $scope.theTradeTmpId = 1;
    $scope.initData();
    getList();
  });
  $scope.initData = function () {
    $scope.currentPage = 1;
    $scope.hasData = true;
    $scope.tryTitle = "";
    $scope.listData = [];
    $scope.needShow = false;
    $scope.currentIndex = 1;
    $scope.queryType = 0; //管理员
    $scope.theShowStatus = 1;  //卖盘状态 0-全部,1-现货,2-预售
  };
  $scope.$on("$ionicView.enter",function () {
    $rootScope.hideTabs = ' ';
  });
  $scope.doRefresh = function () {
    $scope.initData();
    getList();
  };

  function getList() {
    shcemUtil.showLoading();
    var data = UserService.getUserInfoFromCache();
    var info = {};
    info.TraderID = data.TraderID;
    info.FirmID = data.FirmID;
    info.Direction = 0;
    info.GoodsType = $scope.theGoodsType;
    info.CategoryLeafID = -1;
    info.BrandID = -1;
    info.IsAnonymity = -1;
    info.LeadsStatus = -1;
    info.KeyWords = "";
    info.TradeTmptId = $scope.theTradeTmpId;
    if(UserService.checkIsManager()){
      info.QueryType = 1;  //管理员
      $scope.queryType = 0; //管理员
    }else{
      info.QueryType = 0;  //交易员
      $scope.queryType = 1; //管理员
    }
    info.PageIndex = $scope.currentIndex;
    info.PageSize = 10;
    SellerService.getSellList(info, function (ret) {
      shcemUtil.hideLoading();
      $scope.listData = $scope.listData.concat(ret);

      $scope.$broadcast('scroll.refreshComplete');
      if($scope.listData.length == 0){
        $scope.tryTitle = "暂无数据";
        $scope.hasData = false;
        $scope.$broadcast('scroll.infiniteScrollComplete',{"status":false,'msg':"暂无数据"});
        return;
      }
      if($scope.listData.length % 10 != 0 || ret.length == 0){//全部数据加载完毕了
        $scope.hasData = true;
        $scope.$broadcast('scroll.infiniteScrollComplete',{"status":false,'msg':"全部加载完成"});//no more data
        return;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete',{"status":true,'msg':"ok"});//
    }, function (err) {
      if($scope.listData.length == 0){
        $scope.hasData = false;
      }else{
        $scope.hasData = true;
      }
      $scope.$broadcast('scroll.refreshComplete');
      $scope.tryTitle = "加载失败,点击重试";
      shcemUtil.hideLoading();
      $scope.$broadcast('scroll.infiniteScrollComplete',{"status":false,'msg':"点击重试"});
    })
  }
  $scope.$on('scroll.infiniteScrollComplete',function (ret,par){
   // console.log("完成");
    if(par.status){
        $scope.currentIndex++;
        $scope.listStatus = true;
    }else{
      $scope.listStatus = false;
        $scope.needShow = false;
    }
  });
  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
      if($scope.listStatus){
        $scope.needShow = true;
      }else{
        $scope.needShow = false;
      }
   //   console.log("哈哈，列表加载完成了 "+ ngRepeatFinishedEvent);
  });

  $scope.doLoadMore = function () {
    getList();
  };

  $scope.goDetail = function (item) {
    item.firstIn = true;
    item.theDetailShowStatus = $scope.theShowStatus;
    SellerService.setObj(item);
    $state.go("tabs.sellorderDetail");
  };

  $rootScope.$on('todo:MySellorderCtrl', function() {
    $scope.initData();
    getList();
  });

  $scope.goBack = function () {
      $state.go("tabs.order");
  };


  //全部 预售 现货 选择
  $scope.Tabclass1="active";
  $scope.Tabclass2="";
  $scope.TabSpotClick=function(){
    $scope.Tabclass1="active";
    $scope.Tabclass2="";
    $scope.theGoodsType = 0;
    $scope.theTradeTmpId = 1;
    $scope.initData();
    $scope.theShowStatus = 1;
    getList();
  };
  $scope.TabPreSaleClick=function(){
    $scope.Tabclass1="";
    $scope.Tabclass2="active";

    if (UserService.checkTradeTemplate(config.futureGoods)){
      $scope.theGoodsType = 1;
      $scope.theTradeTmpId = 3;
      $scope.initData();
      $scope.theShowStatus = 2;
      getList();
    }else{
      shcemUtil.showMsg("没有预售权限");
    }

  };



})

//我的卖盘详情页面
.controller('sellorderDetailCtrl',function ($scope,$state, $ionicPopup, SellerService,
                                                $rootScope, enquiryService,shcemUtil,EditPriceService, mallDetailInfoService) {
  var residualQuantityTmp = 0, minPiTmp = 0, priceTmp = 0;
  var watch, watch1;

  //onResume()
  $scope.$on('$ionicView.beforeEnter',function () {
    $scope.item = SellerService.getObj();
    getMallDetailRequest($scope.item.ID);
    $rootScope.hideTabs = 'tabs-item-hide';

    if($scope.item.FormatLeadsStatus == "有效"){
      $scope.item.cancle = false;
    }else{
      $scope.item.cancle = true;
    }

    $scope.item.minPi = parseFloat((($scope.item.MinWeight) / ($scope.item.TradeUnitNumber)).toFixed(6));
    //第一次进来
    if ($scope.item.firstIn) {
      minPiTmp = $scope.item.minPi;
      residualQuantityTmp = $scope.item.ResidualQuantity;
      priceTmp = $scope.item.Price;
    }

    //添加input监听事件
    watch = $scope.$watch('item.minPi', function (newValue, oldValue, scope) {
      $scope.item.MinWeight = parseFloat(($scope.item.minPi * $scope.item.TradeUnitNumber).toFixed(6));
    });

    watch1 = $scope.$watch('item.ResidualQuantity', function (newValue, oldValue, scope) {
      $scope.item.ResidualWeight = parseFloat(($scope.item.ResidualQuantity * $scope.item.TradeUnitNumber).toFixed(6));
    })


  });

  function getMallDetailRequest(leadid) {
    mallDetailInfoService.getMallDetailInfoData(leadid)
      .then(function (ret) {
        $scope.hmSellDetailList = ret;
        $scope.item.FormatExtraLogisticsCost = $scope.hmSellDetailList.FormatExtraLogisticsCost;
        if($scope.item.theDetailShowStatus && $scope.item.theDetailShowStatus != 1){
          $scope.item.FormatDeliveryStartDate = $scope.hmSellDetailList.FormatDeliveryStartDate;
          $scope.item.FormatDeliveryEndDate = $scope.hmSellDetailList.FormatDeliveryEndDate;
          $scope.item.FormatDepositRate = $scope.hmSellDetailList.FormatDepositRate;
        }
      }, function (error) {
        alertLoginShow("请登录,再进行相关操作<br/>登录获取详细信息");
      }).finally(function () {
      shcemUtil.hideLoading();
    });
  }


  $scope.goSubmit = function () {
    var alertPopup = $ionicPopup.alert({
      template:
        '<div class="cus-dialog-text"><p red-color>确定撤销卖盘</p>',
      buttons: [
        {
          text: '取消',
          type: 'cus-dialog-btn1',
          onTap: function(e) {

          }
        },
        {
          text: '确定',
          type: 'button-positive cus-dialog-btn2',
          onTap: function(e) {
            shcemUtil.showLoading();
            $scope.item.leadsID = $scope.item.ID;
            enquiryService.CancelLeads($scope.item)
              .then(function () {

              }, function (error) {
                shcemUtil.showMsg(error);
              })
              .finally(function () {
                shcemUtil.hideLoading();
                $scope.$emit('todo:MySellorderCtrl');
                $state.go("tabs.mySellorder");
              })
          }
        }
      ]
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.goEdit = function () {
    $scope.item.showInput = true;
  };


  $scope.test='sectionchange';
  $scope.checkBlur=function(){
    $scope.test='';
  };
  $scope.findBlur=function(){
    $scope.test='sectionchange';
  };


  $scope.goSure = function () {
    if ((($scope.item.minPi + "").indexOf(".") >= 0)
      || (($scope.item.Price+ "").indexOf(".") >= 0)
      || (($scope.item.ResidualQuantity+ "").indexOf(".") >= 0)){
      shcemUtil.showMsg("请输入正整数");
      return;
    }


    //如果没有修改
    if ((residualQuantityTmp == $scope.item.ResidualQuantity) &&
      (minPiTmp == $scope.item.minPi) &&
      (priceTmp == $scope.item.Price)){
      $ionicPopup.alert({
        template:
          '<div class="cus-dialog-text"><p red-color>没有任何修改</p>',
        buttons: [
          {
            text: '确定',
            type: 'button-positive cus-dialog-btn2'
          }
        ]
      });
      return;
    }


    EditPriceService.getcheckAuthByTraderID($scope.item)
      .then(function () {

        EditPriceService.getLeadsPriceCheck($scope.item)
          .then(function (ret) {
            if (ret == 0){
              $ionicPopup.alert({
                template:
                  '<div class="cus-dialog-text"><p red-color>当前价格超出30日平均价格上下10%，是否继续发盘？</p>',
                buttons: [
                  {
                    text: '取消',
                    type: 'cus-dialog-btn1',
                    onTap: function(e) {

                    }
                  },
                  {
                    text: '确定',
                    type: 'button-positive cus-dialog-btn2',
                    onTap: function(e) {
                      $scope.item.MinWeight = parseFloat(($scope.item.minPi * $scope.item.TradeUnitNumber).toFixed(6));
                      $scope.item.ResidualWeight = parseFloat(($scope.item.ResidualQuantity * $scope.item.TradeUnitNumber).toFixed(6));
                      enquiryService.setObj($scope.item);
                      $state.go("tabs.changeInquiry");
                    }
                  }
                ]
              });
            }else{
              watch();
              watch1();
              enquiryService.setObj($scope.item);
              $state.go("tabs.changeInquiry");
            }


          }, function (error) {
            shcemUtil.showMsg(error);
          })


      }, function () {
        shcemUtil.showMsg("没有买卖权限");
      });
  };


  $scope.goBack = function () {
    $scope.item.showInput = false;
    if ((residualQuantityTmp == $scope.item.ResidualQuantity) &&
      (minPiTmp == $scope.item.minPi) &&
      (priceTmp == $scope.item.Price)){
      $rootScope.$ionicGoBack();
    }else{
      $scope.$emit('todo:MySellorderCtrl');
      $state.go("tabs.mySellorder");
    }
    watch();
    watch1();

  }

})








//修改卖盘页面
.controller('changeInquiryCtrl',function ($scope,$state, $ionicPopup,
                                              $rootScope, enquiryService,shcemUtil) {

  //onResume()
  $scope.$on('$ionicView.beforeEnter',function () {
      $scope.item = enquiryService.getObj();
      $rootScope.hideTabs = 'tabs-item-hide';
      $scope.finishAll = false;
      $scope.item.firstIn = false;
      $scope.item.TmplID = $scope.item.TradeTmptId;
      $scope.item.CategoryID = $scope.item.CategoryLeafID;
      $scope.item.TradeRole = 1;
      $scope.item.goodsType = $scope.item.GoodsType;
      $scope.item.Quantity = $scope.item.ResidualQuantity;
    enquiryService.GetAndCheckEditLeadsExpenses($scope.item)
        .then(function (ret) {
          $scope.item = enquiryService.mergeObj($scope.item, ret);

        }, function (error) {
        });
    });


    $scope.goBack = function () {
      $rootScope.$ionicGoBack();
    };

  $scope.goFinish = function () {
    $scope.item.showInput = false;
    $scope.$emit('todo:MySellorderCtrl');
    $state.go("tabs.mySellorder");
  };

  $scope.goRelease = function () {
    shcemUtil.showLoading();
    enquiryService.ModifyLeads($scope.item)
      .then(function () {

        enquiryService.queryOneFirmBanlance($scope.item)
          .then(function (ret) {
            $scope.item = enquiryService.mergeObj($scope.item, ret);

            shcemUtil.hideLoading();
            shcemUtil.showMsg("修改成功");
            $scope.finishAll = true;

          }, function (error) {
            shcemUtil.showMsg(error);
          })



      }, function (error) {
        shcemUtil.hideLoading();
        shcemUtil.showMsg(error);
      });
  };
  $scope.test="sectionchange";
  $scope.checkBlur=function(){
    $scope.test="";
  };
  $scope.findBlur=function(){
    $scope.test="sectionchange";
  };
  $scope.checkPosition=function(e){

  }

  });



