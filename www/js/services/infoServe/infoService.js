
angular.module('starter.services')


    .service('infoService', function(shcemUtil, $q, config) {
        var infoList = [];
        var infoTopIndex = 0;
        var infoDetail = -1;

      this.setInfoDetailID = function (_infoDetail) {
        infoDetail = _infoDetail;
      };

      this.getInfoDetailID = function () {
        return infoDetail;
      };


      this.setTopIndex = function (_infoTopIndex) {
        infoTopIndex = _infoTopIndex;
      };

      this.getTopIndex = function () {
        return infoTopIndex;
      };


        // 化交价格指标KPI getMarketQuo
        this.doKPIData = function () {
            var postdata = {
                json:{
                    "MethodName":"getMarketQuo",
                    "ServiceName":"Shcem.Inform.ServiceContract.IQueryInfoService"
                }
            };
            var deferred = $q.defer();
            shcemUtil.post(postdata)
                .success(function (data) {
                    if (data.CODE == "MSG00000"){
                      for (var i = 0; i < data.DATA.length; i++){
                        if(data.DATA[i].mqWave > 0){
                          data.DATA[i].up = true;
                        } else if(data.DATA[i].mqWave < 0){
                          data.DATA[i].up = false;
                        } else if(data.DATA[i].mqWave == 0) {
                          data.DATA[i].zero = true;
                        }
                      }

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

        // 化交价格 getScemQuo
        this.doPriceData = function (productID) {
            if (productID == undefined || productID.length == 0){
                productID =1;
            }
            var postdata = {
                json:{
                    "MethodName":"getScemQuo",
                    "ServiceName":"Shcem.Inform.ServiceContract.IQueryInfoService",
                    "Params":JSON.stringify({
                        'ProductID':productID,
                        'TOP':8
                    })
                }
            };
            var deferred = $q.defer();
            shcemUtil.post(postdata)
                .success(function (data) {
                    if (data.CODE == "MSG00000"){
                      for(var i = 0; i < data.DATA.length;i++){
                        data.DATA[i].hide = true;
                        data.DATA[i].chartHtml='';
                        data.DATA[i].chartId='chartId'+i;
                        if(data.DATA[i].SQDropRange>0){
                          data.DATA[i].dropPlus = true;
                        }
                        if(data.DATA[i].SQUpRange>0){
                          data.DATA[i].upPlus = true;
                        }
                      }
                      infoList = data.DATA;
                      deferred.resolve(infoList);

                    } else {
                        deferred.resolve(data.INFO);
                    }
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };



        //图片显示
      var idList = [];
      var clickList = [];
      var topID = [];
      this.getTopInforData = function (catogoryID, top) {
        if (catogoryID == undefined){
          catogoryID = config.catogoryID;
        }
        if (top == undefined || top.length == 0){
          top = config.topNum;
        }
        var postdata = {
          json: {
            "ServiceName": "Shcem.Inform.ServiceContract.IQueryInfoService",
            "MethodName": "getTopInformList",
            "Params": JSON.stringify({
              'ProductID': 0,
              'AppTypeID':0,
              'CatogoryID':catogoryID,
              'Top':top
            })
          }
        };
        var deferred = $q.defer();
        shcemUtil.post(postdata)
          .success(function(data) {
            if (data.CODE == "MSG00000") {
              idList.push(config.downloadUrl + data.DATA[0].FileID);
              idList.push(data.DATA[0].InfoLinkId.substr(data.DATA[0].InfoLinkId.length - 5, 5));
              deferred.resolve(idList);
            } else {
              deferred.reject(data.INFO);
            }
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      };




    });



