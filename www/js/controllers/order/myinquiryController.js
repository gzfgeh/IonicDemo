/**
 * Created by lijianhui on 2016/9/14.
 */


angular.module('starter.controllers')
    //我的询盘
    .controller('MyInquiryCtrl', function ($scope,$state, enquiryService,shcemUtil,$rootScope,$controller,UserService,$ionicHistory, config) {
      $scope.myGoodsType = 0;   //全部:-1, 现货:0, 预售:1
      $scope.theShowStatus = 1; //现货:1, 预售:2
      var inquiryObj = {
        "TraderID":"021565609","FirmID":"0219898","GoodsType":$scope.myGoodsType,
        "CategoryLeafID":-1,"BrandID":-1,"IsAnonymity":-1,"LeadsStatus":-1,
        "KeyWords":"","QueryType":1,"PageIndex":1, "RowCount":0,"OrderBy":1
      };

      $controller("baseCtrl", {$scope: $scope});

      //onCreate()
      $scope.$on('$ionicView.loaded',function () {

      });
      //onResume()
      $scope.$on('$ionicView.beforeEnter',function () {
        $rootScope.hideTabs = ' ';
        init();
      });

      $scope.doRefresh = function () {
        init();
      };
      function init() {
        $scope.listStatus = 0;
         $scope.list = [];
        inquiryObj = {
          "TraderID":"021565609","FirmID":"0219898","GoodsType":$scope.myGoodsType,
          "CategoryLeafID":-1,"BrandID":-1,"IsAnonymity":-1,"LeadsStatus":-1,
          "KeyWords":"","QueryType":1,"PageIndex":1, "RowCount":0,"OrderBy":1
        };
        $scope.queryType = 0; //管理员
          var userInfo = enquiryService.getUserInfo();
          inquiryObj.TraderID = userInfo.TraderID;
          inquiryObj.FirmID = userInfo.FirmID;
          if(UserService.checkIsManager()){
            inquiryObj.QueryType = 1;  //管理员
            $scope.queryType = 0; //管理员
          }else{
            inquiryObj.QueryType = 0;  //交易员
            $scope.queryType = 1; //管理员
          }
          $scope.getList(inquiryObj, enquiryService.GetList);
      }
      $scope.$on('scroll.refreshComplete',function (ret,par){
        console.log("刷新完成");
        if($scope.list.length == 0){
           $scope.listStatus = 1;//liststatus  0：没有框 1：有框
        }else{
           $scope.listStatus = 0;//liststatus  0：没有框 1：有框
        }
      });



      $scope.goMyInquiryDetail = function (item) {
        enquiryService.setObj(item);
        item.inquiryDetailShowStatus = $scope.theShowStatus;
        $state.go("tabs.inquiryDetail");
      };

      $scope.doLoadMore = function () {
        $scope.getMoreData(inquiryObj, enquiryService.GetList);
      };

      $rootScope.$on('todo:MyInquiryCtrl', function() {
        $scope.getList(inquiryObj, enquiryService.GetList);
      });

      $scope.goBack=function(){
        $state.go("tabs.order");
      };
      //全部 预售 现货
      $scope.Tabclass1="active";
      $scope.Tabclass2="";
      $scope.TabMySpotClick=function () { //现货
        $scope.Tabclass1="active";
        $scope.Tabclass2="";
        $scope.myGoodsType = 0;
        $scope.theShowStatus = 1;
        init();
      };
      $scope.TabMyPreSaleClick=function () { //预售
        $scope.Tabclass1="";
        $scope.Tabclass2="active";
        if (UserService.checkTradeTemplate(config.futureGoods)){
          $scope.myGoodsType = 1;
          $scope.theShowStatus = 2;
          init();
        }else{
          shcemUtil.showMsg("没有预售权限");
        }
      };

    })




  //我的询盘详情页
  .controller('InquiryDetailCtrl', function ($scope,$state,enquiryService,$rootScope,shcemUtil, mallDetailInfoService) {
    var inquiryObj = {
      "enquiryID":'',
      "userCode":''
    };
    //onCreate()
    $scope.$on('$ionicView.loaded',function () {
      $scope.item = enquiryService.getObj();
      getInquiryDetailRequest($scope.item.LeadsID);
      $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.goBack = function () {
      $rootScope.$ionicGoBack();
    };

    $scope.cancleInquiry = function () {
      inquiryObj.enquiryID = $scope.item.Enquiry_ID;
      inquiryObj.userCode = $scope.item.userCode;
      if (inquiryObj.userCode == undefined){
        inquiryObj.userCode = enquiryService.getUserInfo().UserCode;
      }

      shcemUtil.showLoading();
      enquiryService.CancelEnquiry(inquiryObj)
        .then(function () {
          shcemUtil.hideLoading();
          shcemUtil.showMsg("撤销成功");
          $scope.$emit('todo:MyInquiryCtrl');
          $state.go("tabs.myInquiry");
        }, function (error) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg("网络错误 " + error);
        });
    };


    function getInquiryDetailRequest(leadid) {
      mallDetailInfoService.getMallDetailInfoData(leadid)
        .then(function (ret) {
          $scope.hmInquiryDetailList = ret;
        }, function (error) {
          shcemUtil.showMsg(error,1);
        }).finally(function () {
        shcemUtil.hideLoading();
      });
    }




  });



