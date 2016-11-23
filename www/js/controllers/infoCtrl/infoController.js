angular.module('starter.controllers')

    .controller('infoCtrl', function($scope, infoService, infoTopInformService, $state,
                           $ionicModal,$ionicPopover, infoKChartService, $rootScope, shcemUtil, $ionicScrollDelegate, config) {

      var tagProduct = 1; //PE/PP/PVC的productID
      $scope.loadmore = true; //上拉加载是否加载
      var pageIndex = 2;              //页数
      var currentPage = 0;
      var infoCateGory = [""];
      var infoDataCateGory = [""];
      $scope.firstTime = true;  //第一次进入化交资讯模块
      $scope.firstDataTime = true;  //第一次进入数据中心模块
      $scope.firstClickInfo = true; //第一次点击化交资讯下拉菜单
      $scope.firstClickData = true; //第一次点击数据中心下拉菜单

      //头部切换
      $scope.tabList = [
        { catogredId: 0, name: '聚乙烯PE',className:'active'},
        { catogredId: 1, name: '聚丙烯PP',className:''},
        { catogredId: 2, name: '聚氯乙烯PVC',className:''}
      ];
      $scope.tabClick=function(index) {
        if (currentPage == 0){
          $scope.loadmore = false;
        } else {
          $scope.loadmore = true;
          pageIndex = 2;
        }
        if (index == 0) {
          tagProduct = 1;
          getSomeData(1);
        } else if (index == 1) {
          tagProduct = 2;
          getSomeData(2);
        } else if (index == 2) {
          tagProduct = 3;
          getSomeData(3);
        }
        for (var i = 0; i <3; i++) {
          if ($scope.tabList[i].catogredId == index) {
            $scope.tabList[i].className = 'active';
          } else {
            $scope.tabList[i].className = '';
          }
        }
      };

      $scope.$on('$ionicView.afterEnter', function () {
        $rootScope.hideTabs = ' ';
      });
      $scope.$on('$ionicView.loaded', function () {
        $scope.showLoading = true;
      });

      //onResume()
      $scope.$on('$ionicView.beforeEnter', function () {
        infoService.getTopInforData(config.infoImgCategoryID, 1)
          .then(function (ret) {
            $scope.imageList = ret[0];
            $scope.theImageCategoryID = ret[1];
          }, function (error) {
            //轮播图挂了。。。
            // shcemUtil.showMsg("暂无数据");
          });

        getListData(infoService.getTopIndex());
        $rootScope.hideTabs = ' ';
        pageIndex = 2;
        var infoId = infoService.getInfoDetailID();
        if (infoId != -1){
          infoService.setInfoDetailID(-1);
          $state.go("tabs.info_detail", {infoID: infoId});
        }
        hideDoubleList();
        $scope.showAllMenu=false;
      });


      //展开所有菜单
      $scope.showAllMenu=false;
      $scope.showAllMenuClass="";
      $scope.allMenuSwitch =function() {
        if($scope.showAllMenu) {
          $scope.showAllMenuClass="";
        } else {
          $scope.showAllMenuClass="show";
          hideDoubleList();
        }
        $scope.showAllMenu=!$scope.showAllMenu;
      };

      //点击屏幕隐藏菜单栏
      $scope.hideAllMenu=function() {
        $scope.showAllMenuClass="";
        $scope.showAllMenu=!$scope.showAllMenu;
        $scope.classifyClass="";
        $scope.sortClass="";
        $scope.hideSortMenu=true;
        $scope.hideClassifyMenu=true;
      };



      $scope.doRefresh = function () {
        $scope.showLoading = true;
        pageIndex = 2;
        getSomeData(tagProduct);
        $scope.$broadcast("scroll.refreshComplete");
      };

      $scope.doInfoLoadMore = function () {
        if(currentPage == 0) { //化交价格
          $scope.loadmore = false;
        } else if(currentPage == 1){ //热点访谈
          infoTopInformService.getTopInformData(config.theHotSpot, tagProduct, pageIndex)
            .then(function (ret) {
              $scope.infoHotSpotList = $scope.infoHotSpotList.concat(ret);
              if(ret == null || ret.length == 0 || ret.length < 10){
                $scope.loadmore = false;
              } else {
                pageIndex++;
              }
            }, function (error) {
              $scope.loadmore = false;
            }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        } else if(currentPage == 3){ //化交资讯
            getInformLoadMoreRequest(infoCateGory, tagProduct, pageIndex);
        } else if(currentPage == 4){ //数据中心
            getProducenumberLoadMoreRequest(infoDataCateGory, tagProduct, pageIndex);
        } else if(currentPage == 6){ //下游调研
          infoTopInformService.getTopInformData(["1778"], tagProduct, pageIndex)
            .then(function (ret) {
              $scope.infoSurveyList = $scope.infoSurveyList.concat(ret);
              if(ret == null || ret.length == 0 || ret.length < 10){
                $scope.loadmore = false;
              } else {
                pageIndex++;
              }
            }, function (error) {
              shcemUtil.showMsg("暂无数据");
              $scope.loadmore = false;
            }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        } else if(currentPage == 5){ //每日成交
          infoTopInformService.getTopInformData(["1785"], tagProduct, pageIndex)
            .then(function (ret) {
              $scope.infoDailyTradeList = $scope.infoDailyTradeList.concat(ret);
              if(ret == null || ret.length == 0){
                $scope.loadmore = false;
              } else {
                pageIndex++;
              }
            }, function (error) {
              $scope.loadmore = false;
            }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        } else if(currentPage == 2){ //化交报告
          infoTopInformService.getTopInformData(["1782"], tagProduct, pageIndex)
            .then(function (ret) {
              $scope.infoReportList = $scope.infoReportList.concat(ret);
              if(ret == null || ret.length == 0){
                $scope.loadmore = false;
              } else {
                pageIndex++;
              }
            }, function (error) {
              $scope.loadmore = false;
            }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        } else if(currentPage == 7){ //化交讲堂
          infoTopInformService.getTopInformData(["1783"], tagProduct, pageIndex)
            .then(function (ret) {
              $scope.infoLectureList = $scope.infoLectureList.concat(ret);
              if(ret == null || ret.length == 0){
                $scope.loadmore = false;
              } else {
                pageIndex++;
              }
            }, function (error) {
              $scope.loadmore = false;
            }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        }
      };


      //获取当前日期的前30天。获取30天之内的K线图数据
      var myDate = new Date(); //获取今天日期
      myDate.setDate(myDate.getDate() - 30);
      var dateArray = [];
      var dateTemp;
      var flag = 1;
      for (var i = 0; i < 30; i++) {
        dateTemp = (myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      $scope.startDate = dateArray[0];


      //K线图点击事件&网络请求
      var ProductID = 1;

      $scope.onItemToggle = function (List, chartIndex) {
        // 加载--行网络请求
        List.hide = !List.hide;
        if(List.hide != true) {

          infoKChartService.getinfoKChartData(List.SQDate, $scope.startDate, List.SQRank, List.SQType, tagProduct, List.SQProduct, List.SQNo)
            .then(function (ret) {
              $scope.PriceList[chartIndex].chartHtml='templates/inform/infoKChart.html';
              $scope.infoKChartList = ret;
              $scope.infoKChartItem = [];
              for(var i = 0;i<ret.ScemQuoDateList.length;i++){
                $scope.infoKChartItem.push(ret.ScemQuoDateList[i].substr(5));
              }
              $scope.infoKChartData = [];
              $scope.infoKChartData.push( ret.ScemQuoPriceList);
              var min = $scope.infoKChartData[0][0];
              for (var j = 1; j < $scope.infoKChartData[0].length; j++){
                if ($scope.infoKChartData[0][j] < min){
                  min = $scope.infoKChartData[0][j];
                }
              }
              infoKChartService.setMinData(min);

              $scope.infoKChartLegend = [];
              $scope.infoKChartLegend.push(ret.SQRank);
            }, function (error) {
              shcemUtil.showMsg("暂无数据");
            })
        }
      }

      // 点击K线图跳入下级页面
      $scope.goKChartDetail = function (KPirceList) {
        $state.go("tabs.infoKChartDeatil");
        if (KPirceList.SQProduct == "PE"){
          KPirceList.SQProductID = 1;
        } else if(KPirceList.SQProduct == "PP"){
          KPirceList.SQProductID = 2;
        } else if(KPirceList.SQProduct == "PVC"){
          KPirceList.SQProductID = 3;
        }
        infoKChartService.setInfoObj(KPirceList);
      };


      //栏目切换
      $scope.typeList = [
        {id: 0, className: '', name: '化交价格', htmlName: 'info_price.html'},
        {id: 1, className: '', name: '热点访谈', htmlName: 'info_hotSpot.html'},
        {id: 2, className: '', name: '化交报告', htmlName: 'info_report.html'},
        {id: 3, className: '', name: '化交资讯', htmlName: 'info_news.html',childList:[{value:'市场动态',checked:true},{value:'工厂价格',checked:false},{value:'装置',checked:false},{value:'全部',checked:false}]},
        {id: 4, className: '', name: '数据中心', htmlName: 'info_data.html',childList:[{value:'生产统计',checked:true},{value:'进出口',checked:false},{value:'全部',checked:false}]},
        {id: 5, className: '', name: '每日成交', htmlName: 'info_daily_trade.html'},
        {id: 6, className: '', name: '下游调研', htmlName: 'info_survey.html'},
        {id: 7, className: '', name: '化交讲堂', htmlName: 'info_lecture.html'}
      ];
        $scope.classifyClick=function(index) {
          if(index == 0) {
            //市场动态:1775
            infoCateGory = ["1775"];
            getInformDataReuqest(["1775"], tagProduct);
          } else if(index == 1) {
            // 工厂价格:1776
            infoCateGory = ["1776"];
            getInformDataReuqest(["1776"], tagProduct);
          } else if(index == 2) {
            // 装置:1777
            infoCateGory = ["1777"];
            getInformDataReuqest(["1777"], tagProduct);
          } else if(index == 3) {
            //资讯-全部 1775,1776,1777
            infoCateGory = ["1775", "1776", "1777"];
            getInformDataReuqest(["1775", "1776", "1777"], tagProduct);
          }
          doCancelClick();
          doCancelWhatSelect(3);
          $scope.typeList[3].childList[index].checked=true;
          hideDoubleList();
          $scope.showAllMenu=false;
        };

        $scope.sortClick=function(index) {
            if(index == 0){
              // 生产统计:1779
              infoDataCateGory = ["1779"];
              getinfoProducenumberRequest(["1779"], tagProduct);
            } else if(index == 1) {
              // 进出口:1780
              infoDataCateGory = ["1780"];
              getinfoProducenumberRequest(["1780"], tagProduct);
            }else if(index == 2) {
              // 全部:1779,1780
              infoDataCateGory = ["1779","1780"];
              getinfoProducenumberRequest(["1779","1780"], tagProduct);
            }
            doCancelClick();
            doCancelWhatSelect(4);
            $scope.typeList[4].childList[index].checked = true;
            hideDoubleList();
            $scope.showAllMenu=false;
        }


      //化交指标  KPI
      infoService.doKPIData()
        .then(function (ret) {
          $scope.KPIList = ret;
          if(ret.length == 0){
            $scope.showBlank = true;
          } else {
            $scope.showBlank = false;
          }
          $scope.showLoading = false;

        }, function (error) {
          $scope.showLoading = false;
        });

      $scope.columnChange = function (item) {
        infoService.setTopIndex(item.id);
        $scope.showAllMenuClass="";
        currentPage = item.id;
        pageIndex = 2;
        $scope.showAllMenu=false;
        if(item.id != null){
          getListData(item.id);
        }
        //化交资讯,数据中心展开后再次点击收起菜单
        if(item.id == 3) {
          if($scope.firstClickInfo == true){
            $scope.classifyClass = "show";
            $scope.showAllMenu = true;
            $scope.firstClickInfo = false;
          } else {
            $scope.firstClickInfo = true;
            hideDoubleList();
            $scope.showAllMenu=false;
          }
        }
        if(item.id == 4 ){
          if($scope.firstClickData == true){
            $scope.sortClass = "show";
            $scope.showAllMenu = true;
            $scope.firstClickData = false;
          } else {
            $scope.firstClickData = true;
            hideDoubleList();
            $scope.showAllMenu=false;
          }
        }

        //点击右侧大的下拉菜单 化交资讯和数据中心的子选项
        switch (item.value){
          case "市场动态":
            doGetNewsRequest(["1775"], tagProduct);
            doCancelWhatSelect(3);
            $scope.typeList[3].childList[0].checked = true;
            break;
          case "工厂价格":
            doGetNewsRequest(["1776"], tagProduct);
            doCancelWhatSelect(3);
            $scope.typeList[3].childList[1].checked = true;
            break;
          case "装置":
            doGetNewsRequest(["1777"], tagProduct);
            doCancelWhatSelect(3);
            $scope.typeList[3].childList[2].checked = true;
            break;
          case "生产统计":
            doGetDataRequest(["1779"], tagProduct);
            doCancelWhatSelect(4);
            $scope.typeList[4].childList[0].checked = true;
            break;
          case "进出口":
            doGetDataRequest(["1780"], tagProduct);
            doCancelWhatSelect(4);
            $scope.typeList[4].childList[1].checked = true;
            break;
        }
      };


      /**
       * 根据index 获取列表数据
       * @param item
       */
      function getListData(index){
        for (var i = 0; i < $scope.typeList.length; i++) {
          $scope.typeList[i].className = '';
        }
        $scope.typeList[index].className = 'active';
        $scope.mainHtml = 'templates/inform/' + $scope.typeList[index].htmlName;
        $scope.loadmore = false;
        if (index == 0) {//化交价格
          getPriceDataRequest(tagProduct);
          $scope.loadmore = false;
          hideDoubleList();
          doCancelClick();
        } else if(index == 1) {
          //热点访谈   uat-1887   生产-1918
          getInfoHotSpotRequest(config.theHotSpot, tagProduct);
          hideDoubleList();
          doCancelClick();
        } else if (index == 3){
          //化交资讯：1773（市场动态：1775，工厂价格 ： 1776，装置：1777）
            $scope.classifyClass="show";
            $scope.sortClass="";
            $scope.showAllMenu=true;
            if($scope.firstTime == true){
              getInformDataReuqest(["1775"], tagProduct);
              $scope.firstTime = false;
              currentPage = 1;
              infoCateGory = ["1775"];
            }
        } else if (index == 4) {
          //数据中心：1772（生产统计：1779，进出口：1780）
            $scope.classifyClass="";
            $scope.sortClass="show";
            $scope.showAllMenu=true;
            if($scope.firstDataTime == true){
              getinfoProducenumberRequest(["1779"], tagProduct);
              $scope.firstDataTime = false;
              currentPage = 2;
              infoDataCateGory = ["1779"];
            }
        } else if (index == 6) {
          //下游调研:1778
          getInfoSurveyReuqest(["1778"], tagProduct);
          hideDoubleList();
          doCancelClick();
          $ionicScrollDelegate.$getByHandle("topHandle").scrollTo(200);
        } else if (index == 5) {
          //每日成交:1785
          getInfoDailyRequest(["1785"], tagProduct);
          hideDoubleList();
          doCancelClick();
        } else if (index == 2) {
          //化交报告:1782
          getInfoReportRequest(["1782"], tagProduct);
          hideDoubleList();
          doCancelClick();
          $ionicScrollDelegate.$getByHandle("topHandle").scrollTo(500);
        } else if (index == 7) {
          //化交讲堂:1783
          getInfoLectureRequest(["1783"], tagProduct);
          hideDoubleList();
          doCancelClick();
        }
      }


      //查看详情
      $scope.goDetail = function (link, sendID) {
        $state.go(link, {infoID: sendID});
      };
      $scope.goImageDetail = function (link, sendID)   {
        if($scope.theImageCategoryID && parseInt($scope.theImageCategoryID)){
          $state.go(link, {infoID: sendID});
        }
      };

      //化交资讯和数据中心点击大的下拉菜单--下面的子选项的网络请求  资讯|市场动态
      function doGetNewsRequest(newsID, newsTag) {
        hideTypeList();
        doCancelClick();
        $scope.typeList[3].className = 'active';
        $scope.mainHtml = 'templates/inform/' + $scope.typeList[3].htmlName;
        getInformDataReuqest(newsID, newsTag);
      }
      function doGetDataRequest(dataID, dataTag) {
        hideTypeList();
        doCancelClick();
        $scope.typeList[4].className = 'active';
        $scope.mainHtml = 'templates/inform/' + $scope.typeList[4].htmlName;
        getinfoProducenumberRequest(dataID, dataTag);
      }

      // 在点击其他选项时,之前的选项成为未选状态
      function hideTypeList() {
        for(var i=0;i<8;i++) {
          $scope.typeList[i].className = '';
        }
      }

      //下拉菜单中,清除当前所选项
      function doCancelWhatSelect(number) {
        for (var i = 0; i < $scope.typeList[number].childList.length; i++) {
          $scope.typeList[number].childList[i].checked = false;
        }
      }

      //多次调用-化交资讯和数据中心下拉菜单隐藏
      function hideDoubleList() {
        $scope.classifyClass = "";
        $scope.sortClass = "";
        $scope.hideSortMenu=true;
        $scope.hideClassifyMenu=true;
      }

      //下拉菜单收回
      function doCancelClick() {
        $scope.firstClickInfo = true;
        $scope.firstClickData = true;
      }

      // 点击PE/PP/PVC进行数据页面刷新
      function getSomeData(productTag) {
        getPriceDataRequest(productTag);
        getInformDataReuqest(infoCateGory, productTag);
        getinfoProducenumberRequest(infoDataCateGory, productTag);
        getInfoSurveyReuqest(["1778"], productTag);
        getInfoDailyRequest(["1785"], productTag);
        getInfoReportRequest(["1782"], productTag);
        getInfoLectureRequest(["1783"], productTag);
        getInfoHotSpotRequest(config.theHotSpot, productTag);
      }

      /*
       *上拉加载更多-reuqest
       */
      //化交资讯-上拉加载的request
      function getInformLoadMoreRequest(category, Product, pagesize) {
        infoTopInformService.getTopInformData(category, Product, pagesize)
          .then(function (ret) {
            $scope.infoMarketList = $scope.infoMarketList.concat(ret);
            if(ret == null || ret.length == 0){
              $scope.loadmore = false;
            } else {
              pageIndex++;
            }
          }, function (error) {
            $scope.loadmore = false;
          }).finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //数据中心-上拉加载的request
      function getProducenumberLoadMoreRequest(category, product, pagesize) {
        infoTopInformService.getTopInformData(category, product, pagesize)
          .then(function (ret) {
            $scope.infoProducenumberList = $scope.infoProducenumberList.concat(ret);
            if(ret == null || ret.length == 0){
              $scope.loadmore = false;
            } else {
              pageIndex++;
            }
          }, function (error) {
            $scope.loadmore = false;
          }).finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      /*
       *正常service
       */
      //化交价格request
      function getPriceDataRequest(product) {
        infoService.doPriceData(product)
          .then(function (ret) {
            $scope.PriceList = ret;
          }, function (error) {
            shcemUtil.showMsg("暂无数据");
          });
        $scope.showLoading = false;
      }
      //化交资讯--request
      function getInformDataReuqest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoMarketList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //数据中心--request
      function getinfoProducenumberRequest(dataID,dataTag,pagesize) {
        infoTopInformService.getTopInformData(dataID,dataTag, pagesize)
          .then(function (ret) {
            $scope.infoProducenumberList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //下游调研-request
      function getInfoSurveyReuqest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoSurveyList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //每日成交-request
      function getInfoDailyRequest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoDailyTradeList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //化交报告-request
      function getInfoReportRequest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoReportList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //化交讲堂-request
      function getInfoLectureRequest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoLectureList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }
      //热点访谈-request
      function getInfoHotSpotRequest(categoryID, productID, pagesize) {
        infoTopInformService.getTopInformData(categoryID, productID, pagesize)
          .then(function (ret) {
            $scope.infoHotSpotList = ret;
            if(ret != null || ret.length > 0){
              $scope.loadmore = true;
            }
          }, function (error) {

          })
      }

        document.getElementById("cusScroll").addEventListener('touchmove', function (e){
            e.stopPropagation();
        },false);





    })




