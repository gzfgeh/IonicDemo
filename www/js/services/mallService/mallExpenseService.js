
angular.module('starter.services')

  .service('mallCheckExpenseService', function (shcemUtil, $q) {
    var HMmallList = [];

    this.getMallCheckExpenseData = function (BrandID, Quantity, Price, CategoryID, TradeUnitNumber, goodsType, FirmID,leadID ) {
      var postData = {
        json:{
          "MethodName":"GetAndCheckExpenses",
          "ServiceName":"Shcem.Trade.ServiceContract.IExpensesService",
          "Params":JSON.stringify({
            'BrandID':BrandID,
            'Quantity':Quantity,
            'TmplID':1,
            'TradeRole':1,
            'CategoryID':CategoryID,
            'Price':Price,
            'TradeUnitNumber':TradeUnitNumber,
            'goodsType':goodsType,
            'FirmID':FirmID,
            'leadID':leadID,
          })
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if(data.CODE == "MSG00000"){
            HMmallList = data.DATA;
            HMmallList.Deposit = parseFloat(HMmallList.Deposit.toFixed(2));
            deferred.resolve(HMmallList);
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
