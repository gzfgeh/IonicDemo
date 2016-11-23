
var app=angular.module('starter');

app.factory('shcemUtil', function($http, $state, $ionicLoading, config, $q,$timeout,$cordovaDialogs,
                                  $cordovaFileTransfer,$cordovaFileOpener2,$cordovaAppVersion,$ionicPopup,$ionicPlatform, $rootScope) {
  var shcemUtil = this;

  function getAuthKey() {
    var authKey='usercode';

    var dataStr = window.localStorage.getItem('USER_CODE_KEY');
    if(dataStr) {
      var data = JSON.parse(dataStr);
      if(data) {
        var authData =data.token;
        authKey=authData;
        //shcemUtil.console(authKey);
      }
    }

    return authKey;
  }

  function getVersion() {
    return 'V2016111001';
  }

  var fig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    'timeout':30000
  };
  shcemUtil.post = function(data, url) {
    if (url == undefined || url.length == 0) {
      // url = 'http://192.168.213.71:5412/shcem';
      //url = 'http://192.168.213.64:8080/shcem-seed/server/shcem.finance.service.IBankMgrService_getBankList_Res.json';
      url = generateUrl(data);
    }
    if (config.mode === 'local') {
      return $http.get(url);
    }

    data.json.Userid = getAuthKey();
    data.json.Version = getVersion();
    return $http.post(url, data, fig);
  };
  shcemUtil.postDetail = function (data,succ,err) {
      data.json.Userid = getAuthKey();
      data.json.Version = getVersion();
      var url = generateUrl(data);
      $http.post(url,data,fig)
        .success(function (ret) {
          if(ret && ret.CODE){
            if(ret.CODE.indexOf("00000")>=0){
              typeof succ == "function" && succ(ret)
            }else{
              if (!ret.INFO) {
                ret.INFO = "查询失败";
              }
              typeof err == "function" && err(ret.INFO)
            }
          }else{
            typeof err == "function" && err("服务返回数据错误")
          }
        })
        .error(function (e,code) {
          if (code != undefined && code == -1) {
             typeof err == "function" && err("网络连接失败")
          }else if(code >= 500){
             typeof err == "function" && err("服务不可用")
          }else if (code ==408) {
             typeof err == "function" && err("请求超时")
          }
        })
  }

  /**
   * Promise方式执行post方法
   * */
  shcemUtil.promisePost = function(pdata, url) {
    if (url == undefined || url.length == 0) {
      // url = 'http://192.168.213.71:5412/shcem';
      //url = 'http://192.168.213.64:8080/shcem-seed/server/shcem.finance.service.IBankMgrService_getBankList_Res.json';
      url = generateUrl(pdata);
    }
    if (config.mode === 'local') {
      return shcemUtil.promiseGet(url);
    }

    data.json.Userid = getAuthKey();
    data.json.Version = getVersion();
    //$cookies.get("uaactoken")
    var deferred = $q.defer();
    var promise = deferred.promise;
    $http.post(url, pdata, fig)
      .success(function(data, status, headers, config) {
        deferred.resolve(data); //执行成功
      }).error(function(data, status, headers, config) {
      deferred.reject(); //执行失败
    });
    return promise;
  };

  shcemUtil.showLoading = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  shcemUtil.showMsg = function(msg, duration) {
    $ionicLoading.show({
      template: msg,
      noBackdrop: true,
      animation: 'fade-in',
      duration: duration ? duration : 2000
    });
  };
  shcemUtil.console=function(msg){
    console.log(msg);
  };

  shcemUtil.hideLoading = function() {
    $ionicLoading.hide();
  };

  function generateUrl(data) {
    url = config.apiUrl;
    if (config.mode === 'local') {
      // var serviceNameArr = data.json.ServiceName.split('.');
      var serviceName = data.json.ServiceName + '_' + data.json.MethodName + '_Res.json';
      url = url + serviceName;
    }
    return url;
  }


  shcemUtil.readFile = function (filePath) {
    if (filePath == undefined || filePath == null){
      return;
    }
    var deferred = $q.defer();
    var promise = deferred.promise;
    $http.get(filePath).success(function (data) {
      deferred.resolve(data); //执行成功
    }).error(function (error) {
      deferred.reject(); //执行失败
    });
    return promise;
  };

  var newVersion = "";
  shcemUtil.checkVersion = function () {
    if (ionic.Platform.isAndroid()) {
      shcemUtil.readFile("version.json")
        .then(function(ret){
          newVersion = ret.version.newVersion.split(".");
          return newVersion;
        }).then(function (ret) {
          $cordovaAppVersion.getVersionNumber().then(function (version) {
            var oldVersion = version.split(".");
            for(var i=0; i<ret.length; i++){
              if (ret[i] != oldVersion[i]){
                //showUpdateConfirm(ret);
                showCustomDialog();
                break;
              }
            }
          });

        });
    }
  };

  function showCustomDialog() {
      $rootScope.isShowUpdateDialog = true;
      $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        return false;
      }, 101);
      $ionicPlatform.onHardwareBackButton(function (e) {
        e.preventDefault();
      });
    }

    $rootScope.updateVersion = function () {
      newVersion = newVersion.join(".");
      $rootScope.isShowUpdateDialog = false;
      $ionicLoading.show({
        template: "已经下载：0%"
      });

      var url = "https://appu.shcem.com/frey/publish/update/Android/shhj_" + newVersion + ".apk";
      var targetPath = "file:///storage/sdcard0/Download/shhj_" + newVersion + ".apk";
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function () {
          $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive')
            .then(function () {

            }, function (err) {

            });
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        }, function (progress) {
          $timeout(function () {
            var downloadProgress = (progress.loaded / progress.total) * 100;
            $ionicLoading.show({
              template: "已经下载：" + Math.floor(downloadProgress) + "%"
            });
            if (downloadProgress > 99) {
              $ionicLoading.hide();
            }
          })
        });
    }

  function showUpdateConfirm(newVersion) {
    newVersion = newVersion.join(".");
    var confirmPopup = $cordovaDialogs.confirm(
      "升级到最新版本: V" +  newVersion,
      "版本升级",
      ['升级','取消']);

    confirmPopup.then(function (res) {
      if (res == 1){
        $ionicLoading.show({
          template: "已经下载：0%"
        });

        var url = "https://appu.shcem.com/frey/publish/update/Android/shhj_" + newVersion + ".apk";
        var targetPath = "file:///storage/sdcard0/Download/shhj_" + newVersion + ".apk";
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function () {
            $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive')
              .then(function () {

              }, function (err) {

              });
            $ionicLoading.hide();
          }, function () {
            $ionicLoading.hide();
          }, function (progress) {
            $timeout(function () {
              var downloadProgress = (progress.loaded / progress.total) * 100;
              $ionicLoading.show({
                template: "已经下载：" + Math.floor(downloadProgress) + "%"
              });
              if (downloadProgress > 99) {
                $ionicLoading.hide();
              }
            })
          });

      }
    })
  }
  //距离当前日期的天数 date 2016-10-11 13:08
  function DateDiff (date) {
    var  aDate,  oDate2,  iDays;
    aDate  =  date.split(" ")[0].split("-");
    oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0] + " " + date.split(" ")[1]);
    iDays  =  parseInt(Math.abs(Date.parse(new Date())  -  oDate2));   //把相差的毫秒数转换为天数
    return  parseInt(iDays/  1000  /  60  /  60  /24);
  };

  //距离当前日期的天数 date 2016-10-11 13:08
  function DateDiffs (date) {
    var  aDate,  oDate2;
    aDate  =  date.split(" ")[0];
    oDate2  =  new Date();
    oDate2 = oDate2.getFullYear() + "-" + (oDate2.getMonth()+1) + "-" + oDate2.getDate();
    if (aDate == oDate2)
      return true;
    else
      return false;
    //return  parseInt(iDays/  1000  /  60  /  60  /24);
  };


  //preDate 数据 2016-10-11 13:08
  shcemUtil.getPreDate = function (preDate) {
    var temp = "";
    if (DateDiffs(preDate)){
      temp = preDate.split(" ")[1];
    }else{
      temp = preDate.split(" ")[0].substring(5,10);
    }
    return temp;
  };

  shcemUtil.getIsCanPay = function () {
    return true;
    var hour = new Date().getHours();
    if (hour < 16){
      return true;
    }else if(hour == 16){
      var minute = new Date().getMinutes();
      if (minute >= 35){
        shcemUtil.showMsg("时间超过 16:35，暂时无法交易");
        return false;
      }else{
        return true;
      }
    }else{
      shcemUtil.showMsg("时间超过 16:35，暂时无法交易");
      return false;
    }
  }

  return shcemUtil;
});

/**
 * http 请求拦截器
 * create by sunf@shcem.com 2015-05-05
 * @return {[type]} [description]
 */

app.factory('httpRequestInterceptor', function($q, config) {
  return {
    'responseError': function(rejection) {
      // do something on error
      //console.log(rejection);

      return $q.reject(rejection);
    },
    request: function(request) {
      return request;
    },
    response: function(response) {
      if (config && config.mode !== 'local' &&
        typeof response.data === 'object' &&
        response.data.DATA &&
        response.data.DATA !== 'none' &&
        typeof response.data.DATA === 'string') {
        //console.log(response.data);
        try{
          response.data.DATA = JSON.parse(response.data.DATA);
        }catch(e){
          response.data.DATA = response.data.DATA;
        }

      }
      return response;
    }
  };
});
app.config(function($httpProvider) {
//  $httpProvider.defaults.timeout = 3000;
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
