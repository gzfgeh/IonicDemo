/**
 * Created by lizhihua on 2016/7/20.
 */
angular.module('starter.controllers')
  .controller('userCtrl',function ($cordovaFile,$cordovaFileTransfer,$cordovaCamera,$cordovaActionSheet,
                                   BadgeService,$scope, $state,$ionicHistory,shcemUtil,$rootScope,
                                   UserProductService,UserService,$cordovaImagePicker,$ionicPlatform,
                                   $cordovaDialogs,Push,$cordovaAppVersion,$cordovaAppRate,AppVersion,
                                   $ionicPopup) {
  $scope.master = {};
  $scope.accountData = angular.copy({});
  $scope.$on('$ionicView.loaded',function () {
  });
  $scope.$on('$ionicView.beforeEnter',function () {
    $rootScope.hideTabs = ' ';
    initPara();
    //shcemUtil.showLoading();
    UserService.getUserInfo(function (token,ret,msg) {
    //  shcemUtil.hideLoading();
      $scope.paymentPwdStatus = ret.HasPaymentPwd;
      if(ret.FirmID){
        $scope.firmID = ret.FirmID;
      }else{
        $scope.firmID = "-";
      }

      getAvatar();
      getUserInfoDetail(ret.FirmID);//获取用户的额外信息
      updateMsgCount();//更新消息列表
    },function (msg,code) {
      shcemUtil.hideLoading();
      if(UserService.isAuthenticated()){
        shcemUtil.showMsg("获取用户信息失败");
      }
      UserService.checkToken(code);
      if(!UserService.isAuthenticated()){
        clearUserInfo();
      }
    });

    $rootScope.keyboardClick = function(value){
      for(var i = 0;i< $scope.paymentPwd.length;i++){
        if($scope.paymentPwd[i].name.length == 0){
          $scope.paymentPwd[i].name = value.toString();
          break;
        }
      }
    };
    $rootScope.keyboardDelete = function() {
      for(var i = 5;i>-1;i--){
        if($scope.paymentPwd[i].name.length > 0){
          $scope.paymentPwd[i].name = "";
          break;
        }
      }
    };
    $rootScope.keyboardFinish = function(value){
      var pwd = "";
      for(var i = 0;i < $scope.paymentPwd.length;i++){
        var v = $scope.paymentPwd[i].name;
        if(v.length == 0 ){
          if(value){
            value.preventDefault();
          }
          shcemUtil.showMsg("长度必须是6位");
          return false;
        }
        if(v.charCodeAt(0)< 47 || v.charCodeAt(0)>57){
          if(value){
            value.preventDefault();
          }
          shcemUtil.showMsg("必须是6位数字");
          return;
        }
        pwd =  pwd.concat(v);
      }
      $rootScope.keyboardHide = "hide";
      shcemUtil.showLoading();
      UserService.setPaymentPwd(pwd,function (ret) {
        shcemUtil.hideLoading();
        //console.log("设置支付密码成功");
        shcemUtil.showMsg("设置支付密码成功");
        UserService.setPaymentPwdStatus(1);
        $scope.paymentPwdStatus = true;
      },function (err) {
        shcemUtil.hideLoading();
        //console.log("设置支付密码失败");
        shcemUtil.showMsg(err);
      });
      return true;
    };

  });
  var clearUserInfo = function () {
    initPara();
    $scope.mobile = "用户未登录";
    $scope.hasRedPoint = false;
    $scope.msgCount = 0;    //消息数量
    UserProductService.clearUserDetailInfo();//用户没有登录的时候需要清除
    $scope.firmID = "-";
  };
  var getAvatar = function () {
    UserService.getUserAvatar(function (ret) {
      $scope.imgSrc = ret;
    },function (err) {
        $scope.imgSrc = UserService.userAvatar();
    });
  };
  var updateMsgCount = function () {
    $scope.hasRedPoint = true;
    var c = BadgeService.notificationInfo.minePage.length;
    $scope.msgCount = c;
    if(!$scope.msgCount || $scope.msgCount == 0){
      $scope.hasRedPoint = false;
    }
  };
  var getUserInfoDetail = function (firmID) {
    if(!firmID || firmID.length == 0){
      $scope.panCount = 0;    //发盘次数
      $scope.totalPrice = 0;  //总金额
      $scope.sellCount = 0;   //发盘次数
      $scope.buyCount = 0;
      $scope.capital = 0;     //资金金额
      $scope.dealer = '-';      //交易商
    //  $scope.msgCount = 0;    //消息数量
      return;
    }
    UserProductService.getDaysInfo(firmID,0,function (leadsCount,orderWeight) {
      $scope.panCount = leadsCount;//更新发盘次数
      $scope.sellCount = orderWeight;
    },function (err,code) {
      var failedCheck =  UserService.checkToken(code);
      if(!failedCheck){
        $scope.panCount = UserProductService.leadsCount();
        $scope.sellCount = UserProductService.orderWeight();
      }else{
        clearUserInfo();
      }
    });
    UserProductService.getDaysInfo(firmID,1,function (orderWeight) {
      $scope.buyCount = orderWeight;
    },function (err,code) {
      var failedCheck =  UserService.checkToken(code);
      if(!failedCheck){
        $scope.buyCount = UserProductService.orderWeight1();
      }else{
        clearUserInfo();
      }
    });
    UserProductService.getMoneyCount(firmID,function (ret) {
      if(ret.DATA){
        var floatTotal = ret.DATA.USERBALANCEFromOra + ret.DATA.BALANCEFromS;
        $scope.totalPrice = changeTwoDecimal_f(floatTotal);
        $scope.capital = ret.DATA.BALANCEFromS;
        if(!ret.DATA.LASTBALANCEFromS){
          $scope.capital = 0;
        }
        $scope.dealer = ret.DATA.FIRMNAME;
        if(!ret.DATA.FIRMNAME || ret.DATA.FIRMNAME.length == 0){
          $scope.dealer = "-";
        }
      }
    },function (err,code) {
      var failedCheck =  UserService.checkToken(code);
      if(!failedCheck){
        var floatTotal = UserProductService.USERBALANCEFromOra() + UserProductService.BALANCEFromS();
        $scope.totalPrice = changeTwoDecimal_f(floatTotal);
        $scope.capital = UserProductService.BALANCEFromS();
        $scope.dealer = UserProductService.FIRMNAME();
      }else{
        clearUserInfo();
      }
    })
  };
  var initPara = function () {
    $scope.panCount = UserProductService.leadsCount();    //发盘次数
    var floatTotal = UserProductService.USERBALANCEFromOra() + UserProductService.BALANCEFromS();
    $scope.totalPrice = changeTwoDecimal_f(floatTotal);   //总金额
   // $scope.dealCount = UserProductService.orderWeight();   //发盘次数
    $scope.capital = UserProductService.BALANCEFromS();     //资金金额
    $scope.dealer = UserProductService.FIRMNAME();      //交易商
    $scope.sellCount = UserProductService.orderWeight();
    $scope.buyCount = UserProductService.orderWeight1();
    updateMsgCount();
    $scope.imgSrc=UserService.userAvatar();
    if(UserService.isAuthenticated()){
      $scope.loginStatus = "退出";
    }else{
      $scope.loginStatus = "点击登录";
    }
    $scope.mobile = UserService.mobile();
    $scope.paymentPwdStatus = false;
    if(!$scope.versionNum){
      document.addEventListener("deviceready", function () {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          $scope.versionNum = version;
        });
      });
    }
    $scope.paymentPwd =[
      {
        name:''
      },{
        name:''
      },{
        name:''
      },{
        name:''
      },{
        name:''
      },{
        name:''
      }];
  };
  $scope.goToTrade = function () {
    $state.go("tabs.order");
  };
  $scope.msgClicked = function () {//消息点击清除角标
    BadgeService.notificationInfo.minePage = [];
    Push.setApplicationIconBadgeNumber(0);//清除应用图标上的数字
    Push.setBadge(0);//向服务器发送清除应用图标的标志。
  //  $rootScope.$broadcast("updateBadge");
    if(UserService.isAuthenticated()){
      $state.go("tabs.newsList");
    }else{
      shcemUtil.showMsg("请登录后查看");
    }

  };
  $scope.setPaymentPwd = function () {
    if(UserService.isAuthenticated()){
      if(!(UserService.getUserInfoFromCache())){
        shcemUtil.showMsg("获取用户信息失败,无法操作");
        return;
      }
      if($scope.paymentPwdStatus){
       // alert("有支付密码");
        $state.go('tabs.modifyPaymentPwd');
      }else{
       // alert("没有支付密码");
        $rootScope.keyboardHide = "show";
        $scope.paymentPwd =[
          {
            name:''
          },{
            name:''
          },{
            name:''
          },{
            name:''
          },{
            name:''
          },{
            name:''
          }];
        var alertPopup = $ionicPopup.alert({
          title:"设置支付密码",
          templateUrl:"templates/member/PaymentDialog.html",
          scope:$scope,
          buttons: [{
              text: '取消',
              type: 'cus-dialog-btn1',
              onTap: function(e) {
                $rootScope.keyboardHide = "hide";
              }
            }, {
              text: '确定',
              type: 'button-positive cus-dialog-btn2',
              onTap: $rootScope.keyboardFinish
            }
          ]
        });
      }
    }else{
      shcemUtil.showMsg("请登录后设置");
    }
  };

  $scope.loginOut=function() {
    if(UserService.isAuthenticated()){
      $ionicPlatform.ready(function () {
        $cordovaDialogs.confirm("确定要退出吗?","提示",["取消","确定"])
          .then(function (buttonIndex) {
            if(buttonIndex == 2){
              UserService.logout();//函数内清除缓存数据
              BadgeService.notificationInfo.minePage = [];//退出登陆清除角标,更改推送别名
              $rootScope.$broadcast("updateBadge");//更新tabBar角标
              Push.setAlias();//重新设置推送别名
              UserProductService.clearUserDetailInfo();//清除用户其他数据
              $state.go("login");
            }
          });
      });
    }else{
      $state.go("login");
    }
  };
  $scope.imgPicker=function(){
    if(UserService.isAuthenticated()){
      $ionicPlatform.ready(function(){
        var actionOption = {
          title: '选择头像',
          buttonLabels: ['拍照', '相册'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton : true//,
         // addDestructiveButtonWithLabel : 'Delete it'
        };
        $cordovaActionSheet.show(actionOption)
          .then(function(btnIndex) {
            $ionicPlatform.ready(function() {
              // Any cordova plugins need to be fired in here
              switch(btnIndex){
                case 1:
                  getPictureFromCamera();
                  break;
                case 2:
                  getPictureFromPhotos();
                  break;
              }
            });
          });
      }, false);

    }else{
      $state.go("login");
    }
  };
  $scope.checkForNewVersion = function () {
    // document.addEventListener("deviceready", function () {
    //   $cordovaAppRate.promptForRating(true).then(function (result) {
    //     // success
    //   });
    // }, false);
   // isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  //  if(isiOS){
  //     AppVersion.getVersion($scope.versionNum);
  //  }else{
    //  shcemUtil.checkVersion();
  //  }

  };
  var getPictureFromPhotos = function () {
    var options = {
      maximumImagesCount: 1,
      width: 400,
      height: 400,
      quality: 100
    };
    $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for(var i = 0; i < results.length; i++) {
        var uri = results[i];
        shcemUtil.showLoading();
        UserService.uploadAvatar(uri,function (ret) {
          shcemUtil.hideLoading();
        //  alert("返回成功" + JSON.stringify(ret));
          if(ret.responseCode == 200){
            dealWithResponse(ret);
          }else{
            shcemUtil.showMsg("上传头像失败");
          }
        },function (err) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg("上传头像失败");
        });
        break;
      }
    }, function(error) {
    });
  };
  var getPictureFromCamera = function () {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      shcemUtil.showLoading();
      UserService.uploadAvatar(imageURI,function (ret) {
        shcemUtil.hideLoading();
        if(ret.responseCode == 200){
          dealWithResponse(ret);
        }else{
          shcemUtil.showMsg("上传头像失败");
        }
      },function (err) {
        shcemUtil.hideLoading();
        shcemUtil.showMsg("上传头像失败");
      });
    }, function(err) {
    });
  };

  var dealWithResponse = function (ret) {
    if(ret){
      var response = ret.response;
    //  alert(response);
      if(response){
        var jsonObj = JSON.parse(response);
        var data = JSON.parse(jsonObj.data);
        if(data){
          UserService.setUserAvatar(data)
            .then(function (ret) {
       //       alert(JSON.stringify(data));
              if(data.SourceUrl){
                $scope.imgSrc = data.SourceUrl;
              }else{
                $scope.imgSrc = 'img/pic-default.png';
              }
            },function (err) {
              shcemUtil.showMsg("图片上传失败");
            })
        }
      }
    }
  };
  var moveFileToCache = function (uri) {
    $ionicPlatform.ready(function() {
      var u = navigator.userAgent;
      //  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isiOS){
        if(uri){
          var array = uri.split("/");
          var imageName;
          if (array.constructor == Array){
            imageName = array[array.length -1];
          }
          var d = new Date();
          var newImageName = d.getTime().toString() +  imageName;//新的头像的名字,以时间为参数来更新URI
          if(imageName){
            $cordovaFile.moveFile(cordova.file.tempDirectory,imageName,cordova.file.cacheDirectory,newImageName)
              .then(function (ret) {
                var uriFinal = cordova.file.cacheDirectory + newImageName;
                UserService.setUserAvatar(newImageName);
                $scope.imgSrc = uriFinal;
               // console.log("重新设置图片 +"+ uriFinal);
              },function (err) {
              });
          }
        }
      }
    });


  };
  //浮点数截断
  var changeTwoDecimal_f= function (floatvar){
    var f_x = parseFloat(floatvar);
    if (isNaN(f_x)){
      return '0.00';
    }
    var f_x = Math.round(f_x*100)/100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0){
      pos_decimal = s_x.length;
      s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2){
      s_x += '0';
    }
    return s_x;
  }
  })
