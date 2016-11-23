/**
 * Created by lijianhui on 2016/9/13.
 */


angular.module('starter.controllers')
.controller('MyTradeCtrl', function ($scope,$state,enquiryService,shcemUtil,$rootScope,$controller,UserService,config) {
      var sellObj ={"TraderID":"","FirmID":"","CategoryLeafID":-1,"BrandID":-1,
                      "TradeStatus":[],"KeyWords":"", "GoodsType":0,"QueryType":11,
                      "PageIndex":1,"OrderBy":"REC_CREATETIME","OrderByDirection":"Desc"};

      $scope.userInfo = {};
      var type = 0;
      $scope.queryType = 0; //管理员
      $controller("baseCtrl", {$scope: $scope});

      function init(){
        $scope.onClickedFirstTap = enquiryService.getUserInfo().tradeType == 0 ? true : false;
        type = $scope.onClickedFirstTap ? 0 : 1;
        $scope.Tabclass1=enquiryService.getTradeType().Tabclass1;
        $scope.Tabclass2=enquiryService.getTradeType().Tabclass2;
        $scope.Tabclass3="";
        $scope.textSelect=enquiryService.getTradeType().textSelect;
        sellObj.GoodsType = enquiryService.getTradeType().GoodsType;
        sellObj.TradeStatus = enquiryService.getTradeStatusSel();

        $scope.userInfo = enquiryService.getUserInfo();
        sellObj.TraderID = $scope.userInfo.TraderID;
        sellObj.FirmID = $scope.userInfo.FirmID;

        //直接进入预售
        if (sellObj.GoodsType == 1){
          $scope.tabClick(true);
        }

        //待进  正常进
        if (enquiryService.getTradeStatusSel() != ""){
          $scope.isShowOrderType = false;
        }else{
          $scope.isShowOrderType = true;
          type = $scope.userInfo.tradeType;
          if (type != 2){     //只是卖家或者买家
            $scope.isShowOrderType = false;
          }
        }

      }

      //我是卖/买家切换
      $scope.selectState="hide"
      $scope.showState=function () {
       if($scope.selectState=="hide"){
         $scope.selectState="show"

       }else{
         $scope.selectState="hide"
       }
      }


      $scope.tabClick=function(num){
          if($scope.userInfo.tradeType==0 && !num){
            shcemUtil.showMsg("没有权限");
            return;
          }

          if ($scope.userInfo.tradeType==1 && num){
            shcemUtil.showMsg("没有权限");
            return;
          }

          if ($scope.onClickedFirstTap != num){
            if (num){ //卖家
              $scope.textSelect="卖家"
              $scope.selectState="hide"
              if(UserService.checkIsManager()){
                sellObj.QueryType = 2;  //管理员
                $scope.queryType = 0;
              }else{
                sellObj.QueryType = 1;  //交易员
                $scope.queryType = 1;
              }
              type = 0;
            }else{    //买家
              $scope.textSelect="买家"
              $scope.selectState="hide"
              if(UserService.checkIsManager()){
                sellObj.QueryType = 12;  //管理员
                $scope.queryType = 0;
              }else{
                sellObj.QueryType = 11;  //交易员
                $scope.queryType = 1;
              }
              type = 1;
            }
            $scope.getList(sellObj, enquiryService.getOfferList[type]);
            $scope.onClickedFirstTap = num;
          }else{
            $scope.selectState="hide"
          }
      };

      //onCreate()
      $scope.$on('$ionicView.loaded',function () {
        init();
      });


      //onResume()
      $scope.$on('$ionicView.beforeEnter',function () {
        $rootScope.hideTabs = ' ';
        $scope.userInfo = enquiryService.getUserInfo();
        sellObj.TraderID = $scope.userInfo.TraderID;
        sellObj.FirmID = $scope.userInfo.FirmID;

        if (sellObj.GoodsType == 0){

          if (type ==0){ //卖家
            if(UserService.checkIsManager()){
              sellObj.QueryType = 2;  //管理员
              $scope.queryType = 0;
            }else{
              sellObj.QueryType = 1;  //交易员
              $scope.queryType = 1;
            }
          }else{    //买家
            if(UserService.checkIsManager()){
              sellObj.QueryType = 12;  //管理员
              $scope.queryType = 0;
            }else{
              sellObj.QueryType = 11;  //交易员
              $scope.queryType = 1;
            }
          }

          $scope.getList(sellObj, enquiryService.getOfferList[type]);
        }

      });
      $scope.doRefresh = function () {
          $scope.getList(sellObj, enquiryService.getOfferList[type]);
      }


      $scope.goMySellOfferDetail = function (item) {
        item.type = type;
        enquiryService.setObj(item);
        $state.go("tabs.tradeDetail", {FirmID:sellObj.FirmID,TraderID:sellObj.TraderID});
      }

      $scope.doLoadMore = function () {
        $scope.getMoreData(sellObj, enquiryService.getOfferList[type]);
      };

      $rootScope.$on('todo:MyTradeCtrl', function() {
        $scope.getList(sellObj, enquiryService.getOfferList[type]);
      });


      $scope.goBack = function () {
        $state.go("tabs.order");
      }
      //全部 预售 现货 选择

      //现货
      $scope.TaboneClick=function () {
        $scope.Tabclass1="active";
        $scope.Tabclass2=""
        $scope.Tabclass3=""

        sellObj.GoodsType = 0;
        $scope.getList(sellObj, enquiryService.getOfferList[type]);
      };
      //预售
      $scope.TabtwoClick=function () {
        $scope.Tabclass1="";
        $scope.Tabclass2="active"
        $scope.Tabclass3=""

        if (UserService.checkTradeTemplate(config.futureGoods)){
          sellObj.GoodsType = 1;
          $scope.getList(sellObj, enquiryService.getOfferList[type]);
        }else{
          shcemUtil.showMsg("没有预售权限");
        }

      }
      $scope.TabthreeClick=function () {
        $scope.Tabclass1="";
        $scope.Tabclass2=""
        $scope.Tabclass3="active"
        sellObj.GoodsType = -1;
        $scope.getList(sellObj, enquiryService.getOfferList[type]);
      }

    })

