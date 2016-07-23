/**
 * Created by guzhenfu on 2016/7/22.
 */
angular.module('starter')
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    //Demo tabs bottom in android
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');


    //tabs change
    $stateProvider
    //father tab
      .state('tab', {
        url: '/tab',
        templateUrl: 'templates/tabs.html',
        abstract: true
      })

      .state('tab.main',{
        url: '/main',
        views: {
          'tab_main':{
            templateUrl: 'templates/tab_main.html',
            controller: 'mainCtrl'
          }
        }
      })

      .state('tab.mall', {
        url: '/mall',
        views: {
          'tab_mall' : {
            templateUrl: 'templates/tab_mall.html',
            controller: 'mallCtrl'
          }
        }
      })

      .state('tab.order', {
        url: '/order',
        views: {
          'tab_order' : {
            templateUrl: 'templates/tab_order.html',
            controller: 'orderCtrl'
          }
        }
      })

      .state('tab.info', {
        url: '/info',
        views: {
          'tab_info' : {
            templateUrl: 'templates/tab_info.html',
            controller: 'infoCtrl'
          }
        }
      })

      .state('tab.user', {
        url: '/user',
        views: {
          'tab_user' : {
            templateUrl : 'templates/tab_user.html',
            controller: 'userCtrl'
          }
        }
      })


    $urlRouterProvider.otherwise('/tab/main')

  });
