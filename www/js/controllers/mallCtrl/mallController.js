/**
 * Created by guzhenfu on 2016/7/26.
 */
angular.module('starter.controllers')
  .controller('mallCtrl', function ($scope, $controller, $state, $rootScope, $ionicNavBarDelegate,
                                    mallService, shcemUtil,$ionicModal,$ionicScrollDelegate) {
    var pageIndex = 2;              //页数
    $scope.moreData = false;
    $scope.input = {searchKey:''};
    $scope.classifyList = [];
    var sortKey = [], sourcePlaceKey = [], deliveryKey = [];
    var OrderBy = "1", SortDirect = 1, LeadsStatus = [];
    $scope.showBlank = false;     //隐藏空白

    /**
     * 继承baseCtrl，加入公共操作的部分
     */
    $controller("baseCtrl", {$scope: $scope});

    function getData(pageIndex, searchData, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus) {
      mallService.getListData(pageIndex, searchData, 10, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus)
        .then(function (ret) {
          if (ret.length == 0){
            $scope.moreData = false;
            $scope.showBlank = true;
          }else{
            $scope.mallList=mallService.getNewMallList(ret);
            if (ret.length < 10)
              $scope.moreData = false;
            else
              $scope.moreData = true;
            $scope.showBlank = false;
          }
        }, function (error) {
          shcemUtil.showMsg("网络错误");
        }).finally(function () {
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$broadcast('scroll.infiniteScrollComplete');
        shcemUtil.hideLoading();
      })
    }

    //onCreate()
    $scope.$on('$ionicView.loaded', function () {
      $scope.showBlank = false;     //隐藏空白
      $rootScope.hideTabs = ' ';    //显示底层

      shcemUtil.readFile("data.json")
        .then(function (ret) {
          //分类
          $scope.classifyList = ret.category;
          for (var i=0; i<$scope.classifyList.length; i++){
            $scope.classifyList[i].checked = false;
          }
          //排序
          $scope.sortList = ret.sortType;
          for (var i=0; i<$scope.sortList.length; i++){
            $scope.sortList[i].checked = false;
          }
          //发货地
          $scope.letterList=[];
          $scope.placeList = ret.sourcePlace;
          for (var i=0; i<$scope.placeList.length; i++){
            for (var j=0; j<$scope.placeList[i].data.length; j++){
              $scope.placeList[i].data.checked = false;
            }
            var placeLetterObj={};
            placeLetterObj.value=$scope.placeList[i].name;
            if(i==0) {
              placeLetterObj.class="active";
            } else {
              placeLetterObj.class="";
            }
            $scope.letterList.push(placeLetterObj);
          }

          $scope.selectPlace=function() {
            $scope.modal.show();
            var letterObj=document.getElementsByClassName("cus-place-title");
            for(var i=0;i<letterObj.length;i++) {
              $scope.letterList[i].top=letterObj[i].offsetTop;
            }
            mallService.IdToKeyArray($scope.placeList, sourcePlaceKey);
          };
          $scope.scrollToLetter=function(top,index)
          {
            for(var i=0;i<$scope.letterList.length;i++)
            {
              $scope.letterList[i].class="";
            }
            $scope.letterList[index].class="active";
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,top,true);
          };


          //交货地
          $scope.letterDeliveryList=[];
          $scope.deliveryPlaceList = ret.deliveryPlace;
          for (var i=0; i<$scope.deliveryPlaceList.length; i++){
            for (var j=0; j<$scope.deliveryPlaceList[i].data.length; j++){
              $scope.deliveryPlaceList[i].data.checked = false;
            }

            var placeLetterObj={};
            placeLetterObj.value=$scope.deliveryPlaceList[i].name;
            if(i==0) {
              placeLetterObj.class="active";
            } else {
              placeLetterObj.class="";
            }
            $scope.letterDeliveryList.push(placeLetterObj);
          }

          $scope.selectDeliveryPlace=function() {
            $scope.modalDelivery.show();
            var letterObj=document.getElementsByClassName("cus-delivery-title");
            for(var i=0;i<letterObj.length;i++) {
              $scope.letterDeliveryList[i].top=letterObj[i].offsetTop;
            }
            mallService.IdToKeyArray($scope.deliveryPlaceList, deliveryKey);

          };
          $scope.scrollToDeliveryLetter=function(top,index) {
            for(var i=0;i<$scope.letterDeliveryList.length;i++)
            {
              $scope.letterDeliveryList[i].class="";
            }
            $scope.letterDeliveryList[index].class="active";
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,top,true);
          };
          
          //状态选择
          $scope.stateList=ret.stateType;
          for(var i=0;i<$scope.stateList.length;i++){
            $scope.stateList[i].checked = false;
          }
        }, function () {
          shcemUtil.showMsg("读取文件错误");
        });

    });

    $scope.$on('$ionicView.beforeEnter', function () {
      shcemUtil.showLoading();
      $scope.input.searchKey = mallService.getKey();
      getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      $rootScope.hideTabs = ' ';    //显示底层
    });



    $scope.doRefresh = function () {
      pageIndex = 1;
      $scope.moreData = false;
      getData(pageIndex, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      pageIndex = 2;
    };

    $scope.gotoDetail = function(b) {
      b.showPercent = b.GoodsTypeShow == '预售'? true:false;
      mallService.setObj(b);
      $state.go("tabs.mallDetail");
    };

    $scope.searchData = function () {
      shcemUtil.showLoading();
      mallService.setKey($scope.input.searchKey);
      getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      pageIndex = 2;
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.Keyboard.close();
    };

    //商城分类选择
    // $scope.classifyClick=function(index) {
    //   // for(var i=0;i<$scope.classifyList.length;i++) {
    //   //   $scope.classifyList[i].checked=false;
    //   // }
    //   $scope.classifyList[index].checked=true;
    //
    //   $scope.menuClass1="active";
    //   // shcemUtil.showLoading();
    //   sortKey.length = 0;
    //   if(index != index-1)
    //     sortKey.push($scope.classifyList[index].valueId);
    //   getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
    // };
$scope.classbocClick=function (index) {
  var arr=[];
  if($scope.classifyList[index].name=='全部'){
    if ($scope.classifyList[index].checked==true){
      for(var i=0;i<$scope.classifyList.length;i++){
        $scope.classifyList[i].checked=true;
        arr.push($scope.classifyList[i].valueId);
      }
    }else{
      for(var i=0;i<$scope.classifyList.length;i++){
        $scope.classifyList[i].checked=false;
        arr.push($scope.classifyList[i].valueId);
      }
    }
    return;
  }else{

    // $scope.classifyList[index].checked=true;

    for(var i=0;i<$scope.classifyList.length;i++) {

      if($scope.classifyList[i].checked==true){
       $scope.classifyList[$scope.classifyList.length-1].checked=false;
        arr.push($scope.classifyList[i].valueId);

      }
    }
    sortKey = arr;

  }
}
    $scope.hideClassifyMenu=true;
    $scope.hideStateMenu=true;
    $scope.hideSortMenu=true;
    $scope.menuClass1="";
    $scope.menuClass2="";
    $scope.menuClass3="";
    $scope.menuClass4="";
    $scope.menuClass5="";
    $scope.classifyMenuClick=function()
    {
      if($scope.hideClassifyMenu )
      {
        theClassShow("show", "", "", "show");

      }
      else {
        theClassShow("", "", "", "");
      }
      $scope.hideClassifyMenu=! $scope.hideClassifyMenu;
    };
    //取消
    $rootScope.clearMall=function () {
      theTypeShow("", "", "", "", true, true, true);
    }
    //确定
    $rootScope.ensureMall=function () {
      theTypeShow("", "", "", "", true, true, true);

      $scope.menuClass2="";
      $scope.menuClass3="";
      $scope.menuClass4="";
      $scope.menuClass5="";
      $scope.menuClass1="active";
      pageIndex = 1;
      getData(pageIndex, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);


    }
      //商城状态选择
      $scope.stateClick=function(index){
        for(var i=0;i<$scope.stateList.length;i++){
          $scope.stateList[i].checked=false;
        }
        switch (index){
          case 0:
            LeadsStatus = [];
            break;
          case 1:
            LeadsStatus = [0];
            break;
          case 2:
            LeadsStatus = [10];
        }
        $scope.stateList[index].checked=true;
        theTypeShow("", "", "", "", true, true, true);
        $scope.menuClass1="";
        $scope.menuClass2="";
        $scope.menuClass3="";
        $scope.menuClass4="";

        $scope.menuClass5="active";

        shcemUtil.showLoading();
        getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
        pageIndex = 2;

      };
       $scope.hideStateMenu=true;
      $scope.sortStateClick=function(){
        if($scope.hideStateMenu){
          theClassShow("", "", "show", "show");
        }else{
          theClassShow("", "", "", "");
        }
        $scope.hideStateMenu=! $scope.hideStateMenu;
      };


    //排序选择
    $scope.sortClick=function(index) {
      for(var i=0;i<$scope.sortList.length;i++) {
        $scope.sortList[i].checked=false;
      }
      $scope.sortList[index].checked=true;
      theTypeShow("", "", "", "", true, true, true);



      $scope.menuClass2="";
      $scope.menuClass3="";

      $scope.menuClass5="";
      $scope.menuClass1=""
      $scope.menuClass4="active";
      switch(index){
        case 0:
          OrderBy = "2";
          SortDirect = 0;
          break;
        case 1:
          OrderBy = "2";
          SortDirect = 1;
          break;
        case 2:
          OrderBy = "1";
          SortDirect = 1;
          break;
      }
      shcemUtil.showLoading();
      getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      pageIndex = 2;
    };


    $scope.sortMenuClick=function() {
      if($scope.hideSortMenu) {
        theClassShow("", "show", "", "show");
      } else {
        theClassShow("", "", "", "");
      }
      $scope.hideSortMenu=!$scope.hideSortMenu;
    };


    //选择了的产地
    $scope.placeListSelect=[];
    $ionicModal.fromTemplateUrl('placeModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.placeConfirm = function() {
      shcemUtil.showLoading();
      $scope.modal.hide();
      getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      pageIndex = 2;
      $scope.menuClass1="";
      $scope.menuClass2="";
      $scope.menuClass3="";
      $scope.menuClass4="";
      $scope.menuClass5="";
      if(sourcePlaceKey.length > 0)

        $scope.menuClass2="active";
      else
        $scope.menuClass2="";
    };


    function addRemovePlace(item) {
      $scope.placeListSelect=[];
      for(var i=0;i<$scope.placeList.length;i++) {
        for(var j=0;j<$scope.placeList[i].data.length;j++) {
          if(item.id==$scope.placeList[i].data[j].id) {
            $scope.placeList[i].data[j].checked=!$scope.placeList[i].data[j].checked;
          }

          if($scope.placeList[i].data[j].checked) {
            var placeObj={};
            placeObj.id=$scope.placeList[i].data[j].id;
            placeObj.value=$scope.placeList[i].data[j].value;
            placeObj.valueId = $scope.placeList[i].data[j].valueId;
            $scope.placeListSelect.push(placeObj);
          }
        }
      }
    }


    $scope.topStyle= {"margin-top":'-36px'};
    $scope.placeListClick=function(item) {
      addRemovePlace(item);
      mallService.removeByValue(sourcePlaceKey, item.valueId);
      setTimeout(function() {
        var topHeight=document.getElementById("selectPlace").offsetHeight;
        $scope.topStyle= {"margin-top":-45+topHeight+'px'};
        $scope.$apply();
      },1);
    };
    //移除已经选择的产地
    $scope.removePlace=function(item) {
      addRemovePlace(item);
      mallService.removeByValue(sourcePlaceKey, item.valueId);
      setTimeout(function() {
        var topHeight=document.getElementById("selectPlace").offsetHeight;
        $scope.topStyle= {"margin-top":-45+topHeight+'px'};
        $scope.$apply();
      },1);

    };

    //选择了的产地
    $scope.deliveryPlaceListSelect=[];
    $ionicModal.fromTemplateUrl('deliveryPlaceModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalDelivery = modal;
    });
    $scope.deliveryPlaceConfirm = function() {
      shcemUtil.showLoading();
      $scope.modalDelivery.hide();
      getData(1, $scope.input.searchKey, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus);
      pageIndex = 2;
      $scope.menuClass1="";
      $scope.menuClass2="";
      $scope.menuClass3="";
      $scope.menuClass4="";
      $scope.menuClass5="";
      if (deliveryKey.length > 0)
        $scope.menuClass3="active";
      else
        $scope.menuClass3="";
    };

    function addRemoveDeliveryPlace(item) {
      $scope.deliveryPlaceListSelect=[];
      for(var i=0;i<$scope.deliveryPlaceList.length;i++) {
        for(var j=0;j<$scope.deliveryPlaceList[i].data.length;j++) {
          if(item.id==$scope.deliveryPlaceList[i].data[j].id) {
            $scope.deliveryPlaceList[i].data[j].checked=!$scope.deliveryPlaceList[i].data[j].checked;
          }

          if($scope.deliveryPlaceList[i].data[j].checked) {
            var placeObj={};
            placeObj.id=$scope.deliveryPlaceList[i].data[j].id;
            placeObj.value=$scope.deliveryPlaceList[i].data[j].value;
            placeObj.valueId = $scope.deliveryPlaceList[i].data[j].valueId;
            $scope.deliveryPlaceListSelect.push(placeObj);
          }
        }
      }
    }

    $scope.deliveryPlaceListClick=function(item) {
      addRemoveDeliveryPlace(item);
      mallService.removeByValue(deliveryKey, item.valueId);
    };
    //移除已经选择的产地
    $scope.removeDeliveryPlace=function(item) {
      addRemoveDeliveryPlace(item);
      mallService.removeByValue(deliveryKey, item.valueId);
    };


    $scope.createContact = function(u) {
      $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
      $scope.modal.hide();
    };


    /*
    *筛选分类是否显示
     */
    function theTypeShow(classifyClass, sortClass, stateClass, shadowClass, hideClassifyMenu, hideSortMenu, hideStateMenu) {
      $scope.classifyClass=classifyClass;
      $scope.sortClass=sortClass;
      $scope.stateClass=stateClass;
      $scope.shadowClass=shadowClass;
      $scope.hideClassifyMenu=hideClassifyMenu;
      $scope.hideSortMenu=hideSortMenu;
      $scope.hideStateMenu=hideStateMenu;
    }
    function theClassShow(classifyClass, sortClass, stateClass, shadowClass) {
      $scope.classifyClass=classifyClass;
      $scope.sortClass=sortClass;
      $scope.stateClass=stateClass;
      $scope.shadowClass=shadowClass;
    }
    $scope.shadowClick=function() {
      theTypeShow("", "", "", "", true, true, true);
    };


    //此处有bug，稍后解决！！！
    $scope.doLoadMore = function () {
      mallService.getListData(pageIndex, $scope.input.searchKey, 10, sortKey, sourcePlaceKey, deliveryKey, OrderBy, SortDirect, LeadsStatus)
        .then(function (ret) {
          var newMallList=mallService.getNewMallList(ret);
          $scope.mallList = $scope.mallList.concat(newMallList);
          if (ret == null || ret.length == 0){
            $scope.moreData = false;
          }else{
            pageIndex++;
          }

        }, function (error) {
          shcemUtil.showMsg("网络错误");
          $scope.moreData = false;
        }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })


    };

    /**
     * 直接调用BaseController里面的函数
     * @param e
     */
    // $scope.callPhone = function (e) {
    //   $scope.stopBubble(e);
    // };


  });
