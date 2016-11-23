/**
 * Created by guzhenfu on 2016/7/28.
 */
angular.module('starter.services')

  .service('enquiryService', function($http,shcemUtil, $q, mallService, config) {
    var mallObj ;
    var userInfo = {
      TraderID:"",
      FirmID: "",
      tradeType:2
    };
    var TradeStatusSel = [];

    var tradeType = {
      textSelect:"买家",
      GoodsType:0,
      Tabclass1:"active",
      Tabclass2:""
    };


    this.setTradeType = function (_tradeType) {
      tradeType = _tradeType;
    };

    this.getTradeType = function () {
      return tradeType;
    }

    //传递参数
    this.setObj = function (_mallObj) {
      mallObj = _mallObj;
    };

    this.getObj = function () {
      return mallObj;
    };

    //传递用户信息
    this.setUserInfo = function (_userInfo) {
      userInfo = _userInfo;
    };

    this.getUserInfo = function () {
      return userInfo;
    };

    //传递TradeStatusSel
    this.setTradeStatusSel = function (_TradeStatusSel) {
      TradeStatusSel = [];
      if (_TradeStatusSel != ""){
        if (_TradeStatusSel.length > 1){
          TradeStatusSel = _TradeStatusSel;
        }else{
          TradeStatusSel.push(_TradeStatusSel);
        }

      }

    }

    this.getTradeStatusSel = function () {
      return TradeStatusSel;
    }

    //合并对象
    this.mergeObj = function (o1,o2) {
      for(var key in o2){
        o1[key]=o2[key]
      }
      return o1;
    }

    function mergeObject(o1,o2) {
      for(var key in o2){
        if (o1[key] == null)
            o1[key]=o2[key]
      }
      return o1;
    }

    function getNewReceiveList(mallList){
      var newMallList=[];
      for(var item in mallList){
        var mall=mallList[item];

        for (var index in mall.Itms){
          var enquiryItems = mall.Itms[index];
          var temp = {};
          temp.EnquiryId = enquiryItems.EnquiryId;
          temp.UserCode = enquiryItems.UserCode;
          temp.Enquiry_Price = enquiryItems.Price;
          // temp.preDate = enquiryItems.REC_CREATETIME.split(" ")[0].substring(5,10);
          temp.preDate = shcemUtil.getPreDate(mall.REC_CREATETIMEShow);

          temp.REC_CREATETIME = enquiryItems.REC_CREATETIME;
          temp.Quantity = enquiryItems.Quantity;
          temp.TradeUnit = enquiryItems.TradeUnit;
          temp.LeadsID = enquiryItems.LeadsID;
          temp.ResidualWeight = enquiryItems.ResidualWeight;
          //temp.REC_CREATETIMEShow = enquiryItems.REC_CREATETIMEShow;
          temp.Enquiry_Total = enquiryItems.Total;
          if (temp.Enquiry_Total > mall.NoDealtWeight){
            temp.isShowTotal = true;
          }
          switch (enquiryItems.EnquiryStatus){
            case -1:
              temp.EnquiryStatus = "余额不足失败";
                  break;

            case 1:
              temp.EnquiryStatus = "有效";
                  break;

            case 0:
              temp.EnquiryStatus = "失效";
                  break;

            case 10:
              temp.EnquiryStatus = "成交";
                  break;

            case 99:
              temp.EnquiryStatus = "撤盘";
                  break;
          }
          temp = mergeObject(temp, mall);
          newMallList.push(temp);
        }
      }
      return newMallList;
    }

    //我的询盘
    function getNewList(mallList){
      var newMallList=[];
      for(var item in mallList){
        var mall=mallList[item];
        if (mall.Itms == undefined || mall.Itms.length == 0){
          mall.Price = "-";
          mall.ResidualWeight = " - ";
          // mall.preDate = mall.DeliveryEndDate.split(" ")[0].substring(5,10);
          mall.preDate = shcemUtil.getPreDate(mall.REC_CREATETIMEShow);
          mall.Enquiry_REC_CREATETIMEShow = mall.REC_CREATETIMEShow;
          newMallList.push(mall);
        }else{

          for (var index in mall.Itms){
            var enquiryItems = mall.Itms[index];
            var temp = {};
            temp.EnquiryId = enquiryItems.EnquiryId;
            temp.UserCode = enquiryItems.UserCode;
            temp.Price = enquiryItems.Price;
            // temp.preDate = enquiryItems.DeliveryEndDate.split(" ")[0].substring(5,10);
            temp.preDate = shcemUtil.getPreDate(mall.Enquiry_REC_CREATETIMEShow);
            temp.REC_CREATETIME = enquiryItems.REC_CREATETIME;
            temp.Quantity = enquiryItems.Quantity;
            temp.TradeUnit = enquiryItems.TradeUnit;
            temp.LeadsID = enquiryItems.LeadsID;
            temp.ResidualWeight = enquiryItems.ResidualWeight;
            //temp.REC_CREATETIMEShow = enquiryItems.REC_CREATETIMEShow;
            switch (enquiryItems.EnquiryStatus){
              case -1:
                temp.EnquiryStatus = "余额不足失败";
                break;

              case 1:
                temp.EnquiryStatus = "有效";
                break;

              case 0:
                temp.EnquiryStatus = "失效";
                break;

              case 10:
                temp.EnquiryStatus = "成交";
                break;

              case 99:
                temp.EnquiryStatus = "撤盘";
                break;
            }
            temp = mergeObject(temp, mall);
            newMallList.push(temp);
          }


        }

      }
      return newMallList;
    }
    //获取违约的列表
    this.GetBreachDeliveryList = function (orderID,DeliveryStatusList) {
        var postdata={
          json:{
            "ServiceName":"Shcem.Trade.ServiceContract.IDeliverySinopecService",
            "MethodName": "Query",
            "Params": JSON.stringify({
              "OrderID":orderID,
              DeliveryStatusList:DeliveryStatusList
            })
          }
        };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function(data) {
          if (data.CODE == "MSG00000") {

            deferred.resolve(data.DATA);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };
    //我收到的询盘
    this.GetReceiveList = function (obj) {
      var postdata = {
        json: {
          "ServiceName": "Shcem.Trade.ServiceContract.IEnquiryService",
          "MethodName": "GetReceiveList",
          "Params": JSON.stringify({
            "TraderID":obj.TraderID,
            "FirmID":obj.FirmID,
            "GoodsType":obj.GoodsType,
            "QueryType":obj.QueryType,
            "PageIndex":obj.PageIndex,
            "PageSize":obj.PageSize,
            "OrderBy":obj.OrderBy,
            "SortDirect":obj.SortDirect
          })
        }
      };

      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function(data) {
          if (data.CODE == "MSG00000") {
            var d = data.DATA.rows;
            var datas = getNewReceiveList(d);
            deferred.resolve(datas);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };


    //询盘成交
    this.ReceiveOrderDeal = function (obj) {
      var postdata = {
        json: {
          "ServiceName": "Shcem.Trade.ServiceContract.IOrderService",
          "MethodName": "Order",
          "Params": JSON.stringify({
            Enquiry_ID:obj.EnquiryId,
            UserCode:userInfo.UserCode,
            LeadsID:obj.LeadsID
          })
        }
      };

      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function(data) {
          if (data.CODE == "MSG00000") {
            deferred.resolve(data.DATA);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };


    function getNewSellList(mallList){
      var newMallList=[];
      for(var item in mallList){
        var mall=mallList[item];
        var date = mallService.DateDiff(mall.TradeDateShow);

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
        mall.DetailDate=shcemUtil.getPreDate(mall.TradeDateShow);
        newMallList.push(mall);
      }
      return newMallList;
    }

    //我的成交(买家)
    getMyBuyList = function getMyBuyList(buyObj) {
      var postdata = {
        json:{
          "MethodName":"GetBuyList",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params": JSON.stringify({
              'TraderID':buyObj.TraderID,
              'FirmID' : buyObj.FirmID,
              'CategoryLeafID' : buyObj.CategoryLeafID,
              'BrandID': buyObj.BrandID,
              'KeyWords': buyObj.KeyWords,
              'QueryType':buyObj.QueryType,
              'PageIndex':buyObj.PageIndex,
              'PageSize':10,
              'OrderBy':buyObj.OrderBy,
              'OrderByDirection':buyObj.OrderByDirection,
              'tradeStatus':buyObj.TradeStatus,
              'GoodsType':buyObj.GoodsType
            })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            var myBuyList = getNewSellList(data.DATA.list);
            deferred.resolve(myBuyList);
          }else {
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    };

    //我的成交Sell(卖家)
    getMySellList = function getMySellList(sellObj) {
      if (sellObj == undefined){
        return;
      }
      var postdata = {
        json:{
          "MethodName":"GetSellList",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params": JSON.stringify({
            'TraderID':sellObj.TraderID,
            'FirmID' : sellObj.FirmID,
            'GoodsType':sellObj.GoodsType,
            'CategoryLeafID' : sellObj.CategoryLeafID,
            'BrandID': sellObj.BrandID,
            'KeyWords': sellObj.KeyWords,
            'QueryType':sellObj.QueryType,
            'PageIndex':sellObj.PageIndex,
            'PageSize':10,
            'OrderBy':sellObj.OrderBy,
            'OrderByDirection':sellObj.OrderByDirection,
            'TradeStatus':sellObj.TradeStatus
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            var mySellList = getNewSellList(data.DATA.list);
            deferred.resolve(mySellList);
          }else {
            deferred.reject(data.INFO);

          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    };

    //我的成交列表
    this.getOfferList = [getMySellList, getMyBuyList, getMyBuyList];

    //我的成交确认单
    this.GetOrderInfo = function (OrderID) {
      var postdata = {
        json:{
          "MethodName":"GetOrderInfo",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params": JSON.stringify({
            'OrderID':OrderID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //我的成交确认单
    this.GetAndCheckExpenses = function (OrderObj) {
      var postdata = {
        json:{
          "MethodName":"GetAndCheckExpenses",
          "ServiceName":"Shcem.Trade.ServiceContract.IExpensesService",
          "Params": JSON.stringify({
            "FirmID":OrderObj.FirmID,
            "TmplID":OrderObj.TmplID,
            "CategoryID":OrderObj.CategoryID,
            "BrandID":OrderObj.BrandID,
            "Price":OrderObj.Price,
            "Quantity":OrderObj.Quantity,
            "TradeRole":OrderObj.TradeRole,
            "TradeUnitNumber":OrderObj.TradeUnitNumber,
            "goodsType":OrderObj.goodsType
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //支付接口
    this.PayPrice = function (PayPriceObj) {
      var postdata = {
        json:{
          "MethodName":"PayPrice",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params": JSON.stringify({
            "OrderID":PayPriceObj.OrderID,
            "QueryType":PayPriceObj.QueryType,
            "PaymentPwd":PayPriceObj.PaymentPwd,
            "HasCoupon":PayPriceObj.HasCoupon,
            "UserCode":PayPriceObj.UserCode,
            "ButtonID":PayPriceObj.ButtonID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //询盘列表
    this.GetList = function (inquiryObj) {
      var postdata = {
        json:{
          "MethodName":"GetList",
          "ServiceName":"Shcem.Trade.ServiceContract.IEnquiryService",
          "Params": JSON.stringify({
            "TraderID":inquiryObj.TraderID,
            "FirmID":inquiryObj.FirmID,
            "GoodsType":inquiryObj.GoodsType,
            "CategoryLeafID":inquiryObj.CategoryLeafID,
            "BrandID":inquiryObj.BrandID,
            "IsAnonymity":inquiryObj.IsAnonymity,
            "LeadsStatus":inquiryObj.LeadsStatus,
            "KeyWords":inquiryObj.KeyWords,
            "QueryType":inquiryObj.QueryType,
            "PageIndex":inquiryObj.PageIndex,
            "PageSize":10,
            "RowCount":inquiryObj.RowCount,
            "OrderBy":inquiryObj.OrderBy,
            SortDirect:1
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            var datas = data.DATA.rows;
            var temp = getNewList(datas);
            deferred.resolve(temp);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    //撤销询盘
    this.CancelEnquiry = function (inquiryObj) {
      var postdata = {
        json:{
          "MethodName":"CancelEnquiry",
          "ServiceName":"Shcem.Trade.ServiceContract.IEnquiryService",
          "Params": JSON.stringify({
            "enquiryID":inquiryObj.enquiryID,
            "userCode":inquiryObj.userCode
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //修改卖盘金额改变
    this.GetAndCheckEditLeadsExpenses = function (OrderObj) {
      var postdata = {
        json:{
          "MethodName":"GetAndCheckEditLeadsExpenses",
          "ServiceName":"Shcem.Trade.ServiceContract.IExpensesService",
          "Params": JSON.stringify({
            "ID":OrderObj.ID,
            "FirmID":OrderObj.FirmID,
            "TmplID":OrderObj.TmplID,
            "CategoryID":OrderObj.CategoryID,
            "BrandID":OrderObj.BrandID,
            "Price":OrderObj.Price,
            "Quantity":OrderObj.Quantity,
            "TradeRole":OrderObj.TradeRole,
            "TradeUnitNumber":OrderObj.TradeUnitNumber,
            "goodsType":OrderObj.goodsType
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //修改我的卖盘
    this.ModifyLeads = function (obj) {
      var postdata = {
        json:{
          "MethodName":"ModifyLeads",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params": JSON.stringify({
            'ID':obj.ID,
            'UserCode':obj.UserCode,
            'TraderID':obj.TraderID,
            'FirmID':obj.FirmID,
            'TradeTmptId':obj.TradeTmptId,
            'IsRealName':obj.IsRealName,
            'CategoryLeafID':obj.CategoryLeafID,
            'BrandID':obj.BrandID,
            'SourcePlaceID':obj.SourcePlaceID,
            'Direction':obj.Direction,
            'TradeUnit':obj.TradeUnit,
            'TradeUnitNumber':obj.TradeUnitNumber,
            'Quantity':obj.Quantity,
            'MinQuantity':obj.minPi,
            'Price':obj.Price,
            'PackageStandard':obj.PackageStandard,
            'SettlementMethod':obj.SettlementMethod,
            'DeliveryDate':obj.DeliveryEndDate,
            'GoodsType':obj.GoodsType,
            'PaymentStatus':obj.PaymentStatus,
            'LeadsStatus':obj.LeadsStatus,
            'AddressID':obj.AddressID,
            'WHAddress':obj.WHAddress,
            'DeliveryPlaceId':obj.DeliveryPlaceId,
            'WareHouseID':obj.WareHouseID,
            'StoreHouseFN':obj.StoreHouseFN,
            'WHContactID':obj.WHContactID,
            'StoreContactName':obj.StoreContactName,
            'TradeFee':obj.TradeFee,
            'TradeDeposit':obj.Deposit,
            'LeadsCode':obj.LeadsCode,
            'ConformProduct':obj.ConformProduct,
            'TradeDepositCalculate':obj.Deposit
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve();
          }else {
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    };

    //撤销卖盘
    this.CancelLeads = function (obj) {
      var postdata = {
        json:{
          "MethodName":"CancelLeads",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params": JSON.stringify({
            "leadsID":obj.leadsID,
            "userCode":obj.UserCode
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }

    //发布卖盘
    this.ReleaseOffer = function (obj) {
      var postdata = {
        json:{
          "MethodName":"ReleaseOffer",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params": JSON.stringify(obj)
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }

    //保留小数点两位
    this.twoDecimal = function (data) {
      data += "";
      if (data.indexOf(".") > 0){
        data.toFixed(2);
      }else{
        data += ".00";
      }
      return data;
    }

    //确认签收
    this.Confirm = function (confirmObj) {
      var postdata = {
        json:{
          "MethodName":"Confirm",
          "ServiceName":"Shcem.Trade.ServiceContract.IReceiptService",
          "Params": JSON.stringify(confirmObj)
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }

    //获取成交信息（根据成交号展示详情）
    this.GetOrderDetailInfo = function (OrderID) {
      var postdata = {
        json:{
          "MethodName":"GetOrderDetailInfo",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params": JSON.stringify({
            OrderID:OrderID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    //收到的询盘  详细信息
    this.GetInfo = function (obj) {
      var postdata = {
        json:{
          "MethodName":"GetInfo",
          "ServiceName":"Shcem.Trade.ServiceContract.IEnquiryService",
          "Params": JSON.stringify({
            "TraderID":obj.FirmId + "00",
            "FirmID" : obj.FirmId,
            "EnquiryID" : obj.EnquiryId,
            "LeadsID" : obj.LeadsID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }


    this.getPicAddr = function(idLists) {
      var deferred = $q.defer();
      $http.post(config.downloadUrl, {
        ids:idLists
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).success(function(data) {
        alert(JSON.stringify(data));
        if (data.status == true) {
          deferred.resolve(data.DATA);
        } else {
          deferred.reject("请求失败！");
        }
      })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    //图片信息
    this.GetReceiptFileList = function (obj) {
      var postdata = {
        json:{
          "MethodName":"GetReceiptFileList",
          "ServiceName":"Shcem.Trade.ServiceContract.IReceiptService",
          "Params": JSON.stringify({
            "OrderID":obj.OrderId
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }


    //获取账户余额
    this.queryOneFirmBanlance = function (obj) {
      var postdata = {
        json:{
          "MethodName":"queryOneFirmBanlance",
          "ServiceName":"shcem.finance.service.IBalanceMgrService",
          "Params": JSON.stringify({
            "FIRMID":obj.FirmID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE=='00000'){
            deferred.resolve(data.DATA);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err);
        })
      return deferred.promise;
    };


  //提交到货通知
  this.UpdateSellArrivalTime = function (obj) {
    var postdata = {
      json:{
        "MethodName":"UpdateSellArrivalTime",
        "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
        "Params": JSON.stringify({
          "OrderID":obj.OrderId,
          "UserCode":obj.UserCode,
          "QueryType":obj.QueryType,
          "ButtonID":obj.ButtonID
        })
      }
    };
    var deferred = $q.defer();
    shcemUtil.post(postdata)
      .success(function (data) {
        if (data.CODE=='MSG00000'){
          deferred.resolve(data.DATA);
        }else {
          deferred.reject(data.INFO);
        }

      })
      .error(function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }
});

