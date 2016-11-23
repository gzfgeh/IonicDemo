/**
 * Created by guzhenfu on 2016/7/26.
 */

angular.module('starter.services')

  .service('mallService', function(shcemUtil, $q) {
    var searchKey = '';
    var mallObj = {};

    this.setObj = function (_mallObj) {
      mallObj = _mallObj;
    };

    this.getObj = function () {
      return mallObj;
    };

    this.setKey = function (_searchKey) {
      searchKey = _searchKey;
    };

    this.getKey = function () {
      return searchKey;
    };


    this.getListData = function (pageIndex, searchData, pageSize,
                                 CategorySpecialIds, SourcePlaceIds, DeliveryPlaceIds, OrderBy, SortDirect, LeadsStatus) {
      if (searchData == undefined || searchData.length == 0){
        searchData = '';
      }

      if (pageSize == undefined){
        pageSize = 10;
      }

      if (pageIndex == undefined){
        pageIndex = 1;
      }

      if (CategorySpecialIds == undefined){
        CategorySpecialIds = [];
      }

      if (SourcePlaceIds == undefined){
        SourcePlaceIds = [];
      }

      if (DeliveryPlaceIds == undefined){
        DeliveryPlaceIds = [];
      }

      if (OrderBy == undefined){
        OrderBy = "1";
      }

      if (SortDirect == undefined){
        SortDirect = 1;
      }

      if (LeadsStatus == undefined){
        LeadsStatus = [];
      }

      /**
       * orderBy: 价格 "2"：贵到便宜  "1"：便宜到贵
       * SortDirect: 时间 1：近到远   0：远到近
       * LeadsStatus：状态 -1：全部 0：有效
       */
      var postdata = {
        json: {
          "ServiceName": "Shcem.Trade.ServiceContract.ILeadsService",
          "MethodName": "GetLeadsList",
          "Params": JSON.stringify({
            'KeyWords': searchData,
            'LeadsStatusList':LeadsStatus,
            'PageIndex':pageIndex,
            'PageSize':pageSize,
            'OrderBy':OrderBy,
            'SortDirect':SortDirect,
            "CategorySpecialIds":CategorySpecialIds,
            "SourcePlaceIds":SourcePlaceIds,
            "DeliveryPlaceIds":DeliveryPlaceIds,
            "GoodsType":-1,
            "SettlementMethod":-1
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


    this.DateDiff = function (date) {
      var  aDate,  oDate2,  iDays;
      aDate  =  date.split(" ")[0].split("-");
      oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0] + " " + date.split(" ")[1]);
      iDays  =  parseInt(Math.abs(Date.parse(new Date())  -  oDate2));   //把相差的毫秒数转换为天数
      return  iDays;
    };

    this.getNewMallList=function(mallList){
      var newMallList=[];
      for(var item in mallList){
        var mall=mallList[item];
        // mall.theTotalWeight = Math.round(mall.DealtQuantity * mall.TradeUnitNumber + mall.ResidualQuantity * mall.TradeUnitNumber);
        var theTotalWeight = mall.DealtQuantity * mall.TradeUnitNumber + mall.ResidualQuantity * mall.TradeUnitNumber;
        mall.theTotalWeight = parseFloat(theTotalWeight.toFixed(6));

        var theMinWeight = mall.MinQuantity * mall.TradeUnitNumber;
        mall.theMinWeight = parseFloat(theMinWeight.toFixed(6));
        var date = this.DateDiff(mall.REC_CREATETIMEShow);

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
    };

    this.removeByValue = function(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          return;
        }
      }
      arr.push(val);
    }


    this.IdToKeyArray = function(arr, ids) {
      for(var i=0;i<arr.length;i++) {
        for(var j=0;j<arr[i].data.length;j++) {
          for(var k=0; k<ids.length; k++){
            if (ids[k] == arr[i].data[j].valueId){
              arr[i].data[j].checked = true;
              break;
            }
          }
        }
      }
    };

  });
