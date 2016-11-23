/**
 *
 *                            _ooOoo_
 *                           o8888888o
 *                           88" . "88
 *                           (| -_- |)
 *                           O\  =  /O
 *                        ____/`---'\____
 *                      .'  \\|     |//  `.
 *                     /  \\|||  :  |||//  \
 *                    /  _||||| -:- |||||-  \
 *                    |   | \\\  -  /// |   |
 *                    | \_|  ''\---/''  |   |
 *                    \  .-\__  `-`  ___/-. /
 *                  ___`. .'  /--.--\  `. . __
 *               ."" '<  `.___\_<|>_/___.'  >'"".
 *              | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *              \  \ `-.   \_ __\ /__ _/   .-` /  /
 *         ======`-.____`-.___\_____/___.-`____.-'======
 *                            `=---='
 *        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                      佛祖保佑       永无BUG
 *
 * Created by guzhenfu on 2016/8/1.
 */

angular.module('starter.controllers')
  .controller('baseCtrl', function ($scope, $rootScope, $ionicHistory, $state,shcemUtil) {



    /** onResume()
     * 在每个View的Controller里面设置$scope.isShowBottomTab变量 控制
     * 是否显示底部tabs
     * true：显示
     * false：不显示
     */
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      $rootScope.hideTabs = 'tabs-item-hide';

      $rootScope.appScope={
        viewBack: []
      };

      viewData.enableBack = true;
      if($ionicHistory.backView() != null) {
        $rootScope.appScope.viewBack[$state.current.name] = $ionicHistory.backView();
      } else if(typeof $rootScope.appScope.viewBack[$state.current.name] != undefined) {
        $ionicHistory.viewHistory().backView = $rootScope.appScope.viewBack[$state.current.name];
      }
    });

    /**
     * 解决冒泡传递冲突
     * @param e
     */
    $scope.stopBubble = function(e) {
      if ( e && e.stopPropagation )
        e.stopPropagation();
      else
        window.event.cancelBubble = true;
    };



    $scope.getList = function(obj, functionList) {
      obj.PageIndex = 1;
      $scope.moreData = true;
      $scope.list = [];
      shcemUtil.showLoading();
      functionList(obj)
        .then(function (ret) {
          $scope.list = [];
            $scope.list=ret;
            if (ret.length < 10)
              $scope.moreData = false;
            else
              $scope.moreData = true;
          shcemUtil.hideLoading();
        //  $scope.$broadcast('scroll.infiniteScrollComplete',{"status":true,'msg':"暂无数据"});
        $scope.$broadcast('scroll.refreshComplete',{"status":true,'msg':"加载完毕"});
        }, function () {
          shcemUtil.hideLoading();
          shcemUtil.showMsg("网络错误");
       //   $scope.$broadcast('scroll.infiniteScrollComplete',{"status":false,'msg':"加载失败"});
       $scope.$broadcast('scroll.refreshComplete',{"status":true,'msg':"加载失败"});
        });
    }


    $scope.getMoreData = function (obj,functionList) {
      obj.PageIndex++;
      functionList(obj)
        .then(function (ret) {
          if (ret == null || ret.length == 0){
            $scope.moreData = false;
          }else{
            $scope.list = $scope.list.concat(ret);
          }

        }, function (error) {
          shcemUtil.showMsg("网络错误 " + error);
          $scope.moreData = false;
        }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

    };



  });
