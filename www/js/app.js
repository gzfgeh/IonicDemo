// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter.services',[]);
angular.module('starter.controllers',[]);
angular.module('starter.directives',[]);
angular.module('templates', []);

angular.module('starter', ['ionic', 'ngCordova','starter.controllers', 'starter.services','starter.directives','templates'])

.run(function($ionicPlatform,$rootScope,$state,$ionicHistory,$ionicLoading,
              Push,$cordovaGoogleAnalytics,BadgeService, shcemUtil,Statistics,$location,$cordovaToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //初始化推送
    Push.init();
    Push.addEventListener(function (event) {
    //  alert("自定义消息"+ JSON.stringify(event));
      BadgeService.getUnreadCount();
    },function (event) {
      BadgeService.getUnreadCount ();//应用启动获取消息列表
     // alert("应用前台收到消息" + JSON.stringify(event));
     // BadgeService.notificationInfo.minePage.push(1);//前台收到消息后添加一个角标
     // $rootScope.$broadcast("updateBadge");
    },function (event) {
      BadgeService.getUnreadCount();//应用启动获取消息列表
     // BadgeService.notificationInfo.minePage.push(1);//前台收到消息后添加一个角标
     // $rootScope.$broadcast("updateBadge");
    //  alert("点击打开通知" + JSON.stringify(event));
    },function (event) {
    //  BadgeService.getUnreadCount();//获取消息列表
    //  BadgeService.notificationInfo.minePage.push(1);//前台收到消息后添加一个角标
    //  $rootScope.$broadcast("updateBadge");
    //  alert("后台模式下收到数据" + JSON.stringify(event));
    });//添加事件监听
    BadgeService.getUnreadCount();//应用启动获取消息列表

    document.addEventListener("Resume", function () {
      //alert("应用进入前台");
      BadgeService.getUnreadCount();//获取消息列表
    }, false);
    document.addEventListener("pause", function () {
      //alert("应用进入后台");
      Push.setApplicationIconBadgeNumber(0);
    }, false);
    // gulp.task('template',function(){
    //   return gulp.src(path.templates)
    //     .pipe(angularTemplateCache())
    //     .pipe(concat('templates.js'))
    //     .pipe(gulp.dest('./www/lib'));
    // });

    codePush.sync();


    $rootScope.isShowUpdateDialog = false;
    //打开外部链接
    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      shcemUtil.checkVersion();
      //设置禁止横屏
      var so = cordova.plugins.screenorientation;
      so.setOrientation(so.Orientation.LANDSCAPE);
    }
    Statistics.init();
    $rootScope.$on('$stateChangeSuccess', function () {
      $cordovaGoogleAnalytics.trackView($state.current.name);
    });


    // //解决单击返回 黑屏
    // //双击退出
    // $ionicPlatform.registerBackButtonAction(function (e) {
    //   //判断处于哪个页面时双击退出
    //   if (($location.path() == '/tabs/top') ||
    //         ($location.path() == '/tabs/mall') ||
    //           ($location.path() == '/tabs/info') ||
    //               ($location.path() == '/tabs/order') ||
    //                   ($location.path() == '/tabs/user') ) {
    //     alert("1111");
    //     if ($rootScope.backButtonPressedOnceToExit) {
    //       ionic.Platform.exitApp();
    //     } else {
    //       $rootScope.backButtonPressedOnceToExit = true;
    //       $cordovaToast.showShortTop('再按一次退出系统');
    //       setTimeout(function () {
    //         $rootScope.backButtonPressedOnceToExit = false;
    //       }, 2000);
    //     }
    //   }
    //   else if ($ionicHistory.backView()) {
    //     $ionicHistory.goBack();
    //   } else {
    //     $rootScope.backButtonPressedOnceToExit = true;
    //     $cordovaToast.showShortTop('再按一次退出系统');
    //     setTimeout(function () {
    //       $rootScope.backButtonPressedOnceToExit = false;
    //     }, 2000);
    //   }
    //   e.preventDefault();
    //   return false;
    // }, 101);

  });

  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
    // if ('data' in next && 'requireLogin' in next.data) {
    //   if (!UserService.isAuthenticated()) {
    //     if (next.name !== 'login') {
    //       event.preventDefault();
    //       $state.go('login');
    //     }
    //   }
    // }
  });
  $rootScope.goMain=function(){
    $state.go("tabs.top")
  };
  $rootScope.goInfo=function(){
  $state.go("tabs.info")
}
  $rootScope.goUser=function(){
    $state.go("tabs.user")
  }
  $rootScope.goMall=function(){
    $state.go("tabs.mall")
  }
  $rootScope.goOrder=function(){
    $state.go("tabs.order")
  }

});

