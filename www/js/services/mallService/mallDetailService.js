
angular.module('starter.services')
  .service('mallDetailInfoService', function(shcemUtil, $q) {
    var hmList = [];
    this.getMallDetailInfoData = function (LeadsID) {
      var postData = {
        json:{
          "MethodName":"GetLeadsDetailInfo",
          "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
          "Params":JSON.stringify({
            'LeadsID':LeadsID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE == "MSG00000"){
            hmList = data.DATA;
            deferred.resolve(hmList);
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
