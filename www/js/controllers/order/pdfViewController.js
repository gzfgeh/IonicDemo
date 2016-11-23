/**
 * Created by lijianhui on 2016/9/17.
 */
angular.module('starter.controllers')
    .controller('PdfViewCtrl', function ($scope,$state,$rootScope,$ionicPopup,shcemUtil) {

        $scope.goBack = function () {
            $scope.$ionicGoBack();
        }

        var pdfUrl=window.location.href;


        $scope.pdfUrl="pdfView/web/viewer.html?url="+pdfUrl.split("url=")[1];


    })