.controller('ordertradectr', function ($scope,$state,$stateParams,enquiryService,$rootScope,shcemUtil,config,UserService,receiptService,$ionicPopup) {
  //onCreate()
  $scope.$on('$ionicView.loaded',function () {
  });

  //onResume()
  $scope.$on('$ionicView.beforeEnter',function () {
    $rootScope.keyboardHide="hide";
    $rootScope.hideTabs = 'tabs-item-hide';

    $scope.item = enquiryService.getObj();
    // $scope.item.BreakProFee = parseFloat($scope.item.BreakProFee*100) + "%";
    $scope.item.FirmID = $stateParams.FirmID;
    $scope.item.TraderID = $stateParams.TraderID;
    if ($scope.item.GoodsType == 0){
      $scope.isShowPreGoods = false;
    }else{
      $scope.isShowPreGoods = true;
    }



    enquiryService.GetOrderDetailInfo($scope.item.OrderId)
      .then(function(data) {
        $scope.item = enquiryService.mergeObj($scope.item, data);
        $scope.item.QuantityAll = parseFloat(($scope.item.Quantity * $scope.item.TradeUnitNumber).toFixed(6));
        $scope.item.MinQuantityAll = parseFloat(($scope.item.MinQuantity * $scope.item.TradeUnitNumber).toFixed(6));
        enquiryService.GetReceiptFileList($scope.item)
          .then(function (fileIds) {
            if (fileIds.length != 0){
              var picAddrList = [];
              fileIds.forEach(function(each){
                var src = config.downloadUrl + each;
                receiptService.GetFileInfo(each)
                  .then(function (ret) {
                    var reg = /^.+\.pdf$/i; //pdf文件
                    if (ret.length > 0 && reg.test(ret[0])) {
                      src = "img/pdf.png";
                    }

                    var picAddrObj = {
                      href:config.downloadUrl + each,
                      src:src
                    }

                    picAddrList.push(picAddrObj);

                  }, function(error){
                    //shcemUtil.showMsg(error);
                  })
              });
              $scope.picAddr = picAddrList;
            }
          }, function (error) {

          })


      }, function(msg) {
        shcemUtil.showMsg(msg);
      });


      for(var i=0; i<$scope.item.ButtonList.length; i++){
          if (($scope.item.ButtonList[i].Name=="生成下载" || $scope.item.ButtonList[i].Name=="转货权")) {
              $scope.item.ButtonList.splice(i,1);
          }
      }

    $scope.isBreak = false;
    $scope.isLook = false;
    $scope.isOther = false;
      $scope.isDownLoad = false;

    var buttonList = [];
    if ($scope.item.ButtonList.length == 0){            //只有取消或者 取消和查看 按钮
        if ( $scope.item.ReceiptList !=undefined && $scope.item.ReceiptList.length > 0) {
            $scope.isLook = true;
            $scope.lookClass = "red-bg-font";
            $scope.cancleBtnClass = "";
        }else{
            $scope.cancleBtnClass = "red-bg-font";
        }
    }else if ($scope.item.ButtonList.length == 1){      //有取消和其他一个按钮
      if ($scope.item.ButtonList[0].Name == "我要违约"){
        $scope.isBreak = true;
        $scope.breakClass = "button-light";
      }else{
        $scope.isOther = true;
        $scope.otherClass = "red-bg-font";
        $scope.btnThree = $scope.item.ButtonList[0].Name;
      }
    }else if($scope.item.ButtonList.length == 2){       //三个按钮
      $scope.isBreak = true;
      $scope.breakClass = "dark-gray";

      //如果有查看
      if ( $scope.item.ReceiptList !=undefined && $scope.item.ReceiptList.length > 0) {
        $scope.isLook = true;
        $scope.lookClass = "red-bg-font";
      }else{
        $scope.isLook = false;
        $scope.isOther = true;
        $scope.otherClass = "red-bg-font";

      }

        $scope.item.ButtonList.forEach(function(each) {
            if (!(each.Name=="我要违约"|| each.Name=="转货权")) {
                $scope.btnThree = each.Name;
                if (each.Name == "提交签收"){
                    $scope.isDownLoad = true;
                }else if (each.Name == "自提交收"){
                  $scope.btnThree = "提报交收";
                }
            }
        });


    }else{
      $scope.isBreak = true;
      $scope.breakClass = "darken-gray";

      $scope.isLook = true;
      $scope.lookClass = "dark-gray";

      $scope.isOther = true;
      $scope.otherClass = "red-bg-font";
      $scope.item.ButtonList.forEach(function(each) {
        if (!(each.Name=="我要违约" || each.Name=="转货权")) {
          $scope.btnThree = each.Name;
            if (each.Name == "提交签收"){
                $scope.isDownLoad = true;
            }else if (each.Name == "自提交收"){
              $scope.btnThree = "提报交收";
            }
        }
      });
    }

  });

  //我要违约 点击事件
  $scope.breakClick = function () {
    $scope.item.ButtonList.forEach(function(each) {
      if (each.Name=="我要违约") {
        enquiryService.setObj($scope.item);
        var tradeRole = enquiryService.getUserInfo().tradeType;  //卖家0， 买家1
        $state.go("tabs.tradeBreak",{OrderID:$scope.item.OrderId, QueryType:$scope.item.QueryType, ButtonID:each.ID, TradeRole:tradeRole});
        // shcemUtil.showMsg("请去网站处理！");

      }
    });
  };

  //我要违约 点击事件
  $scope.lookClick = function () {
      $scope.item.picAddr = $scope.picAddr;
      enquiryService.setObj($scope.item);
      $state.go("tabs.tradeSignatureDetail");

  };

    //生成下载
    $scope.goDownLoad = function(){
        //弹框提醒
        var alertPopup = $ionicPopup.alert({
            template: '请至上海化交官网下载，谢谢。',
            okText: '确定'
        });
        alertPopup.then(function(res) {

        });
    }

  $scope.goNext=function(){
    $scope.item.ButtonList.forEach(function(each) {

      switch (each.Name){
        case "支付货款":
          if (!shcemUtil.getIsCanPay()){
            return;
          }
          shcemUtil.showLoading();
          enquiryService.GetOrderInfo($scope.item.OrderId)
            .then(function (ret) {
              $scope.item.TmplID = ret.TradeTmptId;
              $scope.item.CategoryID = ret.CategoryLeafID;
              $scope.item.BrandID = ret.BrandID;
              $scope.item.Price = ret.Price;
              $scope.item.Quantity = ret.TradeNumber;
              $scope.item.TradeUnitNumber = ret.TradeUnitNumber;
              $scope.item.goodsType = ret.GoodsType;
              $scope.item.TradeRole = 1;

              enquiryService.GetAndCheckExpenses($scope.item)
                .then(function (data) {
                  //$scope.item = Object.assign(data, $scope.item);
                  $scope.item = enquiryService.mergeObj($scope.item, data);
                  $scope.item.HasCoupon = false;
                  shcemUtil.hideLoading();
                  enquiryService.setObj($scope.item);
                  $state.go("tabs.tradePay");
                }, function (error) {
                  shcemUtil.hideLoading();
                  shcemUtil.showMsg(error);
                })
            }, function (error) {
              shcemUtil.hideLoading();
              shcemUtil.showMsg(error);
            });

          break;
        case "自提交收":
          $state.go("tabs.tradeTake",{OrderID:$scope.item.OrderId, FirmID:$scope.item.FirmID, ButtonID:each.ID});
          break;

        case "转货权":
          //$state.go("tabs.tradeTurn");
          break;

        case "提交签收":
          enquiryService.setObj($scope.item);
          $state.go("tabs.tradeSignature");
          break;

          case "生成下载":
              //弹框提醒
              var alertPopup = $ionicPopup.alert({
                  template: '请至上海化交官网下载，谢谢。',
                  okText: '确定'
              });
              alertPopup.then(function(res) {
                  console.log('Thank you for not eating my delicious ice cream cone');
              });
              break;

        case "提货通知":
          //弹框提醒
          //     var confirmPopup=$ionicPopup.confirm({
          //       title:'敬告',
          //       template:
          //       '<div>尊敬的客户，请确认货物已到库且随时提醒，否则会承担违约责任。</div>',
          //       cancelText:'取消',
          //       okType:'color:"#333";',
          //       okText:'确定',
          //       okType:'button-positive'
          //     });
          // confirmPopup.then(function(res) {
          //   if(res) {
          //     console.log('You are sure');
          //   } else {
          //     console.log('You are not sure');
          //   }
          // });
          var myPopup = $ionicPopup.show({
            template: '<div class="cus-dialog-head">敬告</div>'+'<div class="cus-dialog-body">尊敬的客户，请确认货物已到库且随时可提，否则会承担违约责任。</div>',
            // title: '敬告',
            scope: $scope,
            buttons: [
              { text: '取消' },
              {
                text: '<b>确认</b>',
                type: 'button-positive',
                onTap: function(e) {


                  $scope.item.ButtonID = each.ID;
                  $scope.item.UserCode = enquiryService.getUserInfo().UserCode;
                  shcemUtil.showLoading();
                  enquiryService.UpdateSellArrivalTime($scope.item)
                    .then(function () {
                      shcemUtil.hideLoading();
                      var myPopop=$ionicPopup.show({
                        template: '<i class="ion-android-checkmark-circle red-color" style="font-size: 25px;"></i>'+'<div class="cus-dialog-body red-color" >已经发送提货通知</div>',
                        scope: $scope,
                        buttons:[
                          { text: '确定' ,
                            type: 'button-positive',
                            onTap: function(e){
                              shcemUtil.showMsg("通知成功");
                              $scope.$emit('todo:MyTradeCtrl');
                              $state.go("tabs.mytrade");
                            }
                          }
                        ]
                      })

                    }, function (error) {
                      shcemUtil.hideLoading();
                      shcemUtil.showMsg(error);
                    })
                }
              },
            ]
          });
          myPopup.then(function(res) {
            console.log('Tapped!', res);
          });
              break;
      }

    })

  }

  // $scope.goNext=function(name,id){
  //   switch (name){
  //     case "支付货款":
  //           shcemUtil.showLoading();
  //           enquiryService.GetOrderInfo($scope.item.OrderId)
  //           .then(function (ret) {
  //             $scope.item.TmplID = ret.TradeTmptId;
  //             $scope.item.CategoryID = ret.CategoryLeafID;
  //             $scope.item.BrandID = ret.BrandID;
  //             $scope.item.Price = ret.Price;
  //             $scope.item.Quantity = ret.TradeNumber;
  //             $scope.item.TradeUnitNumber = ret.TradeUnitNumber;
  //             $scope.item.goodsType = ret.GoodsType;
  //             $scope.item.TradeRole = 1;
  //
  //             enquiryService.GetAndCheckExpenses($scope.item)
  //               .then(function (data) {
  //                 //$scope.item = Object.assign(data, $scope.item);
  //                 $scope.item = enquiryService.mergeObj($scope.item, data);
  //                 $scope.item.HasCoupon = false;
  //                 shcemUtil.hideLoading();
  //                 enquiryService.setObj($scope.item);
  //                 $state.go("tabs.tradePay");
  //               }, function (error) {
  //                 shcemUtil.hideLoading();
  //                 shcemUtil.showMsg(error);
  //               })
  //           }, function (error) {
  //             shcemUtil.hideLoading();
  //             shcemUtil.showMsg(error);
  //           });
  //
  //           break;
  //
  //     case "自提交收":
  //           $state.go("tabs.tradeTake",{OrderID:$scope.item.OrderId, FirmID:$scope.item.FirmID, ButtonID:id});
  //           break;
  //
  //     case "我要违约":
  //           var tradeRole = enquiryService.getUserInfo().tradeType;  //卖家0， 买家1
  //           $state.go("tabs.tradeBreak",{OrderID:$scope.item.OrderId, QueryType:$scope.item.QueryType, ButtonID:id, TradeRole:tradeRole});
  //           break;
  //
  //     case "转货权":
  //           $state.go("tabs.tradeTurn");
  //           break;
  //
  //     case "提交签收":
  //           enquiryService.setObj($scope.item);
  //           $state.go("tabs.tradeSignature");
  //           break;
  //
  //     case "查看":
  //       //查看签收
  //       $scope.item.picAddr = $scope.picAddr;
  //       enquiryService.setObj($scope.item);
  //       $state.go("tabs.tradeSignatureDetail");
  //       break;
  //   }
  // }


  $scope.goBack = function () {
    $scope.$emit('todo:MyTradeCtrl');
    $state.go("tabs.mytrade");
  };


  $scope.clickPic = function (index) {
    shcemUtil.showMsg("点击 " + index);
  }

});
