/**
 * Created by Edward NANDA on 08/07/2018.
 */


app

  .controller("StockCtrl",function($scope,Auth,$stateParams,Stocks,ToastApi,Sellers,$ionicLoading,$state,$filter,$rootScope){
    show($ionicLoading);
    var depot_id=$stateParams.depot_id;

    $scope.refresh=function(){
      var option={
        should_paginate:false,
        _includes:"depot,product_saletype.product",
        depot_id:depot_id
      };

      Stocks.getList(option).then(function(data){
        console.log(data);
        $scope.stocks=data;
      })

    }

    $scope.refresh();


  });

