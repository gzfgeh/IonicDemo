/**
 * Created by guzhenfu on 2016/7/28.
 */
angular.module('starter.services')

  .service('mainService', function(shcemUtil, $http, $q, config) {
    var idList = [];
    var clickList = [];
    var topID = [];

     this.getTopID =  function () {
      return topID;
    };

    this.getClickList =  function () {
      return clickList;
    };

    this.getNoticeInfo = function (catogoryID) {
      if (catogoryID == undefined){
        // catogoryID = 1882;
        catogoryID = config.NoticeCatogoryID;
      };
      var postdata = {
        json: {
          "ServiceName": "Shcem.Inform.ServiceContract.IQueryInfoService",
          "MethodName": "getTopInformList",
          "Params": JSON.stringify({
            'ProductID': 0,
            'AppTypeID':0,
            'CatogoryID':catogoryID,
            'Top':3
          })
        }
      };

      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function (data) {
          if (data.CODE == "MSG00000") {
            deferred.resolve(data.DATA[0]);
          }else{
            shcemUtil.showMsg("网络错误");
          }
        }).error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

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
            for(var i=0; i< data.DATA.length; i++){
              idList.push(config.downloadUrl + data.DATA[i].FileID);
              clickList.push(data.DATA[i].InfoLinkId);
              topID.push(data.DATA[i].ID);
            }

            deferred.resolve(idList);

            // getPicAddr(JSON.stringify(idList))
            //   .then(function (ret) {
            //     deferred.resolve(ret);
            //   }, function (error) {
            //     shcemUtil.showMsg("网络错误");
            //   })

          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };


    function getPicAddr(idLists) {




      var deferred = $q.defer();
      $http.post(config.downloadUrl, {
        ids:idLists
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).success(function(data) {
          if (data.CODE == "00000") {
            deferred.resolve(data.DATA);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;


    };




    this.getListData = function (searchData, ProductID) {
      if (searchData == undefined || searchData.length == 0){
        searchData = '';
      }

      if (ProductID == undefined){
        ProductID = "1";
      }


      /**
       * orderBy: 价格 "2"：贵到便宜  "1"：便宜到贵
       * SortDirect: 时间 1：近到远   0：远到近
       * LeadsStatus：状态 -1：全部 0：有效
       */
      var postdata = {
        json: {
          "ServiceName": "Shcem.Trade.ServiceContract.ILeadsService",
          "MethodName": "GetLeadsList",
          "Params": JSON.stringify({
            'KeyWords': searchData,
            // 'LeadsStatus':-1,
            "CategoryParentID":0,
            'PageIndex':1,
            'PageSize':5,
            'OrderBy':1,
            'SortDirect':1,
            "CategorySpecialIds":[],
            "ProductID":ProductID,
            "TOP":"8"
          })
        }
      };

      var deferred = $q.defer();
      shcemUtil.post(postdata)
        .success(function(data) {
          if (data.CODE == "MSG00000") {
            deferred.resolve(data.DATA.list);
          } else {
            deferred.reject(data.INFO);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        })
      return deferred.promise;
    };




  });

