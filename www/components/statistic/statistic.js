/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("StatisticCtrl",function($scope,$ionicLoading,$stateParams,Stocks){
    show($ionicLoading);
    var depot_id=$stateParams.depot_id;

    // recuperation des factures de tous les employés de ce depot
io

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
