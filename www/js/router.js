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
      .state('tabs.main',{
        url: '/main',
        views: {
          'tab_main':{
            templateUrl: 'templates/main.html',
            controller: 'mainCtrl'
          }
        }
      })

      .state('tabs.mall', {
        url: '/mall',
        views: {
          'tab_mall' : {
            templateUrl: 'templates/mall.html',
            controller: 'mallCtrl'
          }
        }
      })

      .state('tabs.user', {
        url: '/user',
        views: {
          'tab_user' : {
            templateUrl : 'templates/user.html',
            controller: 'userCtrl'
          }
        }
      })
      //father tab
      .state('tabs', {
        url: '/tabs',
        templateUrl: 'templates/tabs.html',
        abstract: true
      })

    $urlRouterProvider.otherwise('/tabs/main')

  });
