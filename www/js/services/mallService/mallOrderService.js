
angular.module('starter.services')

  .service('mallOrderLeadService', function (shcemUtil, $q) {
    var hmList = [];
    this.getMallOrderLeadsData = function (UserCode,Quantity,Price,TraderID,LeadsID,DepositAmount,FirmID) {
      var postData = {
        json:{
          "MethodName":"OrderByLeads",
          "ServiceName":"Shcem.Trade.ServiceContract.IOrderService",
          "Params":JSON.stringify({
            "UserCode":UserCode,
            "Quantity":Quantity,
            "Price":Price,
            "TraderID":TraderID,
            "LeadsID":LeadsID,
            "DepositAmount":DepositAmount,
            "FirmID":FirmID
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE == "MSG00000"){
            hmList = data.INFO;
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

