angular.module('starter.services')

.service('infoDetailService', function (shcemUtil, $q) {
    var infoList = [];


    this.getinfoDetailData = function (ID) {
        var postData = {
            json:{
                "MethodName":"getInfoTitleDetail",
                "ServiceName":"Shcem.Inform.ServiceContract.IQueryInfoService",
                "Params": JSON.stringify({
                    'QuotationID':ID
                })
            }
        };
        var deferred = $q.defer();
        shcemUtil.post(postData)
            .success(function (data) {
                if (data.CODE == "MSG00000") {
                    infoList = data.DATA;
                    deferred.resolve(infoList);
                } else {
                    deferred.reject(data.INFO);
                }
            })
            .error(function (err) {
                deferred.reject(err.code);
            });
        return deferred.promise;
    };

    this.html_decode = function(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, "\"");
      s = s.replace(/<br\/>/g, "\n");
      return s;
    }


});






