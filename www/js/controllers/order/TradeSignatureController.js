/**
 * Created by lijianhui on 2016/9/17.
 */
angular.module('starter.controllers')
    .controller('tradeSignatureCtrl', function ($scope,$state,$rootScope,$ionicPopup,enquiryService,shcemUtil,myDeliveryService,receiptService) {
      //onCreate()
      $scope.$on('$ionicView.loaded',function () {
        $scope.item = enquiryService.getObj();
        myDeliveryService.getDeliveryList2(1,$scope.item.TraderID,$scope.item.FirmID,-1,70,$scope.item.OrderId,-1)
            .then(function (ret) {
              $scope.list = ret;
              $scope.list.forEach(function (each) {
                
                  each.TakenQuantity = each.Quantity;
                            })
            }, function (error) {
              shcemUtil.showMsg(error);
            })

        if ($scope.item.picAddr != undefined && $scope.item.picAddr.length > 0) {
          //查看签收单
          var picAddrList = [];
          $scope.PicAddrList = $scope.item.picAddr;
        }
      });

      $scope.goBack = function () {
        $scope.$ionicGoBack();
      }

        $scope.test='sectionchange';
        $scope.checkBlur=function(){
            $scope.test="";
        }
        $scope.findBlur=function(){
            $scope.test='sectionchange';
        }

      $scope.goPay = function () {
        //check
        var flag = true;
        $scope.list.forEach(function(each){
          var reg = /^\d+(\.\d{1,6})?$/; //小数点和数字，且小数点6位
          if (!reg.test(each.TakenQuantity)) {
            flag = false;
            return false;
          }
        });
        if (!flag) {
          shcemUtil.showMsg("请输入正确的交收数量");
          return;
        }

        var ReceiptTakenQuantityList = [];
        $scope.list.forEach(function(each){
          var ReceiptTakenQuantity = {
            DeliveryID:each.DeliveryID,
            Quantity:each.Quantity,
            TakenQuantity:each.TakenQuantity
          };
          ReceiptTakenQuantityList.push(ReceiptTakenQuantity);
        });

        var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        var postData = {
          OrderID:$scope.item.OrderId,
          CREATEBY:enquiryService.getUserInfo().UserCode,
          CREATETIME:dateTime,
          MODIFYBY:enquiryService.getUserInfo().UserCode,
          MODIFYTIME:dateTime,
          ReceiptFileList:[],
          ReceiptTakenQuantityList:ReceiptTakenQuantityList
        };
        //alert(JSON.stringify(postData));
        receiptService.Confirm(postData)
            .then(function (ret) {
              alertPopup();
            }, function (error) {
              shcemUtil.showMsg(error);
            })
      }

      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }

      $scope.imgObj={hide:true,url:''};
      $scope.showFullImg=function(url)
      {

        $scope.imgObj.url=url;
        $scope.imgObj.hide=false;

      }

      $scope.closeFullImg=function()
      {
        $scope.imgObj.hide=true;
      }

      $scope.pdfView=function(url)
      {
        window.location.href='#/tabs/pdfView?url='+url;
      }


      var alertPopup = function () {
        $ionicPopup.alert({
          template: '<div class="cus-dialog-main"><p>提交签收成功！</p></div>',
          buttons: [
            {
              text: '我知道了',
              type: 'button-positive cus-right-btn',
              onTap: function (e) {
                $scope.$emit('todo:MyTradeCtrl');
                $state.go("tabs.mytrade");
              }
            }
          ]
        });
      }

    })