.controller('loginCtrl',function (Push,$scope,$state,$ionicHistory,$rootScope,UserService,shcemUtil,BadgeService) {
    $scope.master = {};
    $scope.accountData = angular.copy({});

    var validate=function(){
      if(!$scope.accountData.mobileNo){
        shcemUtil.showMsg('请输入手机号');
        return false;
      }else if($scope.accountData.mobileNo.length < 11){
        shcemUtil.showMsg('手机号码格式错误');
        return false;
      }
      if(!$scope.accountData.password){
        shcemUtil.showMsg('请输入密码');
        return false;
      }
      return true;
    };
    $scope.doLogin = function() {
      if (!validate()) {
        return;
      }
      shcemUtil.showLoading();
      UserService.loginWithPwd($scope.accountData)
        .then(function (ret) {
          shcemUtil.hideLoading();
          Push.setAlias();
          shcemUtil.showMsg('登录成功');
          BadgeService.getUnreadCount();
          $state.go('tabs.user');
        },function (err) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg(err);
        })
    };
    $scope.gotoVerifyPhone = function () {
      $state.go("verifyPhone");
    };
    $scope.forgetPwdClicked = function () {
      $state.go("modifyPass");
    };
    $scope.goBack = function () {
      $state.go('tabs.user');
    }

  })
