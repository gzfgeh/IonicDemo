/**
 * Created by yujp on 2016/10/9.
 */
angular.module('starter.services')

  .service('receiptService', function(shcemUtil, $q,config) {

    //提交签收
    var Confirm = function (requestData) {

      var params = {
        ID : 0,
        OrderID:requestData.OrderID,
        TradeState:20,
        CREATEBY:requestData.CREATEBY,
        CREATETIME:requestData.CREATETIME,
        MODIFYBY:requestData.MODIFYBY,
        MODIFYTIME:requestData.MODIFYTIME,
        ReceiptFileList:requestData.ReceiptFileList,
        ReceiptTakenQuantityList:requestData.ReceiptTakenQuantityList
      };

      var postData = {
        json:{
          ServiceName: "Shcem.Trade.ServiceContract.IReceiptService",
          MethodName: "Confirm",
          Params: JSON.stringify(params)
        }
      };
      //alert(JSON.stringify(postData));
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data.INFO);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject(err.INFO);
        })
      return deferred.promise;
    }

    var GetReceiptFileList = function (requestData) {
      var params = {
        OrderID:requestData.OrderID
      };

      var postData = {
        json:{
          ServiceName: "Shcem.Trade.ServiceContract.IReceiptService",
          MethodName: "GetReceiptFileList",
          Params: JSON.stringify(params)
        }
      };
      alert(JSON.stringify(postData));
      var deferred = $q.defer();
      shcemUtil.post(postData)
        .success(function (data) {
          if (data.CODE=='MSG00000'){
            deferred.resolve(data);
          }else {
            deferred.reject(data.INFO);
          }

        })
        .error(function (err) {
          deferred.reject("操作失败");
        })
      return deferred.promise;
    }

    var GetFileInfo = function (requestData) {
      var filePath = config.fileInfoUrl + requestData;
        var deferred = $q.defer();
        shcemUtil.readFile(filePath)
          .then(function (ret) {
            //alert(ret.data);
            deferred.resolve(ret.data);
          }, function (error) {
            shcemUtil.showMsg(error);
            deferred.reject("请求失败！");
          })

          // .success(function(data) {
          //   alert(JSON.stringify(data));
          //   if (data.status == true) {
          //     //{"data":[""],"status":true}
          //     //{"data":["1.png","2.pdf"],"status":true}
          //     deferred.resolve(data.DATA);
          //   } else {
          //     deferred.reject("请求失败！");
          //   }
          // })
          // .error(function(err) {
          //   deferred.reject(err);
          // });
        return deferred.promise;
      };

    return {
      Confirm:Confirm,
      GetReceiptFileList:GetReceiptFileList,
      GetFileInfo:GetFileInfo
    }

  });

