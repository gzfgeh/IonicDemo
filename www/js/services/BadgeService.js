/*
 *created by hdy 2016-08-11
 *角标服务,针对tabBar角标的数量
 */
angular.module('starter.services')
  .service('BadgeService',function (UserService,shcemUtil,$rootScope) {
    var notificationArray = {
      mainPage:[],
      mallPage:[],
      tradePage:[],
      msgPage:[],
      minePage:[]
    };
    var msgData;
    var  getMsg = function (pageNO,pageSize,succ,err) {
      if(UserService.isAuthenticated()){
        var par = {
          orderFields:[{"orderBy":"mh.REC_MODIFYTIME","orderDesc":true}],
          pageNo:pageNO,
          pageSize:pageSize,
          queryModel:{
            ReceiveNumber:UserService.mobile(),
            IsSend:1
          }
        };
        var postData = {
          json:{
            "MethodName":"getMessageHistoryList",
            "ServiceName":"shcem.common.service.IPushMsgForAppService",
            "Params":JSON.stringify(par)
          }
        };
        shcemUtil.post(postData)
          .success(function (ret) {
            if(ret.CODE == "00000"){
              succ(ret);
            }else{
              err(ret.INFO,ret.CODE);
              UserService.checkToken(ret.CODE);
            }
          })
          .error(function (e,status) {
            err(e);
          })
      }
    };

    var getUnreadCount = function () {
      if(UserService.isAuthenticated()){
        var par = {
          ReceiveNumber:UserService.mobile()
        };
        var postData = {
          json:{
            ServiceName:"shcem.common.service.IPushMsgForAppService",
            "MethodName":"getUnReadMsgNum",
            "Params":JSON.stringify(par)
          }
        };
        shcemUtil.post(postData)
          .success(function (ret) {
            if(ret.CODE == "00000"){
              notificationArray.minePage = [];
              for(var i = 0;i<ret.DATA.result;i++){
                notificationArray.minePage.push(1);//前台收到消息后添加一个角标
              }
              $rootScope.$broadcast("updateBadge");
            }else{
              UserService.checkToken(ret.CODE);
            }
          })
          .error(function (e) {
          })
      }else{
        notificationArray = {
          mainPage:[],
          mallPage:[],
          tradePage:[],
          msgPage:[],
          minePage:[]
        };
      }

    };

    var getTraderUnreadCount = function (traderId,succ,err) {
      var par = {
        TraderId:traderId
      };
      var postData = {
        json:{
          MethodName:'GetTraderToDoNum',
          ServiceName:'Shcem.Member.ServiceContract.IClientService',
          Params:JSON.stringify(par)
        }
      };
      shcemUtil.post(postData)
        .success(function (ret) {
         // console.log(ret);
          if(ret.CODE = 'MSG00000'){
            succ(ret.DATA);
          }else{
            UserService.checkToken(ret.CODE);
          }
        })
        .error(function (e) {
          err(e);
          console.log(e);
        })
    };
    return {
      notificationInfo: notificationArray,
      getMsg:getMsg,
      getUnreadCount:getUnreadCount,
      getTraderUnreadCount:getTraderUnreadCount
    };
  });

