/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CommandCheckCtrl",function($scope,Bills,ToastApi,BillProductSaleTypes,$ionicLoading,$state,$timeout,$rootScope,OmPayment){
    var memo=$rootScope.memo;
    console.log(memo);
    $scope.memo=memo;

    $scope.buy=function(type){

      show($ionicLoading);
      var bill=memo.bill;
      // enregistrement de la facture

      console.log(bill);
      Bills.post(bill).then(function(f){
        //console.log(f);
        f.id= f.data.id;
        $scope.bill= f.data;
        // enregistrement du bill_product_saletype
        var i=0;
        var temp=memo.commande.produits;
        angular.forEach(memo.commande.produits,function(v,k){
          BillProductSaleTypes.post({quantity:v.command_quantity,bill_id:f.data.id,product_saletype_id:v.product_saletype_id}).then(function(b){
            i++;
            //console.log(i,temp);
            if(i==temp.length){
              // changement du statut de la facture
              f.status=1;
              f.put().then(function(fe){
                console.log(fe);
              },function(q){
                console.log(q);
              });
              hide($ionicLoading);
            }
          },function(q){console.log(q)});

        });
        memo=undefined;
        ToastApi.success({msg:"Commande validée"});
        $timeout(function(){
          $state.go("app.home");
        },5000);
      },function(q){
        console.log(q);
      });
    };

    $scope.buyOM=function(){
      OmPayment.buy($scope.bill.id);
    }

  });
