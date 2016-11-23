angular.module('starter.controllers')

  .controller('infoKChartDetailCtrl', function ($scope, $state, $ionicHistory, $rootScope, $stateParams, infoKChartService, shcemUtil, $controller) {
    $scope.List = "";
    $scope.startDate = 0;


    $controller("baseCtrl", {$scope: $scope});


    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      $rootScope.hideTabs = 'tabs-item-hide';
      $scope.List = infoKChartService.getInfoObj();



      getKChartRequest($scope.List.EndDate, $scope.List.StartDate, $scope.List.SQRank, $scope.List.SQType,
        $scope.List.SQProductID, $scope.List.SQProduct, $scope.List.SQNo);

    });


    $scope.tabList=[{class:'active',value:'一个月'},{class:'',value:'三个月'},{class:'',value:'一年'}]
    $scope.renderChart=function(index)
    {
      if (index == 0){
        //一个月
        getHowLongTime(40);
        getKChartRequest($scope.List.EndDate, $scope.startDate, $scope.List.SQRank, $scope.List.SQType,
          $scope.List.SQProductID, $scope.List.SQProduct, $scope.List.SQNo);
      } else if(index == 1){
        //三个月
        getHowLongTime(90);
        getKChartRequest($scope.List.EndDate, $scope.startDate, $scope.List.SQRank, $scope.List.SQType,
          $scope.List.SQProductID, $scope.List.SQProduct, $scope.List.SQNo);
      } else if(index == 2) {
        //一年
        var myDate = new Date(); //获取今天日期
        getLastYearYestdy(myDate);
        getKChartRequest($scope.List.EndDate, $scope.startDate, $scope.List.SQRank, $scope.List.SQType,
          $scope.List.SQProductID, $scope.List.SQProduct, $scope.List.SQNo);
      }

      for(var i=0;i<$scope.tabList.length;i++) {
        $scope.tabList[i].class="";
      }
      $scope.tabList[index].class="active";
    }


    function getKChartRequest(SQDate, SQStartDate, SQRank, SQType, SQProductID, SQProduct, SQNo) {
      infoKChartService.getinfoKChartData(SQDate, SQStartDate, SQRank, SQType, SQProductID, SQProduct, SQNo)
        .then(function (ret) {
          // console.log(JSON.stringify(ret));
          $scope.infoKChartDetailList = ret;
          $scope.infoKChartDetailItem = [];
          for(var i = 0;i<ret.ScemQuoDateList.length;i++){
            $scope.infoKChartDetailItem.push(ret.ScemQuoDateList[i].substr(5));
          }
          $scope.infoKChartDetailData = [];
          $scope.infoKChartDetailData.push( ret.ScemQuoPriceList);
          var min = $scope.infoKChartDetailData[0][0];
          for (var j = 1; j < $scope.infoKChartDetailData[0].length; j++){
            if ($scope.infoKChartDetailData[0][j] < min){
              min = $scope.infoKChartDetailData[0][j];
            }
          }
          infoKChartService.setMinData(min);
          $scope.infoKChartDetailLegend = [];
          $scope.infoKChartDetailLegend.push(ret.SQRank);
          infoChart($scope.infoKChartDetailItem, $scope.infoKChartDetailLegend,$scope.infoKChartDetailData);

        }, function (error) {
          shcemUtil.showMsg("暂无数据");
        })
    };


    //加载K-Line函数
    function infoChart(item,legend,data)
    {
      var option = {
        grid:{ //更改y轴文本信息显示不全问题
          x:60
        },
        // 提示框，鼠标悬浮交互时的信息提示
        tooltip: {
          show: true,
          trigger: 'item'
        },
        backgroundColor: '#00000000', //设置背景色为透明
        // backgroundColor: '#FF0000',
        toolbox: {
          y:25,
          show : true,
          itemSize:20,
          feature : {
            magicType : {show: true, type: ['line', 'bar']},
            dataView : {show: true, readOnly: true},
          }
        },
        // 横轴坐标轴
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data:item,
          axisLabel:{
            rotate:60,  //设置横轴文本字体倾斜
            // interval: 0,  //横轴数据多显示不全,设置不自动隐藏
            margin:10 //坐标轴文本标签与坐标轴的间距,默认是8px
          }
        }],
        // 纵轴坐标轴
        yAxis: [{
          type: 'value',
          min: infoKChartService.getMinData,
          splitNumber:3
        }],
        // 数据内容数组
        series: function(){
          var serie=[];
          for(var i=0;i<legend.length;i++){
            var item = {
              name : legend[i],
              type: 'line',
              data: data[i]
            };
            serie.push(item);
          }
          return serie;
        }()
      };

      var myChart = echarts.init(document.getElementById("chartDetailId"),'macarons');
      myChart.setOption(option);
    }

    //计算时间-距离多久 获取当前日期的前...天。获取...天之内的K线图数据
    function getHowLongTime(date) {
      var myDate = new Date(); //获取今天日期
      myDate.setDate(myDate.getDate() - date);
      var dateArray = [];
      var dateTemp;
      var flag = 1;
      for (var i = 0; i < date; i++) {
        dateTemp = (myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      $scope.startDate = dateArray[0];
    }
    //获取当前日期的前一年时间
    function getLastYearYestdy(date){
      var strYear = date.getFullYear() - 1;
      var strDay = date.getDate();
      var strMonth = date.getMonth()+1;
      if(strMonth<10)
      {
        strMonth="0"+strMonth;
      }
      if(strDay<10)
      {
        strDay="0"+strDay;
      }
      datastr = strYear+"-"+strMonth+"-"+strDay;
      $scope.startDate = datastr;
      return datastr;
    }



  })
