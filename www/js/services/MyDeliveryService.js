/**
 * Created by chenguo on 2016/9/17.
 */

angular.module('starter.services')
  .service('myDeliveryService',function (shcemUtil,$q) {
    this.setObj=function (b) {
      this.itemObj = b;
    }
    this.getObj=function () {
      return this.itemObj;
    }
    this.setIstrack=function (b) {
      this.flag = b;
    }
    this.getIstrack=function () {
      return this.flag;
    }
    //时间格式化
    function DateDiff  (date) {
      var  aDate,  oDate2,  iDays;
      aDate  =  date.split(" ")[0].split("-");
      oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0] + " " + date.split(" ")[1]);
      iDays  =  parseInt(Math.abs(Date.parse(new Date())  -  oDate2));   //把相差的毫秒数转换为天数
      return  iDays;
    };

    function getNewDeliveryList(mallList){
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

        var goodtype = mall.GoodsType;
        if (goodtype==0){
          mall.formatGoodsType = "现货";
        }else {
          mall.formatGoodsType = "预售";
        }
        mall.DetailDate=shcemUtil.getPreDate(mall.TradeDateShow);
        newMallList.push(mall);

      }
      return newMallList;
    }
      // 我的交收
      var myDeliveryList ;
      this.getDeliveryList = function (pageIndex,tradeID,firmID,querytype,deliverystatus,goodstype) {
        var postdata ={
          json:{
            "MethodName":"GetList",
            "ServiceName":"Shcem.Trade.ServiceContract.IDeliveryService",
            "Params": JSON.stringify(
              {
                'TraderID':tradeID,
                'FirmID' :firmID,
                'CategoryLeafID' : -1,
                'BrandID': -1,
                'KeyWords': "",
                'QueryType':querytype,
                "DeliveryStatus":deliverystatus,
                'PageIndex':pageIndex,
                'PageSize':10,
                'GoodsType':goodstype, //现货0，预售1
                'OrderBy':'DelievryDate',
                'OrderByDirection':'Desc'
              })
          }
        };

        var deferred = $q.defer();
        shcemUtil.post(postdata)
          .success(function (data) {
            if (data.CODE=='MSG00000'){
              myDeliveryList = getNewDeliveryList(data.DATA.list);
              deferred.resolve(myDeliveryList);
            }else {
              // UserService.checkToken(data.CODE);
              deferred.reject(data.INFO);

            }
          })
          .error(function (err) {
            deferred.reject(err);
          })
        return deferred.promise;
      }
    //确认溢短
    this.affirmMoreOrFew = function (tradeID,firmID,userCode,delivaryId) {
      var postdata={
        json:{
          "MethodName":"AffirmMoreOrFew",
          "ServiceName":"Shcem.Trade.ServiceContract.IDeliveryService",
          "Params":JSON.stringify(
            {
              'TraderID':tradeID,
              'FirmID' :firmID,
              'UserCode':userCode,
              "DeliveryID":delivaryId
            }
          )
        }
      }
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //提交签收页面初始化
    this.getDeliveryList2 = function (pageIndex,tradeID,firmID,querytype,deliverystatus,orderID,goodsType) {
      var postdata ={
        json:{
          "MethodName":"GetList",
          "ServiceName":"Shcem.Trade.ServiceContract.IDeliveryService",
          "Params": JSON.stringify(
            {
              'TraderID':tradeID,
              'FirmID' :firmID,
              'CategoryLeafID' : -1,
              'BrandID': -1,
              'KeyWords': "",
              'OrderID':orderID,
              'QueryType':querytype,
              "DeliveryStatus":deliverystatus,
              'PageIndex':pageIndex,
              'PageSize':10,
              'GoodsType':goodsType,
              'OrderBy':'DelievryDate',
              'OrderByDirection':'Desc'
            })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA.list);
          }else {
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }
  })