.controller('RegisterController',function ($scope, $state,$ionicHistory,$rootScope,UserService,shcemUtil) {
    $scope.master = {};
    $scope.user = angular.copy({});

    //验证手机号
    var verifyPhoneNum = function () {
      if(!$scope.user.phone){
        shcemUtil.showMsg("请输入手机号");
        return false;
      }else if($scope.user.phone.length < 11){
        shcemUtil.showMsg("手机号码长度不正确");
        return false;
      }
      return true;
    };

    //注册
    $scope.getCode = function () {
      if(verifyPhoneNum()){

        UserService.checkExistPhone($scope.user.phone,function (r) {
          var postData = {
            Mobiles:$scope.user.phone
          };
          shcemUtil.showLoading();
          UserService.getRegisterCode(postData)
            .then(function (ret) {
              shcemUtil.hideLoading();
              shcemUtil.showMsg('发送成功');
            },function (err) {
              shcemUtil.hideLoading();
              shcemUtil.showMsg(err);
            });
        },function (err) {
          shcemUtil.showMsg("此账号已在"+err+"注册");
        });
      }
    };
    //
    var verifyCodeNum = function () {
      if(!verifyPhoneNum()){
        return false;
      }
      if(!$scope.user.verifycode){
        shcemUtil.showMsg('请输入验证码');
        return false;
      }
      if($scope.user.verifycode.length < 6){
        shcemUtil.showMsg("验证码长度不正确");
        return false;
      }
      // if($scope.user.email == undefined){
      //   shcemUtil.showMsg("邮箱格式不正确");
      //   return false;
      // }
      if($scope.user.email && $scope.user.email.length > 0){
        if(!CheckMail($scope.user.email)){
          shcemUtil.showMsg("邮箱格式不正确");
          return false;
        }
      }
      if(!$scope.user.name){
        shcemUtil.showMsg("请填写用户名");
        return false;
      }
      if(!$scope.user.password){
        shcemUtil.showMsg("请设定密码");
        return false;
      }
      if($scope.user.password.length < 6){
        shcemUtil.showMsg("密码长度过短");
        return false;
      }
      if(!$scope.user.verifyPwd){
        shcemUtil.showMsg("请输入确认密码");
        return false;
      }
      if($scope.user.verifyPwd != $scope.user.password){
        shcemUtil.showMsg("两次密码输入不一致");
        return false;
      }
      return true;
    };
  function CheckMail(mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail)) return true;
    else {
     // alert('您的电子邮件格式不正确');
      return false;
    }
  }
    $scope.register = function () {
     // console.log("点击注册");
      if(verifyCodeNum()){
        if(!$scope.user.email){
          $scope.user.email = "";
        }
        var postData = {
          Mobile:$scope.user.phone,
          VerifyCode:$scope.user.verifycode,
          Password:$scope.user.password,
          ClientName:$scope.user.name,
          UserEmail:$scope.user.email
        };
        UserService.registerWithCode(postData)
          .then(function (ret) {
            shcemUtil.showMsg("注册成功");
            $state.go("login");
          },function (err) {
            shcemUtil.showMsg(err);
          });
      }
    };
    $scope.gotoRegist = function() {
      $state.go("regist");
    };
  })
