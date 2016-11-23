/**
 * Created by chenguo on 2016/7/26.
 */
angular.module('starter.services')
.service('messageService',function (shcemUtil,$q,UserService) {
  var keyword='';
  this.setKeyword=function (keyword) {
    this.keyword=keyword;
  }
  this.getKeyword =function () {
    return this.keyword;
  }

  this.setObj=function (b) {
    this.itemObj = b;
  }
  this.getObj=function () {
    return this.itemObj;
  }

  //时间格式化
  function DateDiff  (date) {
    var  aDate,  oDate2,  iDays;
    aDate  =  date.split(" ")[0].split("-");
    oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0] + " " + date.split(" ")[1]);
    iDays  =  parseInt(Math.abs(Date.parse(new Date())  -  oDate2));   //把相差的毫秒数转换为天数
    return  iDays;
  };

  function getNewOfferList(mallList){
    var newMallList=[];
    for(var item in mallList){
      var mall=mallList[item];
      var date = DateDiff(mall.REC_CREATETIMEShow);

      var tempDate = parseInt(date/  1000  /  60  /  60  /24);
      if (tempDate > 0){
        mall.preDate = tempDate + "天前";
      } else{
        tempDate = parseInt(date/  1000  /  60  /  60);
        if (tempDate > 0){
          mall.preDate = tempDate + "小时前";
        }else{
          tempDate = parseInt(date/  1000  /  60);
          mall.preDate = tempDate + "分钟前";
        }
      }
      newMallList.push(mall);
    }
    return newMallList;
  }
  function getNewEnquiryList(mallList){
    var newMallList=[];
    for(var item in mallList){
      var mall=mallList[item];
      var date = DateDiff(mall.Enquiry_REC_CREATETIMEShow);

      var tempDate = parseInt(date/  1000  /  60  /  60  /24);
      if (tempDate > 0){
        mall.preDate = tempDate + "天前";
      } else{
        tempDate = parseInt(date/  1000  /  60  /  60);
        if (tempDate > 0){
          mall.preDate = tempDate + "小时前";
        }else{
          tempDate = parseInt(date/  1000  /  60);
          mall.preDate = tempDate + "分钟前";
        }
      }
      newMallList.push(mall);
    }
    return newMallList;
  }
  function getNewtradeList(mallList){
    var newMallList=[];
    for(var item in mallList){
      var mall=mallList[item];
      var date = DateDiff(mall.TradeDateShow);

      var tempDate = parseInt(date/  1000  /  60  /  60  /24);
      if (tempDate > 0){
        mall.preDate = tempDate + "天前";
      } else{
        tempDate = parseInt(date/  1000  /  60  /  60);
        if (tempDate > 0){
          mall.preDate = tempDate + "小时前";
        }else{
          tempDate = parseInt(date/  1000  /  60);
          mall.preDate = tempDate + "分钟前";
        }
      }
      newMallList.push(mall);
    }
    return newMallList;
  }


  //我的报盘
    var myOfferList ;
    this.getMyOfferList = function (pageIndex,kword,tradeid,firmid) {
      var postdata = {
        json:{
          "MethodName":"GetSellList",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params": JSON.stringify(
            {
              'TraderID':tradeid,
              'FirmID' : firmid,
              'GoodsType': -1,
              'CategoryLeafID' : -1,
              'BrandID': -1,
              'IsAnonymity' :-1,
              'LeadsStatus':-1,
              'KeyWords': kword,
              'QueryType':0,
              'PageIndex':pageIndex,
              'PageSize':10,
              'OrderBy':'REC_CREATETIME',
              'OrderByDirection':'Desc'
            }
          )
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            myOfferList=getNewOfferList(data.DATA);
            deferred.resolve(myOfferList);
                      }else {
            UserService.checkToken(data.CODE);
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    };
  //我的询盘
  var myEnquiryList ;
  this.getMyEnquiryList = function (pageIndex,kword,tradeid,firmid) {
    var postdata = {
      json:{
        "MethodName":"GetList",
        "ServiceName":"Shcem.Trade.ServiceContract.IEnquiryService",
        "Params": JSON.stringify(
          {
            'TraderID':tradeid,
            'FirmID' : firmid,
            "GoodsType": -1,
            'CategoryLeafID' : -1,
            'BrandID': -1,
            "IsAnonymity":-1,
            "LeadsStatus":-1,
            "KeyWords":kword,
            "QueryType":0,
            "PageIndex":pageIndex,
            "PageSize":10,
            "RowCount":0,
            "OrderBy":"Enquiry_REC_CREATETIME",
            "OrderByDirection":"Desc"
          }
        )
      },

    };
    var deferred = $q.defer();
    shcemUtil.post(postdata)
      .success(function (data) {
        if (data.CODE=='MSG00000'){
          myEnquiryList = getNewEnquiryList(data.DATA);
          deferred.resolve(myEnquiryList);
        }else {
          UserService.checkToken(data.CODE);
          deferred.reject(data.INFO);
        }
      })
      .error(function (err) {
        deferred.reject(err.INFO);
      })
    return deferred.promise;
  };

  //我的成交(sell) mySellList
  var mySellList ;
  this.getMySellList = function (pageIndex,kword,tradeid,firmid) {
    var postdata = {
      json:{
        "MethodName":"GetSellList",
        "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
        "Params": JSON.stringify({
            'TraderID':tradeid,
            'FirmID' : firmid,
            'CategoryLeafID' : -1,
            'BrandID': -1,
            'KeyWords': kword,
            'QueryType':1,
            'PageIndex':pageIndex,
            'PageSize':10,
            'OrderBy':'REC_CREATETIME',
            'OrderByDirection':'Desc',
            'TradeStatus':-1
          })
      }
    };
    var deferred = $q.defer();
    shcemUtil.post(postdata)
      .success(function (data) {
        if (data.CODE=='MSG00000'){
          mySellList = getNewtradeList(data.DATA);
          deferred.resolve(mySellList);
        }else {
          UserService.checkToken(data.CODE);
          deferred.reject(data.INFO);

        }

      })
      .error(function (err) {
        deferred.reject(err.INFO);
      })
    return deferred.promise;
  };
  //我的成交(buy) myBuyList
  var myBuyList ;
  this.getMyBuyList = function (pageIndex,kword,tradeid,firmid) {
    var postdata = {
      json:{
        "MethodName":"GetBuyList",
        "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
        "Params": JSON.stringify(
          {
            'TraderID':tradeid,
            'FirmID' : firmid,
            'CategoryLeafID' : -1,
            'BrandID': -1,
            'KeyWords': kword,
            'QueryType':11,
            'PageIndex':pageIndex,
            'PageSize':10,
            'OrderBy':'DelievryDate',
            'OrderByDirection':'Desc',
            'TradeStatus':-1
          }
        )
      }
    };
    var deferred = $q.defer();
    shcemUtil.post(postdata)
      .success(function (data) {
        if (data.CODE=='MSG00000'){
          myBuyList = getNewtradeList(data.DATA);

          deferred.resolve(myBuyList);
        }else {
          UserService.checkToken(data.CODE);
          deferred.reject(data.INFO);
        }
      })
      .error(function (err) {
        deferred.reject(err.INFO);
      })
    return deferred.promise;
  };
  this.getData=function (type,pageIndex,kword,tradeid,firmid) {
    if (type==0){
      return this.getMyOfferList(pageIndex,kword,tradeid,firmid);
    }else if (type==1){
      return this.getMyBuyList(pageIndex,kword,tradeid,firmid);
    }else if (type==2){
      return this.getMySellList(pageIndex,kword,tradeid,firmid);
    }
    else if(type==3){
      return this.getMyEnquiryList(pageIndex,kword,tradeid,firmid);
    }
  }

})
