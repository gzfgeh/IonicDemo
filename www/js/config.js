(function () {
 return angular.module("starter")
.constant("config", {
  //"apiUrl": "http://192.168.68.101:5400/shcem",          //测试地址
  //"apiUrl": "http://app.uat.shcem.com:5400/shcem", //UAT 地址
 // "apiUrl":"http://192.168.60.204:5412/shecm",
 // "uploaderUrl": "http://fms.shcem.com/api/file/UploadFileByUrl",
  //"uploaderUrl": "http://fms.test.shcem.com/api/file/UploadFileByUrl",
  //"downloadUrl": "http://fms.test.shcem.com/mapi/file/dynamicimage?id=",
  //"fileInfoUrl": "http://fms.test.shcem.com/mapi/file/FileInfos?ids=",


  "apiUrl": "http://app.uat.shcem.com:5400/shcem",       //不需要更换-架构会更换相应网关 appnew   uat
  "uploaderUrl": "http://fms.uat.shcem.com/mapi/file/uploadfile",
  "downloadUrl": "http://fms.uat.shcem.com/mapi/file/dynamicimage?id=",
  "fileInfoUrl": "http://fms.uat.shcem.com/mapi/file/FileInfos?ids=",
  "downFileUrl": "http://fms.uat.shcem.com/mapi",
  // "catogoryID" : 1879,  //UAT 首页轮播ID
  // "NoticeCatogoryID" : 1882,  //UAT 公告ID
  // "infoImgCategoryID":1880, //UAT 资讯图片ID
  // "theHotSpot" : ["1887"],     //热点访谈 uat-1887   生产-1918
  // "infoShareUrl": "http://inform.uat.shcem.com/Mobile/Index?QuotationID=",

	// "apiUrl": "http://appnew.shcem.com:5400/shcem",       //不需要更换-架构会更换相应网关 appnew  生产
  // "uploaderUrl": "http://fms.shcem.com/mapi/file/uploadfile",
  // "downloadUrl": "http://fms.shcem.com/mapi/file/dynamicimage?id=",
  // "fileInfoUrl": "http://fms.shcem.com/mapi/file/FileInfos?ids=",
  // "downFileUrl": "http://fms.shcem.com/mapi",
  "catogoryID" : 1895,  //首页轮播ID
  "NoticeCatogoryID" : 1885,  //公告ID
  "infoImgCategoryID":1896, //资讯图片ID
  "theHotSpot" : ["1918"],     //热点访谈 uat-1887   生产-1918
  "infoShareUrl": "http://inform.shcem.com/Mobile/Index?QuotationID=",

  "spotGoods":1,      //UAT现货权限ID
  "futureGoods":3,    //UAT预售权限ID
  "sinopec":7,        //UAT 中石化权限ID

  "topNum" : 5,    //首页轮播数
  "mode": "test"
});

})();




