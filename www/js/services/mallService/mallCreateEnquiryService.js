angular.module('starter.services')

  .service('mallCreateEnquiryService', function (shcemUtil, $q) {
    var hmList = [];
    var userObj = [];

    this.setUserObj = function (_userObj) {
      userObj = _userObj;
    };

    this.getUserObj = function () {
      return userObj;
    };

    this.getMallCreateEnquiryData = function (LeadsID,Price,Quantity,TraderID,FirmID,UserCode,DepositAmount,PushStatus) {
      var postData = {
        json:{
          "MethodName":"CreateEnquiry",
          "ServiceName":"Shcem.Trade.ServiceContract.IEnquiryService",
          "Params":JSON.stringify({
            'LeadsID':LeadsID,
            'Price':Price,
            'Quantity':Quantity,
            'TraderID':TraderID,
            'FirmID':FirmID,
            'UserCode':UserCode,
            'FeeAmount':0,
            'DepositAmount':DepositAmount,
            'PushStatus':PushStatus
          })
        }
    };
    var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE = "MSG00000"){
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

