/*
 * create by hdy 2016-08-02
 */

angular.module('starter.services')
.service('Push', function(UserService,BadgeService,$rootScope) {
  var push;
  //ios only
  var setBadge = function(badge) {
    if (push) {
    //  console.log('jpush: set badge', badge);
      plugins.jPushPlugin.setBadge(badge);
    }
  };
  var setApplicationIconBadgeNumber = function (badge) {
    if (push){
      window.plugins.jPushPlugin.setApplicationIconBadgeNumber(badge)
    }
  };
  var getApplicationIconBadgeNumber = function (badge) {
    if(push){
      window.plugins.jPushPlugin.getApplicationIconBadgeNumber(badge);
    }
  };
  var setDebugModeFromIos = function () {
    if(push){
      window.plugins.jPushPlugin.setDebugModeFromIos();
    }
  };
  var setLogOFF = function () {
    if(push){
      window.plugins.jPushPlugin.setLogOFF();
    }
  };
  var setCrashLogON = function () {
    if(push){
      window.plugins.jPushPlugin.setCrashLogON();
    }
  };
  var setLocation = function (longitude,dimension) {
    if(push){
      window.plugins.jPushPlugin.setLocation(longitude,dimension);
    }
  };
  var startLogPageView = function (pageName) {
    if (push){
      window.plugins.jPushPlugin.startLogPageView(pageName);
    }
  };

  //andriod only
  var setDebugMode = function (mode) {
    if (push){
      window.plugins.jPushPlugin.setDebugMode(mode);
    }
  };
  var setBasicPushNotificationBuilder = function () {
    if(push){
      window.plugins.jPushPlugin.setBasicPushNotificationBuilder();
    }
  };
  var setCustomPushNotificationBuilder = function () {
    if(push){
      window.plugins.jPushPlugin.setCustomPushNotificationBuilder();
    }
  };
  var clearAllNotification = function () {
    if(push){
      window.plugins.jPushPlugin.clearAllNotification();
    }
  };
  var clearNotificationById = function (id) {
    if(push){
      window.plugins.jPushPlugin.clearNotificationById(id);
    }
  };
  var setLatestNotificationNum = function (num) {
      if(push){
        window.plugins.jPushPlugin.setLatestNotificationNum(num);
      }
    };
  var setStatisticsOpen = function (mode) {
    if(push){
      window.plugins.jPushPlugin.setStatisticsOpen(mode);
    }
  };

  //common
  var getUserNotificationSettings = function (callback) {
    if (push){
      window.plugins.jPushPlugin.getUserNotificationSettings(callback);
    }
  };
  var setAlias = function() {
    if (push) {
     // console.log("设置用户别名");
      if (UserService.isAuthenticated()){
        plugins.jPushPlugin.setAlias(UserService.mobile());
      }else{
        plugins.jPushPlugin.setAlias("customer");
      }
    }
  };
  var setTags = function (tags) {
    if(push){
    //  console.log("设置标签");
      plugins.jPushPlugin.setTags(tags);
    }
  };

  //安卓有三个native端调用的方法,receiveMessageInAndroidCallback,openNotificationInAndroidCallback,receiveNotificationInAndroidCallback,
  //这三个方法会在js端触发document事件,需要本地监听处理。
  //ios 有一个native端调用的方法:receiveMessageIniOSCallback, iOS native端触发了上面安卓三个方法的document事件。
  //另 native端的代码可以搜索相关的fireDocument的事件,可以在js上进行监听。

  //先对收到的消息进行统一处理
  // var onReceiveMessage = function (event) {
  //   alert("自定义消息"+ JSON.stringify(event));
  //   //角标服务更新数据
  //   $rootScope.$broadcast("updateBadge");
  // };
  // var onReceiveNotification = function (event) {
  //   alert("应用前台收到消息" + JSON.stringify(event));
  //   //角标服务更新数据
  //
  //   BadgeService.notificationInfo().minePage.push(1);//前台收到消息后添加一个角标
  //   $rootScope.$broadcast("updateBadge");
  // };
  // var openNotification = function (event) {
  //   alert("点击打开通知" + JSON.stringify(event));
  //   //角标服务更新数据
  //   getApplicationIconBadgeNumber(function () {
  //
  //   });
  //   BadgeService.notificationInfo().minePage.push(1);//收到消息后添加一个角标
  //   $rootScope.$broadcast("updateBadge");
  // };
  // var onBackgroundNotification = function (event) {
  //   alert("后台模式下收到数据" + JSON.stringify(event));
  //   //角标服务更新数据
  //   $rootScope.$broadcast("updateBadge");
  // };

  var addEventListener = function (onReceiveMessage,onReceiveNotification,openNotification,onBackgroundNotification) {
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);//自定义消息
    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);//前台收到
    document.addEventListener("jpush.openNotification", openNotification, false);//点击通知进入应用程序的时候回触发。
    document.addEventListener("jpush.backgoundNotification",onBackgroundNotification,false);//后台收到
  };


  var init = function() {
    push = window.plugins && window.plugins.jPushPlugin;
    if (push) {
     // console.log('极光推送初始化');
      //通用
      plugins.jPushPlugin.init();
      setAlias();
      //ios
      setApplicationIconBadgeNumber(0);//应用启动的时候,清除应用图标上的数字
      setBadge(0);//向服务器发送清除应用图标的标志。
     // setDebugModeFromIos();
      setLogOFF();
      //andriod
   //   setDebugMode(true);
      setStatisticsOpen(true);//安卓统计功能打开
    }
  };

  return {
    //ios only
    setBadge: setBadge,
    //ios only
    setApplicationIconBadgeNumber:setApplicationIconBadgeNumber,
    //ios only
    getApplicationIconBadgeNumber:getApplicationIconBadgeNumber,
    //ios only
    setDebugModeFromIos:setDebugModeFromIos,
    //ios only
    setLogOFFL:setLogOFF,
    //ios only
    setCrashLogON:setCrashLogON,
    //ios only,上传经度维度值
    setLocation:setLocation,
    //ios only 统计相关
    startLogPageView:startLogPageView,

    //andriod only
    setDebugMode:setDebugMode,
    //andriod only
    setBasicPushNotificationBuilder:setBasicPushNotificationBuilder,
    //andriod only
    setCustomPushNotificationBuilder:setCustomPushNotificationBuilder,
    //andriod only
    clearAllNotification:clearAllNotification,
    //andriod only
    clearNotificationById:clearNotificationById,
    //andriod only
    setLatestNotificationNum:setLatestNotificationNum,
    //andriod only 统计相关
    setStatisticsOpen:setStatisticsOpen,

    //通用的方法
    //ios > 0 表示启用了通知,andriod =1 表示启用了通知
    getUserNotificationSettings:getUserNotificationSettings,
    //设置用户的别名,用于区别用户,用手机号设置别名,如果用户未登录,则统一别名为customer.
    setAlias: setAlias,
    setTags:setTags,
    init:init,
    addEventListener:addEventListener
  };
});
