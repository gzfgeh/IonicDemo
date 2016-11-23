/**
 * Created by yujianping on 2016/9/19.
 */

angular.module('starter.services')
  .service('CapitalDetailService',function (shcemUtil) {
    var balanceMgrService = "shcem.finance.service.IBalanceMgrService";

    //通过交易商ID取得余额数据
    var queryOneFirmBanlance = function(firmID, succ, err) {
      var params = {
        FIRMID: firmID
      };
      var postData = {
        json: {
          ServiceName: balanceMgrService,
          MethodName: "queryOneFirmBanlance",
          Params: JSON.stringify(params)
        }
      };

      shcemUtil.post(postData)
        .success(function (ret) {
          if (ret.CODE == "00000") {
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
      queryOneFirmBanlance: queryOneFirmBanlance
    }

  })
