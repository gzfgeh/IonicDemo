/**
 * Created by lijianhui on 2016/9/17.
 */
angular.module('starter.controllers')
    .controller('TradeBreakCtrl', function ($scope,$state,$rootScope,$ionicPopup,$stateParams,enquiryService,BreakContractService,shcemUtil) {
      $scope.$on('$ionicView.beforeEnter', function() {
        getOrderInfo();
        var checkArray = document.getElementsByTagName("input");
        for(i = 0 ;i<checkArray.length;i++){
          checkArray[i].checked = false;
        }
      });
      $scope.test='mallfix';
      $scope.checkBlur=function(){
        $scope.test='';
      }
      $scope.findBlur=function(){
        $scope.test='mallfix';
      };
      $scope.keyUp=function(){
        $scope.item.ApplyQuantityDun=parseFloat((($scope.item.ApplyQuantity==null?0:$scope.item.ApplyQuantity)*$scope.item.TradeUnitNumber).toFixed(6));
      };
      var getOrderInfo = function() {
        $scope.item = enquiryService.getObj();
        if ($scope.item.Quantity==$scope.item.NoDeliveryQuantity){
          $scope.ischangeQ=true;
        }else {
          $scope.ischangeQ=false;
        }
        $scope.NodeliveryQ = $scope.item.NoDeliveryQuantity;//未申请交收批数
        if ($scope.NodeliveryQ==0){
          $scope.isDislasttable=false;
        }else {
          $scope.isDislasttable=true;
        }
        //已发委托书数量
        $scope.hadsendQ = $scope.item.Quantity-$scope.item.NoDeliveryQuantity;
        $scope.hadsendW = parseFloat($scope.hadsendQ*$scope.item.TradeUnitNumber).toFixed(6)*1;
        // var a = $scope.hadsendW*1;
        $scope.NodeliveryW = $scope.item.NoDeliveryQuantity*$scope.item.TradeUnitNumber;//未申请交收重量
        var tradeRole = $stateParams.TradeRole;
        if (tradeRole==0) { //卖家
          $scope.item.ApplyMaxQuantity = $scope.item.Quantity;
          $scope.item.ApplyQuantity = $scope.item.ApplyMaxQuantity;
          $scope.deliverystatuslist = [1,5,10,15,17,20,25,30,35,40,45,50];
        } else {  //买家
          $scope.item.ApplyMaxQuantity = $scope.item.Quantity-$scope.item.TotalSendedQuantity;
          $scope.item.ApplyQuantity = $scope.item.ApplyMaxQuantity;
          $scope.deliverystatuslist = [1,5,10,15];
          if ($scope.item.TotalSendedQuantity ==0) {
            $scope.ApplyQuantityDisabled = true;

          } else {
            $scope.ApplyQuantityDisabled = false;
          }
        }
        $scope.result =0;
        //触发选择事件
        $scope.breachtotalMoney=0;
        $scope.deliveryIds=[];
        var ischecked;//未申请交收部分是否被选中
        var changeQ; //选中时未申请交收部分的值
        $scope.select = function (quantity,event,deliveryid) {
          var action = event.target;
          var Quantity=quantity*1;
          if (action.checked){
            $scope.result =  $scope.result+Quantity;
            $scope.applybreachW =parseFloat($scope.result*$scope.item.TradeUnitNumber).toFixed(6)*1;
            $scope.breachtotalMoney = $scope.result*$scope.item.TradeUnitNumber*$scope.item.Price*$scope.item.BreakProFee;
            if (deliveryid!=-1){
              if($scope.deliveryIds.indexOf(deliveryid) == -1){//不存在就添加
                $scope.deliveryIds.push(deliveryid);
              }

            }else {
              ischecked=true;
              changeQ = Quantity;
            }
          }else {
            $scope.result = $scope.result-Quantity;
            $scope.applybreachW = parseFloat($scope.result*$scope.item.TradeUnitNumber).toFixed(6)*1;
            $scope.breachtotalMoney = $scope.result*$scope.item.TradeUnitNumber*$scope.item.BreakProFee*$scope.item.Price;
            if(deliveryid!=-1){
              var idx = $scope.deliveryIds.indexOf(deliveryid);
              if( idx != -1){//不存在就添加
                $scope.deliveryIds.splice(idx,1);
              }

            }else {
              ischecked=false;
            }
          }
        };
        $scope.NodeliveryQa=$scope.item.NoDeliveryQuantity;
        //输入事件监听
        $scope.change = function (quatity) {
          if(ischecked){
            if (!isNaN(quatity)){
            var q = quatity*1;
            $scope.result=$scope.result-changeQ+q;
            $scope.applybreachW = parseFloat($scope.result*$scope.item.TradeUnitNumber).toFixed(6)*1;
            $scope.breachtotalMoney = $scope.result*$scope.item.TradeUnitNumber*$scope.item.BreakProFee*$scope.item.Price;
            changeQ =q;}else {
              shcemUtil.showMsg("请输入正确的数字");
            }
          }
        };
        enquiryService.GetBreachDeliveryList($scope.item.OrderId,$scope.deliverystatuslist)
          .then(function (ret) {
            $scope.deliverybreachlist=ret;

          },function (err) {

          });
        $scope.item.ApplyMaxQuantityDun = parseFloat(($scope.item.ApplyMaxQuantity*$scope.item.TradeUnitNumber).toFixed(6));
        $scope.item.ApplyQuantityDun = parseFloat(($scope.item.ApplyQuantity*$scope.item.TradeUnitNumber).toFixed(6));
        $scope.item.TotalSendedQuantityDun = parseFloat(($scope.item.TotalSendedQuantity*$scope.item.TradeUnitNumber).toFixed(6));
      }


      $scope.reasonchange=function (reason) {
        $scope.breachreason = reason;
      }
      $scope.tradeBreak=function() {
        if ($scope.result <= 0) {
          shcemUtil.showMsg("申请违约数量必须大于0");
          return;
        }else if($scope.result > $scope.item.ApplyMaxQuantity){
          shcemUtil.showMsg("申请违约数量不能大于最大可违约数量");
          return;
        }
        var requestParam = {
          OrderID: $scope.item.OrderId,
          Reason: $scope.breachreason,
          DeliveryIDs:$scope.deliveryIds,
          Quantity: $scope.NodeliveryQ,
          QueryType: $scope.item.QueryType,
          ButtonID: $stateParams.ButtonID,
          UserCode: enquiryService.getUserInfo().UserCode
        };

        BreakContractService.breakContract(requestParam)
          .then(function (ret) {
            alertPopup();
          }, function (err) {
            shcemUtil.showMsg(err);
          }).finally(function () {

        })



        var alertPopup = function () {
          $ionicPopup.alert({
            template: '<div class="cus-dialog-main"><p>您的违约申请已提交，如需查询详情请致电客服：4007-209-209</p></div>',
            buttons: [
              {
                text: '确定',
                type: 'button-positive cus-right-btn',
                onTap: function (e) {
                  $scope.$emit('todo:MyTradeCtrl');
                  $state.go("tabs.mytrade");
                }
              }
            ]
          });
        }
      }
      $scope.goBack = function () {
        $scope.$ionicGoBack();
      }
    })
