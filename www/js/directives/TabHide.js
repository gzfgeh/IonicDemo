/**
 * Created by guzhenfu on 2016/7/29.
 */
angular.module('starter.directives')
  .directive('hideTabs',function($rootScope){
    return {
      restrict:'AE',
      link:function($scope){
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy',function(){
          $rootScope.hideTabs = ' ';
        })
      }
    }
  })
  .directive('dyAutofocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      scope: {'dyAutofocus':'='},
      link : function($scope, $element) {
        $scope.$watch('dyAutofocus', function(focus){
          if(focus){
            $timeout(function() {
              $element[0].focus();
            },100);
          }
        })
      }
    }
  }])
  .directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});


angular.module('starter.directives').directive('line', function(infoKChartService) {

    return {
        scope: {
            id: "@",
            legend: "=",
            item: "=",
            data: "="
        },
        restrict: 'E',

        template: '<div style="height:200px"></div>',
        replace: true,
        link: function($scope, element, attrs, controller) {
            var option = {
              grid:{ //更改y轴文本信息显示不全问题
                x:50,
                x2:30
              },
              // 提示框，鼠标悬浮交互时的信息提示
              tooltip: {
                show: true,
                trigger: 'item'
              },
              // 横轴坐标轴
              xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: $scope.item,
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
                splitNumber:2
              }],
              // 数据内容数组
              series: function(){
                var serie=[];
                for(var i=0;i<$scope.legend.length;i++){
                  var item = {
                    name : $scope.legend[i],
                    type: 'line',
                    data: $scope.data[i]
                  };
                  serie.push(item);
                }
                return serie;
              }()
            };
           var myChart = echarts.init(document.getElementById("chartId"+$scope.id).getElementsByClassName("infoChartList")[0],'macarons');
           myChart.setOption(option);
        }
    };
});
