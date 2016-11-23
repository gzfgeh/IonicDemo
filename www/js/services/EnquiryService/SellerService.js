angular.module('starter.services')
.service('SellerService',function (UserService,shcemUtil) {
  var obj = {};

  this.setObj = function (_obj) {
    obj = _obj;
  }

  this.getObj = function () {
    return obj;
  }


   this.getSellList = function (info,succ,err) {
    info.OrderBy = "REC_CREATETIME";
    info.OrderByDirection = "Desc";
    var postData = {
      json:{
        "MethodName":"GetSellList",
        "ServiceName":"Shcem.Trade.ServiceContract.ILeadsService",
        "Params":JSON.stringify(info)
      }
    };
    shcemUtil.post(postData)
      .success(function (ret) {
        if(ret.CODE == 'MSG00000'){
          // ret.DATA.theWeight =
         succ(getNewMallList(ret.DATA.rows));
        }else {
          err(ret.INFO,ret.CODE);
          UserService.checkToken(ret.CODE);//权限检查
        }
      })
      .error(function (e) {
          err(e);
      })
  };


  function DateDiff(date) {
    var  aDate,  oDate2,  iDays;
    aDate  =  date.split(" ")[0].split("-");
    oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0] + " " + date.split(" ")[1]);
    iDays  =  parseInt(Math.abs(Date.parse(new Date())  -  oDate2));   //把相差的毫秒数转换为天数
    return  iDays;
  };

  function getNewMallList(mallList){
    var newMallList=[];
    for(var item in mallList){
      var mall=mallList[item];
      var date = DateDiff(mall.REC_CREATETIME);

      var tempDate = parseInt(date/  1000  /  60  /  60  /24);
      if (tempDate > 0){
        mall.preDate = tempDate + "天前";
      } else{
        tempDate = parseInt(date/  1000  /  60  /  60);
        if (tempDate > 0){
          mall.preDate = tempDate + "小时前";
        }else{
          tempDate = parseInt(date/  1000  /  60);
          mall.preDate = tempDate + "分钟前";
        }
      }
      newMallList.push(mall);
    }
    return newMallList;
  }

});