.controller('ModifyPassCtrl',function ($scope,$state,UserService,shcemUtil,$rootScope) {

    $scope.master = {};
    $scope.user = angular.copy({});
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = 'tabs-item-hide';
    });

    var checkPhoneNum = function () {
      if(!$scope.user.phone || $scope.user.phone.length == 0){
        shcemUtil.showMsg("手机号不能为空哦");
        return false;
      }else if($scope.user.phone.length != 11){
        shcemUtil.showMsg("手机号码长度不正确哦");
        return false;
      }
      return true;
    };

    var readyForCheck = function () {
      if(!checkPhoneNum()){
        return false;
      }
      if(!$scope.user.code || $scope.user.code.length < 6 ){
        shcemUtil.showMsg("验证码为6位数字");
        return false;
      }
      if(!$scope.user.pwd || $scope.user.pwd.length < 6){
        shcemUtil.showMsg("密码长度需大于5位");
        return false;
      }
      if(!$scope.user.verifyPwd || $scope.user.pwd != $scope.user.verifyPwd){
        shcemUtil.showMsg("两次密码输入不一致");
        return false;
      }
      return true;
    };


    $scope.getCode = function () {
      if(!checkPhoneNum()){
        return;
      }
      UserService.checkExistPhone($scope.user.phone,function (r) {
        shcemUtil.showMsg("账号不存在");
      },function (err) {
        var postData = {
          Mobiles:$scope.user.phone
        };
        shcemUtil.showLoading();
        UserService.getChangePwdCode(postData)
          .then(function (ret) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg("获取验证码成功");
          },function (err) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg(err);
          });
      });

    };
    $scope.submit = function () {
    //  console.log("提交按钮点击");
      if(readyForCheck()){
        var postData = {
          Mobile:$scope.user.phone,
          VerifyCode:$scope.user.code,
          NewPassword:$scope.user.pwd
        };
        UserService.changePwdWithCode(postData)
          .then(function (ret) {
            shcemUtil.showMsg("修改成功,请重新登录");
            UserService.logout();     //修改密码成功后,需要清除上个用户数据,这个账号跳转到登陆
            $state.go('login');
          },function (err) {
            shcemUtil.showMsg(err);
          });
      }
    };
  })
