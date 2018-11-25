/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CommandPaymentCtrl",function($scope,Bills,ToastApi,$filter,$ionicLoading,OmPayment,$cookies,$stateParams,$timeout,$state){

    var bill_id=$stateParams.bill_id;
    var cashier_id=$stateParams.cashier_id;
    var bill=$cookies.getObject("bill");
    console.log(bill);
    $scope.bill=bill;

    /*Bills.getList({"should_paginate":false}).then(function (data) {
      var bill=$filter('filter')(data,{id: bill_id},true)[0];
      console.log(data,bill);
      bill.status=3;
      bill.cashier_id=cashier_id;
      // mode de paiement
      if(type=="om"){
        bill.paymentmethod_id=0;
      }
      else{
        bill.paymentmethod_id=0;
      }
      bill.put().then(function(f){
        console.log("update",f);
        $scope.statut= f.status;
        ToastApi.success({msg:"Commande soldée"})
      },function(q){
        console.log(q);
      });
    });*/



    $scope.buyOM=function(){
      OmPayment.buy($scope.bill.id);
    };

    $scope.buyCash=function(){
      show($ionicLoading);
      Bills.getList({"should_paginate":false}).then(function (data) {
        var bill=$filter('filter')(data,{id: bill_id})[0];
        //console.log(data,bill,bill_id);
        bill.status=2;
        bill.cashier_id=cashier_id;
        bill.put().then(function(f){
          //console.log("update",f);
          hide($ionicLoading);
          $scope.statut= f.status;
          ToastApi.success({msg:"Commande soldée"});
          $timeout(function(){
            $state.go("app.command-list");
          },5000);
        },function(q){
          console.log(q);
        });
      });
    }

  });
