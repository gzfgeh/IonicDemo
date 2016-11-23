angular.module('starter.services')

.service('infoNewTradeService', function (shcemUtil, $q) {
  var infoList = [];


  //资讯-最新成交 GetOrderHomeList
  this.doNewTrade = function (pagesize, keywords, pageIndex) {
    if (pagesize == undefined || pagesize.length == 0) {
      pagesize = 10;
    }
    if (keywords == undefined || keywords.length == 0) {
      keywords = '';
    }
    if (pageIndex == undefined || pageIndex.length == 0) {
      pageIndex = 1;
    }


    var postData = {
      json:{
        "MethodName":"GetOrderHomeList",
        "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
        "Params": JSON.stringify({
          'PageSize':pagesize,
          'KeyWords':keywords,
          'PageIndex':pageIndex
        })
      }
    };
    var deferred = $q.defer();
    shcemUtil.post(postData)
      .success(function (data) {
        if(data.CODE == "MSG00000"){
          infoList = data.DATA.list;
          deferred.resolve(infoList);
        } else {
          deferred.reject(data.INFO);
        }
      })
      .error(function (err) {
        deferred.reject(err);
      })
    return deferred.promise;

  };

});










