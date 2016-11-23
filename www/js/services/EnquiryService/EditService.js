angular.module('starter.services')

  .service('EditPriceService', function (shcemUtil, $q) {
    var hmList = [];
    var theList = [];

    this.getcheckAuthByTraderID = function (obj) {
      var postData = {
        json:{
          "MethodName":"chkAuthByTraderID",
          "ServiceName":"shcem.common.service.ICommonMgrService",
          "Params":JSON.stringify({
            brandID:obj.BrandID,
            traderID:obj.TraderID,
            cateID:obj.CategoryLeafID,
            tradeRole:0,
            tmplID:"1"
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE == "00000"){
            hmList = data.INFO;
            deferred.resolve(hmList);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };


    this.getLeadsPriceCheck = function (obj) {
      var postData = {
        json:{
          "MethodName":"LeadsPriceCheck",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params":JSON.stringify({
            'BrandID':obj.BrandID,
            'SourcePlaceID':obj.SourcePlaceID,
            'CategoryLeafID':obj.CategoryLeafID,
            'GoodsType':obj.GoodsType,
            'Pirce':obj.Price
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE == "MSG00000"){
            deferred.resolve(data.DATA);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function (err) {
          deferred.reject(err.code);
        });
      return deferred.promise;
    }


  });

