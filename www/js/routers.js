
angular.module('starter')

.config(function($cordovaAppRateProvider,$stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
//禁止侧滑
  $ionicConfigProvider.views.swipeBackEnabled(false);

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  $ionicConfigProvider.scrolling.jsScrolling(false);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  document.addEventListener("deviceready", function () {
    var prefs = {
      language: 'zh-Hans',
      appName: '上海化交',
      promptForNewVersion:true,
      iosURL: '981130489',
      androidURL: "nothing.com"
    };
    // var strings = {
    //   title: '动动手指，为我们打分',
    //   message: '',
    //   cancelButtonLabel: '残忍地拒绝',
    //   laterButtonLabel: '容我考虑考虑',
    //   rateButtonLabel: '马上就去'
    // };
    // $cordovaAppRateProvider.setCustomLocale(strings);
    $cordovaAppRateProvider.setPreferences(prefs)
  }, false);

  //Loading 和 http 请求绑定
  // $httpProvider.interceptors.push(function($rootScope) {
  //   return {
  //     request: function(config) {
  //       $rootScope.$broadcast('loading:show')
  //       return config
  //     },
  //     response: function(response) {
  //       $rootScope.$broadcast('loading:hide')
  //       return response
  //     }
  //   }
  // });
  //$httpProvider.defaults.common.timeout = 5000;

  //$ionicConfigProvider.views.maxCache(30);
  // $httpProvider.defaults.timeout = 10000;

  $stateProvider



  .state('tabs.top', {
    url: '/top',
    views: {
      'tab_top': {
        templateUrl: 'templates/main/main.html',
        controller: 'mainCtrl'  //hdy提示:5个tabbar 的controller 写进 html中了。问题原因参考:
                                  //http://stackoverflow.com/search?q=ionic+tab+badge+update
                                  //http://stackoverflow.com/questions/37843695/ionic-tab-badge-value-not-updating-properly
                                  //http://codepen.io/stich12/pen/Nrrprd?editors=1010#anon-login
      }
    }
  })


  .state('tabs.top_detail', {
    url: '/top_detail/:infoID',
    views: {
      'tab_top': {
        templateUrl: 'templates/inform/info_detail.html',
        controller: 'InfoDetailCtrl'
      }
    }
  })

  .state('tabs.mall', {
    url: '/mall',
    views: {
      'tab_mall': {
        templateUrl: 'templates/mall/mall.html',
        controller: 'mallCtrl'
      }
    }
  })

  .state('tabs.mallDetail', {
    url: '/mallDetail',
    views: {
      'tab_mall': {
        templateUrl: 'templates/mall/mall_detail.html',
        controller: 'mallDetailCtrl'
      }
    }
  })

      .state('tabs.mallInquiry', {
        url: '/mallInquiry',
        views: {
          'tab_mall': {
            templateUrl: 'templates/mall/mall_inquiry.html',
            controller: 'mallInquiryCtrl'
          }
        }
      })

      .state('tabs.mallOrder', {
        url: '/mallOrder',
        views: {
          'tab_mall': {
            templateUrl: 'templates/mall/mall_order.html',
            controller: 'mallOrderCtrl'
          }
        }
      })

    .state('tabs.mainDetail', {
      url: '/mainDetail',
      views: {
        'tab_top': {
          templateUrl: 'templates/main/main_detail.html',
          controller: 'mallDetailCtrl'
        }
      }
    })

      .state('tabs.aboutCompany', {
        url: '/aboutCompany',
        views: {
          'tab_user': {
            templateUrl: 'templates/member/about_company.html',
            controller: 'aboutCompanyCtrl'
          }
        }
      })

      .state('tabs.newsList', {
        url: '/newsList',
        views: {
          'tab_user': {
            templateUrl: 'templates/member/news_list.html',
            controller: 'newsListCtrl'
          }
        }
      })
    .state('tabs.tradeNewsList',{
      url:'./newsList',
      views:{
        tab_order:{
         templateUrl: 'templates/member/news_list.html',
         controller: 'newsListCtrl'
       }
      }
    })

      .state('tabs.offerDetail', {
        url: '/offerDetail',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/offer_detail.html',
            controller: 'orderofferctr'

          }
        }
      })
      .state('tabs.mytrade', {
        cache: false,
        url: '/mytrade',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/my_trade.html',
            controller: 'MyTradeCtrl'

          }
        }
      })
      .state('tabs.mysettlement', {
        url: '/mysettlement',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/my_settlement.html',
            controller: 'MySettlementCtrl'

          }
        }
      })
      .state('tabs.myInquiry', {
        url: '/myInquiry',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/my_inquiry.html',
            controller: 'MyInquiryCtrl'
          }
        }
      })

      .state('tabs.inquiryDetail', {
        url: '/inquiryDetail',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/inquiry_detail.html',
            controller: 'InquiryDetailCtrl'
          }
        }
      })

      .state('tabs.capitalDetail', {
        url: '/capitalDetail/:firmID',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/capital_detail.html',
            controller: 'CapitalDetailCtrl'
          }
        }
      })

      .state('tabs.mySellorder', {
        url: '/mySellorder',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/my_sellorder.html',
            controller: 'MySellorderCtrl'
          }
        }
      })

      .state('tabs.sellorderDetail', {

        url: '/mySellorder/:id',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/sellorder_detail.html',
            controller: 'sellorderDetailCtrl'
          }
        }
      })

    .state('tabs.changeInquiry', {

      url: '/mySellorder',
      views: {
        'tab_order': {
          templateUrl: 'templates/order/change_inquiry.html',
          controller: 'changeInquiryCtrl'
        }
      }
    })

      .state('tabs.receiveInquiry', {
        url: '/receiveInquiry',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/receive_inquiry.html',
            controller: 'ReceiveInquiryCtrl'
          }
        }
      })
      .state('tabs.reinquiryDetail', {
        url: '/reinquiryDetail',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/reinruiry_detail.html',
            controller: 'ReinquiryDetailCtrl'
          }
        }
      })

      .state('tabs.settlementDetail', {
        url: '/settlementDetail',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/settlement_detail.html',
            controller: 'SettlementDetailCtrl'

          }
        }
      })

      .state('tabs.tradePay', {
        url: '/tradePay',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_pay.html',
            controller: 'TradePayCtrl'

          }
        }
      })

      .state('tabs.paySuccess', {
        url: '/paySuccess',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/pay_success.html',
            controller: 'PaySuccessCtrl'

          }
        }
      })

      .state('tabs.enquiryDetail', {
        url: '/enquiryDetail',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/enquiry_detail.html',
            controller: 'enquiryDetailCtrl'

          }
        }
      })

      .state('tabs.tradeDetail', {
        url: '/tradeDetail/:FirmID&:TraderID',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_detail.html',
            controller: 'ordertradectr'

          }
        }
      })
      .state('tabs.tradeInquiry', {
        url: '/tradeInquiry',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_inquiry.html',
            controller: 'TradeInquiryCtrl'
          }
        }
      })
      .state('tabs.tradeSignature', {
        url: '/tradeSignature',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_signature.html',
            controller: 'tradeSignatureCtrl'
          }
        }
      })

      .state('tabs.tradeBreak', {
        url: '/tradeBreak/:OrderID&:QueryType&:ButtonID&:TradeRole',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_break.html',
            controller: 'TradeBreakCtrl'
          }
        }
      })
      .state('tabs.tradeTurn', {
        url: '/tradeTurn',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_turn.html',
            controller: 'TradeTurnCtrl'
          }
        }
      })

      .state('tabs.tradeTake', {
        url: '/tradeTake/:OrderID&:FirmID&:ButtonID',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_take.html',
            controller: 'TradeTakeCtrl'
          }
        }
      })
    .state('tabs.tradeSignatureDetail', {
      url: '/tradeSignatureDetail',
      views: {
        'tab_order': {
          templateUrl: 'templates/order/trade_signature_detail.html',
          controller: 'tradeSignatureCtrl'
        }
      }
    })

    //.state('tabs.tradeDetailbuy', {
    //  url: '/tradeDetailbuy',
    //  views: {
    //    'tab_order': {
    //      templateUrl: 'templates/order/trade_buy_detail.html',
    //      controller: 'ordertradectr'
    //
    //    }
    //  }
    //})

  .state('tabs.order', {
    url: '/order',
    views: {
      'tab_order': {
        templateUrl: 'templates/order/order.html',
        controller: 'orderCtrl'
      }
    }
  })

  // .state('tabs.orderDetail', {
  //   url: '/orderDetail',
  //   views: {
  //     'tab_order': {
  //       templateUrl: 'templates/order/order_detail.html',
  //       controller: 'defaultCtrl'
  //     }
  //   }
  // })

  .state('tabs.info', {
    url: '/info',
    views: {
      'tab_info': {
        templateUrl: 'templates/inform/info.html',
        controller: 'infoCtrl'
      }
    }
  })


    .state('tabs.info_detail', {
      url: '/info_detail/:infoID',
      views: {
        'tab_info': {
          templateUrl: 'templates/inform/info_detail.html',
          controller: 'InfoDetailCtrl'
        }
      }
    })



    .state('tabs.infoKChartDeatil', {
      url:'/infoKChartDetail',
      views:{
        'tab_info':{
          templateUrl:'templates/inform/info_KChartDetail.html',
          controller:'infoKChartDetailCtrl'
        }
      }
    })



  .state('tabs.user', {
    url: '/user',
    views: {
      'tab_user': {
        templateUrl: 'templates/member/user.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true,
    controller:'TabCtrl'
  })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/member/winLogin.html',
      controller: 'loginCtrl'
    })
    // .state('tabs.topLogin', {
    //   url: '/login',
    //   views:{
    //     'tab_top':{
    //       templateUrl: 'templates/member/winLogin.html',
    //       controller: 'loginCtrl'
    //     }
    //   }
    // })
    // .state('tabs.mallLogin', {
    //   url: '/login',
    //   views:{
    //     'tab_mall':{
    //       templateUrl: 'templates/member/winLogin.html',
    //       controller: 'loginCtrl'
    //     }
    //   }
    // })
    // .state('tabs.orderLogin', {
    //   url: '/login',
    //   views:{
    //     'tab_order':{
    //       templateUrl: 'templates/member/winLogin.html',
    //       controller: 'loginCtrl'
    //     }
    //   }
    // })
    // .state('tabs.infoLogin', {
    //   url: '/login',
    //   views:{
    //     'tab_info':{
    //       templateUrl: 'templates/member/winLogin.html',
    //       controller: 'loginCtrl'
    //     }
    //   }
    // })
    // .state('tabs.userLogin', {
    //   url: '/login',
    //   views:{
    //     'tab_user':{
    //       templateUrl: 'templates/member/winLogin.html',
    //       controller: 'loginCtrl'
    //     }
    //   }
    // })
  .state('verifyPhone', {
    url: '/verifyPhone',
    templateUrl: 'templates/member/winVerifyPhone.html',
	  controller: 'RegisterController'
  })

   .state('tabs.modifyPass', {
     url: '/modifyPass',
     views: {
       'tab_user': {
         templateUrl: 'templates/member/modify_pass.html',
         controller: 'ModifyPassCtrl'
       }
     }
   })
    .state('tabs.modifyPaymentPwd',{
      url:'/modifyPaymentPwd',
      views:{
        'tab_user': {
          templateUrl: 'templates/member/SetPaymentPwd.html',
          controller: 'SetPaymentPwdCtrl'
        }
      }
    })

  // .state('regist', {
  //   url: '/regist',
  //   templateUrl: 'templates/member/winRegisterView.html',
	//   controller: 'RegisterController'
  // })



  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'searchCtrl'
  })

    .state('forgetPass', {
      url: '/forgetPass',
      templateUrl: 'templates/member/modify_pass.html',
      controller: 'ModifyPassCtrl'//修改用户名和忘记密码的界面相同
    })

      .state('codeLogin', {
        url: '/codeLogin',
        templateUrl: 'templates/member/code_login.html',
        controller: 'CodeLoginCtrl'
      })

      .state('tabs.viewOrder', {
        url: '/viewOrder',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/trade_signature_detail.html'
          }
        }
      })

      .state('tabs.pdfView', {
        url: '/pdfView',
        views: {
          'tab_order': {
            templateUrl: 'templates/order/pdf_view.html',
            controller: 'PdfViewCtrl'
          }
        }
      })

$urlRouterProvider.otherwise('/tabs/top')



});

