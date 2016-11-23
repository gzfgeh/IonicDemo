// 化交资讯,数据中心,下游调研,每日成交,化交报告,化交讲堂

angular.module('starter.services')

.service('infoTopInformService', function (shcemUtil, $q) {
    var infoList = [];


    this.getTopInformData = function (catogoryID, ProductID, pageIndex) {
      if (ProductID == undefined || ProductID.length == 0) {
        ProductID = 1;
      }
      if (pageIndex == undefined || pageIndex.length == 0) {
        pageIndex = 1;
      }
        var postData = {
            json:{
                "MethodName":"getInformList",
                "ServiceName":"Shcem.Inform.ServiceContract.IQueryInfoService",
                "Params": JSON.stringify({
                    'PageCount':10,
                    // 'CatogoryID':[catogoryID],
                    'CatogoryID':catogoryID,
                    'page':pageIndex,
                    'ProductID':ProductID,
                    'AppTypeID':5
                })
            }
        };
        var deferred = $q.defer();
        shcemUtil.post(postData)
            .success(function (data) {
                if (data.CODE == "MSG00000"){
                    infoList = data.DATA;
                    deferred.resolve(infoList);
                } else  {
                    deferred.reject(data.INFO);
                }
            })
            .error(function (err) {
                deferred.reject(err.code);
            })
        return deferred.promise;
    };

});