.controller('ForgetPassCtrl',function ($scope,$state,UserService,shcemUtil,$rootScope) {

})
.controller('CodeLoginCtrl',function (Push,$scope,$state,UserService,shcemUtil,$rootScope,BadgeService) {
  $scope.user = angular.copy({});

  var verifyPhone = function () {
    if(!$scope.user.phone || $scope.user.phone.length == 0){
      shcemUtil.showMsg("手机号不能为空哦");
      return false;
    }else if($scope.user.phone.length < 11){
      shcemUtil.showMsg("手机号码不正确");
      return false;
    }
    return true;
  };

  var verifyCode = function () {//code的类型是字符串
    if(!$scope.user.code || $scope.user.code.length == 0){
      shcemUtil.showMsg("验证码不能为空哦");
      return false;
    }else if($scope.user.code.length < 6){
      shcemUtil.showMsg("验证码长度不正确哦");
      return false;
    }
    return true;
  };

  $scope.getCode = function () {
    if(verifyPhone()){
      UserService.checkExistPhone($scope.user.phone,function (r) {
        shcemUtil.showMsg("账号不存在");
      },function (err) {
        shcemUtil.showLoading();
        var postData = {
          Mobiles:$scope.user.phone
        };
        UserService.getLoginCode(postData)
          .then(function (ret) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg("获取验证码成功");
          },function (err) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg(err);
          })
      });
    }
  };
  $scope.doLogin = function () {
    if(verifyPhone() && verifyCode()){
      var postData = {
        Mobile:$scope.user.phone,
        VerifyCode:$scope.user.code
      };
      UserService.loginWithCode(postData)
        .then(function (ret) {
          var data = {
            mobileNo:$scope.user.phone
          };
          UserService.loginAfterVerify(data)
            .then(function (ret) {
              shcemUtil.showMsg("登录成功");
              Push.setAlias();
              BadgeService.getUnreadCount();

              $state.go('tabs.user');
            },function (err) {
              shcemUtil.showMsg(err);
            });
        },function (err) {
          shcemUtil.showMsg(err);
        });
    }

  };
  $scope.gotoVerifyPhone = function () {
    $state.go("verifyPhone");
  };

})
.controller('aboutCompanyCtrl',function ($scope,$rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hideTabs = 'tabs-item-hide';
  });
})
.controller('newsListCtrl',function ($scope,$rootScope,BadgeService,shcemUtil,$ionicScrollDelegate) {

  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = 'tabs-item-hide';
    $scope.showLoading = true;
  });
  $scope.$on('$ionicView.enter', function () {
    $scope.needLoadMore = false;
    $scope.pageCount = 0;       //no view
    $scope.doRefresh();
  });
  $scope.doRefresh = function () {
    $scope.pageCount = 1;//上啦刷新的时候需要把page置为1
    $scope.needLoadMore = false;
    getMsg($scope.pageCount);
  };
  $scope.loadMore = function () {
      getMsg($scope.pageCount+1);
    //  console.log("加载更多");
  };
  var getMsg = function (count) {
    shcemUtil.showLoading();
    BadgeService.getMsg(count,10,function (ret) {
      shcemUtil.hideLoading();
      if(ret.DATA.result && ret.DATA.result.length == 10){
       // console.log("可以加载更多");
        $scope.needLoadMore = true;
      }else{
        $scope.needLoadMore = false;
      }
      if($scope.pageCount == 1){
        $scope.model = ret.DATA.result;
        if($scope.model){
          for(var i = 0;i<$scope.model.length;i++){
            $scope.model[i].recModifytime =ret.DATA.result[i].recModifytime.substring(0,ret.DATA.result[i].recModifytime.length-5);
          }
        }
       // console.log("第一次加载");
      }else{
        shcemUtil.hideLoading();
        if(ret.DATA.result && ret.DATA.result.constructor == Array){
          for(var i= 0;i<ret.DATA.result.length;i++){
            ret.DATA.result[i].recModifytime = ret.DATA.result[i].recModifytime.substring(0,ret.DATA.result[i].recModifytime.length-5);
            $scope.model.push(ret.DATA.result[i]);
          }
       //   console.log("加载完数据" + $scope.model.length);
        }
      }
      $scope.pageCount++;
      $scope.showLoading = false;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    },function (err) {
      $scope.showLoading = false;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
      shcemUtil.showMsg(err);
    })
  };

})
.controller('SetPaymentPwdCtrl',function ($scope,$state,UserService,shcemUtil,$rootScope) {
  $scope.master = {};
  $scope.user = angular.copy({});
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hideTabs = 'tabs-item-hide';
  });

  var checkPhoneNum = function () {
    if(!$scope.user.phone || $scope.user.phone.length == 0){
      shcemUtil.showMsg("手机号不能为空哦");
      return false;
    }else if($scope.user.phone.length != 11){
      shcemUtil.showMsg("手机号码长度不正确哦");
      return false;
    }
    return true;
  };

  var readyForCheck = function () {
    if(!checkPhoneNum()){
      return false;
    }
    if(!$scope.user.code || $scope.user.code.length < 6 ){
      shcemUtil.showMsg("验证码为6位数字");
      return false;
    }
    if(!$scope.user.pwd){
      shcemUtil.showMsg("支付密码必须是6位数字");
      return false;
    }
    if($scope.user.pwd.length != 6){
      shcemUtil.showMsg("支付密码长度为必须为6");
      return false;
    }
    if(!$scope.user.verifyPwd || $scope.user.pwd != $scope.user.verifyPwd){
      shcemUtil.showMsg("确认密码不匹配");
      return false;
    }
    return true;
  };

  $scope.getCode = function () {
    if(!checkPhoneNum()){
      return;
    }
    UserService.checkExistPhone($scope.user.phone,function (r) {
      shcemUtil.showMsg("账号不存在");
    },function (err) {
      var postData = {
        Mobiles:$scope.user.phone
      };
      shcemUtil.showLoading();
      UserService.getPaymentCode(postData)
        .then(function (ret) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg("获取验证码成功");
        },function (err) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg(err);
        });
    });

  };
  $scope.submit = function () {
    //  console.log("提交按钮点击");
    if(readyForCheck()){
      shcemUtil.showLoading();
      UserService.verifyPaymentCode({ Mobile:$scope.user.phone,
        VerifyCode:$scope.user.code})
        .then(function (ret) {
          var postData = {
            phone:$scope.user.phone,
            code:$scope.user.code,
            pwd:$scope.user.pwd
          };
          UserService.modifyPaymentCode(postData,function (ret) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg("修改支付密码成功");
            $state.go('tabs.user');
          },function (err) {
            shcemUtil.hideLoading();
            shcemUtil.showMsg(err);
          })

        },function (err) {
          shcemUtil.hideLoading();
          shcemUtil.showMsg(err);
        });

    }
  };
});
