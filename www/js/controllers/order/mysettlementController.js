/**
 * Created by lijianhui on 2016/9/14.
 */

//我的交收
angular.module('starter.controllers')
    .controller('MySettlementCtrl', function ($scope,$state,UserService,myDeliveryService,shcemUtil,$rootScope,config) {

      //我是卖/买家切换
      $scope.selectState="show"
      $scope.showState=function () {
        if($scope.selectState=="hide"){
          $scope.selectState="show";

        }else{
          $scope.selectState="hide"
        }
      }

      var traderid;
      var firmid;
      var isTrader;
      var isManager;
      var traderLimits;
      var isflag;
      var isTradeTemplate;//是否有预售权限
      $scope.$on('$ionicView.beforeEnter',function () {
        isTrader=UserService.checkIsTrader();
        isManager=UserService.checkIsManager();
        isTradeTemplate=UserService.checkTradeTemplate(config.futureGoods);
        $scope.ismanager=UserService.checkIsManager();
        isflag=myDeliveryService.getIstrack();
        traderLimits=UserService.checkTradeLimits();//0：卖，1：买，2：全部，-1：没有任何权限
          UserService.getUserInfo(function (token,data,msg) {
            traderid = data.TraderID;
            firmid=data.FirmID;
            if (isflag){
              $scope.tabClick(true,false);
              myDeliveryService.setIstrack(false);
            }
            else if (traderLimits==2){
              $scope.isdisplayButton = true;
              $scope.tabClick($scope.onClickedFirstTap,false);
            }else if (traderLimits==0){
              $scope.isdisplayButton = false;
              $scope.tabClick(true,false);

            }else if(traderLimits==1){
              $scope.isdisplayButton = false;
              $scope.tabClick(false,false);

            }


          },function (errMsg,code) {

          })
      });
      $scope.showBlank=false;
      $scope.pageIndex=1;





        $scope.tabClick=function(num,isloadMore){
          $scope.showBlank=false;
          //卖家
          if (num){
            $scope.textSelect="卖家"
            $scope.selectState="hide"
            $scope.isdisyushou=false;
            $scope.subheader="nosubheader"
            if (traderLimits==-1||traderLimits==1){

              shcemUtil.showMsg("没有权限");
            }

           else if (traderLimits==0||traderLimits==2){
              if ($scope.onClickedFirstTap != num){
                $scope.onClickedFirstTap = num;
              }
              $scope.onClickedFirstTap = num;
              // $scope.moreData=true;
              if (!isloadMore) {
                shcemUtil.showLoading();

                if (isTrader && isManager) {
                      myDeliveryService.getDeliveryList(1, traderid, firmid, 32, 40,0)
                        .then(function (ret) {
                          shcemUtil.hideLoading();

                          $scope.moreData=isLoaderM(ret);

                          if (ret == undefined || ret.length == 0) {
                            $scope.showBlank = true;
                          }
                          $scope.myDeliveryList = ret;
                        }, function (err) {
                          shcemUtil.hideLoading();

                          $scope.myDeliveryList =null;
                          $scope.showBlank = true;
                        }).finally(function () {
                        $scope.$broadcast("scroll.refreshComplete");
                        $scope.pageIndex=1;
                      })
                    }
                    else if (isTrader) {
                      myDeliveryService.getDeliveryList(1, traderid, firmid, 31, 40,0)
                        .then(function (ret) {
                          shcemUtil.hideLoading();

                          $scope.moreData=isLoaderM(ret);

                          if (ret == undefined || ret.length == 0) {
                            $scope.showBlank = true;
                          }
                          $scope.myDeliveryList = ret;
                        }, function (err) {
                          shcemUtil.hideLoading();

                          $scope.myDeliveryList =null;
                          $scope.showBlank = true;
                        }).finally(function () {
                        $scope.$broadcast("scroll.refreshComplete");
                        $scope.pageIndex=1;
                      })
                    }
              }
              else {
                        //上拉加载
                $scope.pageIndex++;
                        if (isTrader && isManager) {
                          myDeliveryService.getDeliveryList($scope.pageIndex, traderid, firmid, 32, 40,0)
                            .then(function (ret) {
                              $scope.moreData=isLoaderM(ret);
                              if(ret!=undefined&&ret.length>0)
                              {$scope.myDeliveryList = $scope.myDeliveryList.concat(ret);}
                            }, function (err) {
                            }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                          })
                        }
                        else if (isTrader) {
                          myDeliveryService.getDeliveryList($scope.pageIndex, traderid, firmid, 31, 40,0)
                            .then(function (ret) {
                              $scope.moreData=isLoaderM(ret);

                              if(ret!=undefined&&ret.length>0)
                              {$scope.myDeliveryList = $scope.myDeliveryList.concat(ret);}
                            }, function (err) {
                            }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                          })
                        }
              }
            }

          }
          //买家
          else {

            $scope.textSelect="买家"
            $scope.selectState="hide"
            $scope.isdisyushou=true;
            if (traderLimits==-1||traderLimits==0){
              shcemUtil.showMsg("没有权限");
            }
            else if (traderLimits==1||traderLimits==2){
              if ($scope.onClickedFirstTap != num){
                $scope.onClickedFirstTap = num;
              }
              $scope.onClickedFirstTap = num;
              if (!isloadMore) {
                shcemUtil.showLoading();

                if (isTrader && isManager) {
                  myDeliveryService.getDeliveryList(1, traderid, firmid, 22, null,$scope.goodstype)
                    .then(function (ret) {
                      shcemUtil.hideLoading();
                      $scope.moreData=isLoaderM(ret);

                      if (ret == undefined || ret.length == 0) {
                        $scope.showBlank = true;
                      }
                      $scope.myDeliveryList = ret;

                    }, function (err) {
                      shcemUtil.hideLoading();
                      $scope.myDeliveryList = null;
                      $scope.showBlank = true;
                    }).finally(function () {
                    $scope.$broadcast("scroll.refreshComplete");
                    $scope.pageIndex=1;

                  })
                }
                else if (isTrader) {
                  myDeliveryService.getDeliveryList(1, traderid, firmid, 21, null,$scope.goodstype)
                    .then(function (ret) {
                      shcemUtil.hideLoading();
                      $scope.moreData=isLoaderM(ret);

                      if (ret == undefined || ret.length == 0) {
                        $scope.showBlank = true;
                      }
                      $scope.myDeliveryList = ret;

                    }, function (err) {
                      shcemUtil.hideLoading();
                      $scope.myDeliveryList = null;
                      $scope.showBlank = true;
                    }).finally(function () {
                    $scope.$broadcast("scroll.refreshComplete");
                    $scope.pageIndex=1;
                  })
                }
              }
              else {
                //上拉加载
                $scope.pageIndex++;
                if (isTrader && isManager) {
                  myDeliveryService.getDeliveryList($scope.pageIndex, traderid, firmid, 22, null,$scope.goodstype)
                    .then(function (ret) {
                      $scope.moreData=isLoaderM(ret);

                      if(ret!=undefined&&ret.length>0)
                      {$scope.myDeliveryList = $scope.myDeliveryList.concat(ret);}
                    }, function (err) {
                    }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  })
                }
                else if (isTrader) {
                  myDeliveryService.getDeliveryList($scope.pageIndex, traderid, firmid, 21, null,$scope.goodstype)
                    .then(function (ret) {
                      $scope.moreData=isLoaderM(ret);

                      if(ret!=undefined&&ret.length>0)
                      {$scope.myDeliveryList = $scope.myDeliveryList.concat(ret);}
                    }, function (err) {
                    }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  })
                }
              }
            }

          }

        };
        $scope.goDetail=function (item) {
          myDeliveryService.setObj(item);
          // myDeliveryService.setIstrack(false);
          $state.go('tabs.settlementDetail');
        }

      $scope.doRefresh = function () {
        $scope.moreData=false;
        this.tabClick($scope.onClickedFirstTap,false);

      }
      $scope.doLoadMore=function () {
        $scope.tabClick($scope.onClickedFirstTap,true);
      }

      //判断是否需要再上拉加载
      function isLoaderM(ret) {
        if (ret==undefined||ret<10){
          return false;
        }else {
          return true;
        }
      }

        $scope.goBack=function(){
            $rootScope.$ionicGoBack();
        }
      //全部 预售 现货 选择
      $scope.Tabclass1="active";
      $scope.Tabclass2=""
      $scope.Tabclass3=""
      $scope.goodstype=0;
      $scope.TaboneClick=function () {
        $scope.Tabclass1="active";
        $scope.Tabclass2=""
        $scope.Tabclass3=""
        $scope.goodstype=0;
        this.tabClick($scope.onClickedFirstTap,false);
      }
      $scope.TabtwoClick=function () {
        if (isTradeTemplate){
          $scope.Tabclass1="";
          $scope.Tabclass2="active"
          $scope.Tabclass3=""
          $scope.goodstype=1;
          this.tabClick($scope.onClickedFirstTap,false);
        }else {
          shcemUtil.showMsg("没有权限");
        }

      }
      $scope.TabthreeClick=function () {
        $scope.Tabclass1="";
        $scope.Tabclass2=""
        $scope.Tabclass3="active"
      }
    })









    //交收详情
    .controller('SettlementDetailCtrl', function ($scope,$state,UserService,myDeliveryService,shcemUtil,$rootScope, $controller) {
      $controller("baseCtrl", {$scope: $scope});
      var traderid;
      var firmid;
      var usercode;
        $scope.$on('$ionicView.beforeEnter',function () {
            $rootScope.hideTabs = 'tabs-item-hide';
          UserService.getUserInfo(function (token,data,msg) {
            traderid = data.TraderID;
            firmid=data.FirmID;
            usercode=data.UserCode;
          },function (errMsg,code) {

          })
          $scope.itemDetail=myDeliveryService.getObj();
          if ($scope.itemDetail.DeliveryStatus==40){
            $scope.isShow=true;
          }else {
            $scope.isShow=false;
          }
        });
      $scope.affirmMoreOrFew=function (id) {
        myDeliveryService.affirmMoreOrFew(traderid,firmid,usercode,id)
          .then(function (ret) {
            shcemUtil.showMsg(ret.INFO);
            $state.go("tabs.mysettlement");
          },function (err) {

          });
      }
        $scope.goOrder=function(){
            // $state.go("tabs.sellorderDetail")
        };

        $scope.goTake=function(){
            // $state.go("tabs.tradeTake")
        }
        //$scope.goBack=function(){
        //    $rootScope.$ionicGoBack();
        //}

    })


