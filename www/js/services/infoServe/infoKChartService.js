angular.module('starter.services')

.service('infoKChartService', function (shcemUtil, $q) {
  var infoList = [];
  var infoObj = {};
  var minData = "";

  this.setInfoObj = function (_infoObj) {
    infoObj = _infoObj;
  };

  this.getInfoObj = function () {
    return infoObj;
  };

  this.setMinData = function (_minData) {
    minData = _minData;
  }
  this.getMinData= function () {
    return minData;
  }


  this.getinfoKChartData = function (SQDate, SQStartDate, SQRank, SQType, ProductID, SQProduct, SQNo) {
    var postData = {
      json:{
        "MethodName":"getScemQuoDiagram",
        "ServiceName":"Shcem.Inform.ServiceContract.IQueryInfoService",
        "Params":JSON.stringify({
          'EndDate': SQDate,
          'StartDate': SQStartDate,
          'Rank': SQRank,
          'Type': SQType,
          'ProductID': ProductID,
          'ProductName': SQProduct,
          'NO': SQNo
        })
      }
    };
    var deferred = $q.defer();
    shcemUtil.post(postData)
      .success(function (data) {
        if (data.CODE == "MSG00000"){
          infoList = data.DATA;
          deferred.resolve(infoList);
        } else {
          deferred.reject(data.INFO);
        }
      })
      .error(function (err) {
        deferred.reject(err.code);
      })
    return deferred.promise;
  };

});
