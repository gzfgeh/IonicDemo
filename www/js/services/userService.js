
/*
 *Create by HDY 2016-07-27
 */

angular.module('starter.services')
//smCode: s0001 注册验证码
//smsCode : s0002 找回密码
//smsCode: s0003 登陆验证
  .service('UserService',function (shcemUtil,$q,$cordovaFileTransfer,$http,config) {
    var mobileNum = '';
    var token = '';
    var userAvatarURI;
    var userInfoDetail;//需要内存缓存的对象
    var isAuthenticated = false;//用户存在标志位
    var USER_CODE_KEY = 'USER_CODE_KEY';//存储的是token 和 mobile

    var getCodeService = "Shcem.CommonServiceContract.IVerifyCodeMobileService";
    var verifyCodeService = "Shcem.CommonServiceContract.IVerifyCodeMobileService";
    var passwordService = "Shcem.Member.ServiceContract.IClientLoginService";

    //检查手机号存在
    var checkExistPhoneNum = function (number,succ,err) {
      var par = {
        MobileNo: number,
        authkeyid: "t_testuse"
      };
      var postData = {
        json: {
          MethodName: "CheckExistUserMobile",
          ServiceName: "Shcem.Member.ServiceContract.IClientLoginService",
          Params: JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
          if (ret.DATA == "0") {
            succ(ret.DATA);
          } else {
            err(ret.DATA);
          }
        })
        .error(function (e) {
          err(e);
        });
    };
    var checkExistEmail = function (email,succ,err) {
      var par = {
        UserEmail:email
      };
      var postData = {
        json:{
          MethodName:"CheckExistUserEmail",
          ServiceName:"Shcem.Member.ServiceContract.IClientLoginService",
          Params:JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
          if(ret.CODE == "MSG00000"){

          }
        })
        .error(function (err) {

        })
    };
    //设置支付密码
    var setPaymentPwd = function (pwd,succ,err) {
      var par = {
        UserCode:userInfoDetail.UserCode,
        NewPassword:pwd
      };
      var postData = {
        json:{
          MethodName:"ChangePaymentPwd",
          ServiceName:"Shcem.Member.ServiceContract.IClientLoginService",
          Params:JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
          if(ret.CODE == "MSG00000"){
            succ(ret.DATA);
          }else{
            err(ret.INFO);
            checkToken(ret.CODE);
          }
        })
        .error(function (e) {
            err("设置支付密码失败");
        })
    };

    var getPaymentCode = function (data) {
      data.Smscode = 'S0016';
      data.UserCode = '';
      var par = {
        requestData:data,
        resolveCode:"MSG00000",
        resolveMsg:"获取验证码成功",
        rejectMsg:"获取验证码失败"
      };
      return requestCode(par);
    };

    var verifyPaymentCode = function (data) {
      data.Smscode = 'S0016';
      data.UserCode = '';
      var par = {
        requestData:data,
        resolveCode:"MSG00000",
        resolveMsg:"验证成功",
        rejectMsg:"验证失败"
      };
      return verifyCode(par,false);
    };

    var modifyPaymentCode = function (data,succ,err) {
      var par = {
        Type:1,
        UserKey:data.phone,
        Code:data.code,
        NewPassword:data.pwd
      };
      var postData = {
        json:{
          MethodName:"ForgetPaymentPwd",
          ServiceName:"Shcem.Member.ServiceContract.IClientLoginService",
          Params:JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
            if(ret.CODE == "MSG00000"){
              succ(ret.DATA);
            }else{
              err(ret.INFO);
            }
        })
        .error(function (e) {
            err("修改失败");
        })
    };

    //获取注册验证码
    /*
     * registerData={
     *    Mobiles:'139xxxxxxxx',
     *    SmsCode:'S0001'
     * }
     */
    var getRegisterCode = function (registerData) {
      registerData.Smscode = 'S0001';
      registerData.UserCode = '';
      var parameter = {
        requestData:registerData,
        resolveCode:"MSG00000",
        resolveMsg:"获取验证码成功",
        rejectMsg:"获取验证码失败"
      };
      return requestCode(parameter);
    };
    //手机号+验证码注册
    /*
     *registerData={
     *  Mobile:"182xxxxxxxx",
     *  smsCode:'S0001',
     * }
     */
    var doRegisterWithCode = function (registerData) {
      registerData.SmsCode = 'S0001';
      registerData.AppType = 1;
      var parameter = {
        methodName:"Register",
        requestData:registerData,
        resolveCode:"MSG00000",
        resolveMsg:"注册成功",
        rejectMsg:"注册失败"
      };
      return request(parameter);
    };
    //手机号+密码注册:无页面
    var doRegisterWithPwd = function (registerData) {
      var parameter = {
        methodName:"Register",
        requestData:registerData,
        resolveCode:"MSG00000",
        resolveMsg:"注册成功",
        rejectMsg:"注册失败"
      };
      return request(parameter);
    };
    //获取登陆验证码
    /*
     * loginData = {
     *     Mobiles:'139xxxxxxxx',
     *    SmsCode:'S0003'
     * }
     */
    var getLoginCode = function (loginData) {
      loginData.SmsCode = 'S0003';
      loginData.UserCode = '';
      var parameter = {
        requestData:loginData,
        resolveCode:"MSG00000",
        resolveMsg:"获取验证码成功",
        rejectMsg:"获取验证码失败"
      };
      return requestCode(parameter);
    };
    //手机号+验证码 验证
    var doLoginWithCode = function(loginData) {
      loginData.SmsCode = 'S0003';
      //loginData.UserCode = '';
      var parameter = {
        requestData:loginData,
        resolveCode:"MSG00000",
        resolveMsg:"登陆成功",
        rejectMsg:"登陆失败"
      };
      //return request(parameter,true);
      return verifyCode(parameter,false);
    };
    //验证成功后用这个登录
    var loginAfterVerify = function (loginData) {
      var data = {
        Platform:"shcem.com",
        IsBackend:false,
        LoginName:loginData.mobileNo,
        IsDynamicLogin:true,
        Origin:"app"
      };
      var parameter = {
        MethodName:"LoginForToken",
        requestData:data,
        resolveCode:"00000",  //2.1.0后服务被修改
        resolveMsg:"登陆成功",
        rejectMsg:"登陆失败"
      };
      return req(parameter,passwordService,parameter.MethodName,true);
    };

    //手机号+密码登陆
    var doLoginWithPwd = function (loginData) {
      //old parameter
      // var parameter = {
      //   methodName:"Login",
      //   requestData:loginData,
      //   resolveCode:"MSG00000",
      //   resolveMsg:"登陆成功",
      //   rejectMsg:"登陆失败"
      // };

      var data = {
        Platform:"shcem.com",
        IsBackend:false,
        LoginName:loginData.mobileNo,
        Password:loginData.password,
        IsDynamicLogin:false,
        Origin:"app"
      };
      var parameter = {
        MethodName:"LoginForToken",
        requestData:data,
        resolveCode:"00000",
        resolveMsg:"登陆成功",
        rejectMsg:"登陆失败"
      };
      return req(parameter,passwordService,parameter.MethodName,true);
     // return request(parameter,true);
    };
    //通过验证码找回密码
    /*
     * data = {
     *  Mobiles:xxxx
     *  SmsCode:"S0002",
     * }
     */
    var getChangePwdCode = function (data) {
      data.Smscode = 'S0002';
      data.UserCode = '';
      var parameter = {
        requestData:data,
        resolveCode:"MSG00000",
        resolveMsg:"获取验证码成功",
        rejectMsg:"获取验证码失败"
      };
      return requestCode(parameter);
    };
    //通过验证码修改密码
    var doChangePwdWithCode = function (pwdData) {
      pwdData.SmsCode = 'S0002';
      pwdData.AppType = 1;
      var parameter = {
        methodName:"ForgetPwd",
        requestData:pwdData,
        resolveCode:"MSG00000",
        resolveMsg:"修改密码成功",
        rejectMsg:"修改密码失败"
      };
      return request(parameter);
    };

    //通过密码修改密码
    var doChangePwdwithPwd = function (pwdData) {
      var parameter = {
        methodName:"ChangePwd",
        requestData:pwdData,
        resolveCode:"MSG00000",
        resolveMsg:"修改密码成功",
        rejectMsg:"修改密码失败"
      };
      return request(parameter);
    };


    var doUploadUserAvatar = function (uri,result,err) {
      var server = config.uploaderUrl;
      var options = {
        fileKey:"file",
        fileName:uri.substr(uri.lastIndexOf('/')+1),
         mimeType:"text/plain",
        // headers:{
        //   'Content-Type':'application/json'
        // }
      };
      $cordovaFileTransfer.upload(server,uri,options,false)
        .then(result,err);
    };

    //登出
    var doLogout = function () {
    //  clearRedisInfo();
      destroyUser();
    };

    //删除本地用户的存储
    var destroyUser = function () {
      mobileNum = '';
      token = '';
      isAuthenticated = false;
      userInfoDetail = null;
      userAvatarURI = "";
      window.localStorage.removeItem(USER_CODE_KEY);
    };
    var clearRedisInfo = function() {
      var par = {
        Pattern:mobileNum
      };
      var postData = {
        json:{
          MethodName:"ClearRedisKeys",
          ServiceName:"Shcem.Member.ServiceContract.IClientLoginService",
          Params:JSON.stringify(par)
      }
    };
      shcemUtil.post(postData)
        .success(function (ret) {
          // console.log(ret.INFO);
        })
        .error(function (err) {
          // console.log(err);
        })
    }

    //设置用户信息
    var setUserInfo = function (data) {
      token = data.token;
      mobileNum = data.Mobile;//登陆成功后没有手机号数据
      isAuthenticated = true;
      storeUserInfo(data);
    };
    //存储用户信息
    var storeUserInfo = function (data) {
        var strValue = JSON.stringify(data);
        window.localStorage.setItem(USER_CODE_KEY,strValue);
    };

    //获得用户信息
    var getUserInfo = function (success,error) {
      //从本地获取用户的token 和mobile
      if (!isAuthenticated || token == '' || !token){
        var dataStr = window.localStorage.getItem(USER_CODE_KEY);
        var data = JSON.parse(dataStr);
        if(data && data.token){
          isAuthenticated = true;
          mobileNum = data.Mobile;
          token = data.token;
        }
      }
      if(token){
        if(!userInfoDetail){
          getUserInfoFromServe(success,error);
        }else{
          success(token,userInfoDetail,"用户信息在内存中");
        }
      }else{
        error("本地获取token失败,需要用户登录");
      }
    };
    var getUserInfoFromServe = function (success,failed) {
      var postData = {
        json:{
          "ServiceName":passwordService,
          "MethodName":"GetUserInfo",
          "Params":JSON.stringify({Token:token,IsRefresh:true})
        }
      };
      shcemUtil.post(postData)
        .success(function (retData) {
          if(retData.CODE == "00000"){
            userInfoDetail = retData.DATA;
            success(token,retData.DATA,"从服务获取用户详情成功");
          }else{
            failed(retData.INFO,retData.CODE);
          }
        })
        .error(function (err) {
          failed("从服务获取用户详情失败");
        })
    };
    var setPaymentPwdStatus = function (data) {
      userInfoDetail.HasPaymentPwd = data;
    };

    var setUserAvatar = function (uri) {
      var par = {
        UserImg:uri.Id,
        Token:token
      };
      var postData = {
        json:{
          "ServiceName":passwordService,
          "MethodName":"UpdateUserImage",
          "Params":JSON.stringify(par)
        }
      };
      var defer = $q.defer();
      shcemUtil.post(postData)
        .success(function (ret) {
          if(ret.CODE == "00000"){
           // userAvatarURI = uri.ThumbnailUrl;//缩略图
            userAvatarURI = uri.SourceUrl;  //缩略图服务改成SourceUrl
            userInfoDetail.UserImg = uri.Id;
            defer.resolve(ret);
          }else{
            defer.reject(ret.INFO);
          }
        })
        .error(function (err,status) {
          defer.reject(err);
        });
      return defer.promise;
    };
    var getUserAvatar = function (succ,err) {
      if(isAuthenticated) {
        if(userAvatarURI){
          succ(userAvatarURI);
        }else{
          getUserAvatarFromServer(succ,err);
        }
      }
    };
    var getUserAvatarFromServer = function (succ,err) {
      if(userInfoDetail && userInfoDetail.UserImg){
        succ(config.downloadUrl + userInfoDetail.UserImg)
      }else{
        err("");
      }
      // $http.post(config.downloadUrl,{
      //   ids:JSON.stringify([userInfoDetail.UserImg])
      // },{
      //   headers:{
      //     'Content-Type':'application/json'
      //   }
      // }).success(function (ret) {
      //   if(ret.CODE == "00000"){
      //     userAvatarURI = ret.DATA[0];
      //     succ(ret.DATA[0]);
      //   }else{
      //     err(ret.INFO);
      //   }
      // })
      //   .error(function (e) {
      //     err(e);
      //   })
    };

    //通用的通过密码操作的请求
    var request = function (data,saveMask) {
      return req(data,passwordService,data.methodName,saveMask);
    };
    //通用的通过验证码操作的请求
    var requestCode = function (data) {
      return req(data,getCodeService,"SendVerifyCode");
    };
    //通用的通过验证码验证的请求
    var verifyCode = function (data,saveMask) {
      return req(data,verifyCodeService,"CheckVerifyCode",saveMask);
    };
    var req = function (data,serviceName,methodName,saveMask) {
      var postData = {
        json:{
          "ServiceName":serviceName,
          "MethodName":methodName,
          "Params":JSON.stringify(data.requestData)
        }
      };
      var defer = $q.defer();
      shcemUtil.post(postData)
        .success(function (retData) {
          if(retData.CODE == data.resolveCode){
            if (saveMask){
              //保存数据
              retData.DATA.Mobile = data.requestData.LoginName;
              setUserInfo(retData.DATA);
              //登录成功后获取用户详细信息
              getUserInfo(function (t,ret,msg) {  //2.1.0bug
                userInfoDetail = ret.DATA;
              },function (msg) {
              });
            }
            defer.resolve(data.resolveMsg);
          }else{
            defer.reject(retData.INFO);
          }
        })
        .error(function (err,status) {
          defer.reject(data.rejectMsg);
        });
      return defer.promise;
    };

    var checkToken = function (code) {
      if(code == "10012"){
        shcemUtil.showMsg("用户过期,请重新登录");
        doLogout();//登出用户
        return true;
      }
      return false;
    };

    var checkIsTrader = function () {//检查用户类型,1:交易员,0:浏览用户
      if(!userInfoDetail){
        return false;
      }
      if(userInfoDetail.UserType == 1){
        return true;
      }
      return false;
    };
    var checkIsManger = function () {//检查是不是管理员,0:管理员,1:普通
      if(!userInfoDetail){
        return false;
      }
      if(userInfoDetail.FirmType == 0){
        return true;
      }
      return false;
    };
    var checkTradeLimits = function () {  //检查买卖权限 0:卖 1:买  2: 全部 -1:没有任何权限
      if(!userInfoDetail){
        return -1;
      }
      if(userInfoDetail.TradeAuthority != undefined){
        if(userInfoDetail.TradeAuthority == 3){
          return -1;
        }
        return userInfoDetail.TradeAuthority;
      }
      return -1;
    };
    //检查是否具有预售权限
    var checkTradeTemplate = function (templateID) {
      if(!userInfoDetail){
        return false;
      }
      if(userInfoDetail.TraderTemplate && userInfoDetail.TraderTemplate.constructor == Array){
        for (var i = userInfoDetail.TraderTemplate.length - 1; i >= 0; i--) {
         if(userInfoDetail.TraderTemplate[i].TradeTmptId == templateID){
            return true;
         } 
        }
        return false;
      }
      return false;     
    }
    //服务启动的时候查询用户信息
    getUserInfo(function (t,ret,msg) {
      userInfoDetail = ret;
    },function (msg,code) {
      checkToken(code);
    });
    return {
      mobile:function () {
        if(!mobileNum || mobileNum.length != 11 || !isAuthenticated){
          return "";
        }
        return mobileNum;
      },
      isAuthenticated:function () {
        return isAuthenticated;
      },
      userAvatar:function () {
        if(userAvatarURI && userAvatarURI.length != 0 && isAuthenticated){
          return userAvatarURI;
        }
        return "img/pic-default.png";
      },
      getRegisterCode:getRegisterCode,
      registerWithCode:doRegisterWithCode,
      registerWithPwd:doRegisterWithPwd,

      checkExistPhone:checkExistPhoneNum,

      getLoginCode:getLoginCode,
      loginWithCode:doLoginWithCode,
      loginAfterVerify:loginAfterVerify,
      loginWithPwd:doLoginWithPwd,

      getChangePwdCode:getChangePwdCode,
      changePwdWithPwd:doChangePwdwithPwd,
      changePwdWithCode:doChangePwdWithCode,

      getUserInfo:getUserInfo,
      getUserInfoFromCache:function () {
        return userInfoDetail;
      },
      logout:doLogout,
      checkToken:checkToken,
      userStorageKey:USER_CODE_KEY,

      setUserAvatar:setUserAvatar,
      getUserAvatar:getUserAvatar,
      uploadAvatar:doUploadUserAvatar,

      checkIsTrader:checkIsTrader,
      checkIsManager:checkIsManger,
      checkTradeLimits:checkTradeLimits,
      checkTradeTemplate:checkTradeTemplate,
      setPaymentPwd:setPaymentPwd,
      getPaymentCode:getPaymentCode,
      verifyPaymentCode:verifyPaymentCode,
      modifyPaymentCode:modifyPaymentCode,
      setPaymentPwdStatus:setPaymentPwdStatus
    }
  })
  .service('UserProductService',function (shcemUtil,$q,UserService) {
    var leadsCount = 0;//发盘数查一次就行了
    var orderWeight = 0;//成交单数需要查方向为0和方向为1的
    var orderWeight1 = 0;
    var USERBALANCEFromOra = 0;//资金账户余额
    var BALANCEFromS = 0;//可用授信额度
    var LASTBALANCEFromS = 0;//授信额度
    var FIRMNAME = "-";

    var getDaysInfo = function (firmID,direction,succ,err) {
      var currentDate = new Date();
      var par = {
        firmID:firmID,
        direction:direction,
        queryDate:currentDate.toLocaleDateString()
      };
      var postData = {
        json:{
          "MethodName":"GetDaysInfo",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params":JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
          if(ret.CODE == "MSG00000"){
            if(direction == 0){
              leadsCount = ret.DATA.LeadsCount;
              orderWeight = ret.DATA.OrderWeight;
              succ(leadsCount,orderWeight);
            }else {
              orderWeight1 = ret.DATA.OrderWeight;
              succ(orderWeight1);
            }
          }else{
            err("查询发盘失败",ret.CODE);
          }
        })
        .error(function (e,status) {
          err(e);
        });
    };

    var getMoneyCount = function (firmID,succ,err) {
      var par = {
        FIRMID:firmID
      };
      var postData = {
        json:{
          "MethodName":"queryOneFirmBanlance",
          "ServiceName":"shcem.finance.service.IBalanceMgrService",
          "Params":JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
          if(ret.CODE == "00000"){
            USERBALANCEFromOra = ret.DATA.USERBALANCEFromOra;
            BALANCEFromS = ret.DATA.BALANCEFromS;
            LASTBALANCEFromS = ret.DATA.LASTBALANCEFromS;
            FIRMNAME = ret.DATA.FIRMNAME;
            succ(ret);
          }else {
            err("失败",ret.CODE);
          }
        })
        .error(function (e,code) {
          err(e);
        })
    }

    var clearUserDetailInfo = function () {
      leadsCount = 0;//发盘数查一次就行了
      orderWeight = 0;//成交单数需要查方向为0和方向为1的
      USERBALANCEFromOra = 0;//资金账户余额
      BALANCEFromS = 0;//可用授信额度
      LASTBALANCEFromS = 0;//授信额度
      FIRMNAME = "-";
      orderWeight1 = 0;
    };
    return {
        leadsCount:function () {
          if(!leadsCount || !UserService.isAuthenticated()){
            return 0;
          }
          return leadsCount;
        },
        orderWeight:function () {
          if(!orderWeight || !UserService.isAuthenticated()){
            return 0;
          }
          return orderWeight;
        },
        orderWeight1:function () {
          if(!orderWeight1 || !UserService.isAuthenticated()){
            return 0;
          }
          return orderWeight1;
        },
        USERBALANCEFromOra:function () {
          if(!USERBALANCEFromOra || !UserService.isAuthenticated()){
            return 0;
          }
          return USERBALANCEFromOra;
        },
        BALANCEFromS:function () {
          if(!BALANCEFromS || !UserService.isAuthenticated()){
            return 0;
          }
          return BALANCEFromS;
        },
        LASTBALANCEFromS:function () {
          if(!LASTBALANCEFromS || !UserService.isAuthenticated()){
            return 0;
          }
          return LASTBALANCEFromS;
        },
        FIRMNAME:function () {
          if(!FIRMNAME || !UserService.isAuthenticated()){
            return "-";
          }
          return  FIRMNAME;
        },
        getDaysInfo:getDaysInfo,
        getMoneyCount:getMoneyCount,
        clearUserDetailInfo:clearUserDetailInfo
    };
  });
