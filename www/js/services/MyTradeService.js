/**
 * Created by yujianping on 2016/9/20.
 * 我的成交
 */

angular.module('starter.services')

  /**自提交收Service*/
  .service('SelfPickService', function(shcemUtil){
    var deliveryService = "Shcem.Trade.ServiceContract.IDeliveryService";
    var orderService = "Shcem.Trade.ServiceContract.IOrderService";

    //获取订单信息
    var getOrderInfo = function(OrderId, succ, err) {
      var params = {
        OrderId:OrderId
      };
      var postData = {
        json:{
          ServiceName: orderService,
          MethodName: "GetOrderInfo",
          Params: JSON.stringify(params)
        }
      };

      shcemUtil.post(postData).success(function (ret) {
          if (ret.CODE == "MSG00000") {
            succ(ret.DATA);
          } else {
            err(ret.INFO);
          }
        })
        .error(function (e) {
          err(e.getErrorMessage());
        });
    }

    //获取自提交收信息
    var getSelfPickInfo = function(DeliveryID, succ, err) {
      var params = {
        DeliveryID : DeliveryID
      };

      var postData = {
        json:{
          ServiceName: deliveryService,
          MethodName: "GetSelfPickInfo",
          Params: JSON.stringify(params)
        }
      };
      shcemUtil.post(postData).success(function (ret) {
          if (ret.CODE == "MSG00000") {
            succ(ret.DATA);
          } else {
            err(ret.INFO);
          }
        })
        .error(function (e) {
          err(e.getErrorMessage());
        });
    }

    //自提交收申请
    var addSelfPick = function(requestParam, succ, err) {
      var params = {
        requestParam : requestParam
      };

      var postData = {
        json:{
          ServiceName: deliveryService,
          MethodName: "AddSelfPick",
          Params: JSON.stringify(params.requestParam)
        }
      };

      shcemUtil.post(postData).success(function (ret) {
          if (ret.CODE == "00000") {
            succ(ret);
          } else {
            err(ret.INFO);
          }
        })
        .error(function (e) {
          err(e.getErrorMessage());
        });
    }

    return {
      getOrderInfo:getOrderInfo,
      addSelfPick:addSelfPick,
      getSelfPickInfo:getSelfPickInfo
    }
  })

  /**我要违约Service*/
  .service('BreakContractService', function($q,shcemUtil) {
    var orderService = "Shcem.Trade.ServiceContract.IOrderService";

    var breakContract = function (requestParam) {

      var params = {
        requestParam : requestParam
      };

      var postData = {
        json:{
          ServiceName: orderService,
          MethodName: "BreachContract",
          Params: JSON.stringify(params.requestParam)
        }
      };
      var deferred = $q.defer();
      shcemUtil.post(postData).success(function (ret) {
          if (ret.CODE == "MSG00000") {
            deferred.resolve(ret);
          } else {
            deferred.reject(ret.INFO);
          }
        })
        .error(function (e) {
          deferred.reject(e.getErrorMessage());
        });

      return deferred.promise;
    }

    return {
      breakContract:breakContract,
    }
  })

  /**转货权Service*/
  .service('TrasferService', function(shcemUtil) {
    var deliveryService = "Shcem.Trade.ServiceContract.IDeliveryService";

    //获取转货权信息
    var getTrasferInfo = function(DeliveryID, succ, err) {
      var params = {
        DeliveryID: DeliveryID
      };
      var postData = {
        json: {
          ServiceName: deliveryService,
          MethodName: "GetTrasferInfo",
          Params: JSON.stringify(params)
        }
      };

      shcemUtil.post(postData).success(function (ret) {
          if (ret.CODE == "MSG00000") {
            succ(ret.DATA);
          } else {
            err(ret.INFO);
          }
        })
        .error(function (e) {
          err(e.getErrorMessage());
        });
      }
      return {
        getTrasferInfo:getTrasferInfo
      }
    })
